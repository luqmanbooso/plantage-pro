import io
import requests
from PIL import Image, ImageStat
import numpy as np
from config import Config

class VisionService:
    """Service for processing plant images to extract measurement proxies and identity"""
    
    @staticmethod
    def identify_plant(image_file):
        """
        Identify plant species using PlantNet API.
        """
        try:
            api_key = Config.PLANTNET_API_KEY
            if not api_key:
                print("WARNING: PLANTNET_API_KEY not found in config")
                return "Unknown", 0.0

            # Prepare image for PlantNet
            # Move pointer to start if it's a file stream
            image_file.seek(0)
            image_data = image_file.read()
            image_file.seek(0) # Reset for further use

            files = {
                'images': ('image.jpg', image_data, 'image/jpeg')
            }
            data = {
                'organs': ['auto']
            }
            params = {
                'api-key': api_key
            }

            response = requests.post(
                'https://my-api.plantnet.org/v2/identify/all',
                params=params,
                data=data,
                files=files
            )

            if response.status_code != 200:
                print(f"PlantNet API error: {response.status_code} - {response.text}")
                return "Unknown", 0.0

            result = response.json()
            if result.get('results'):
                best_match = result['results'][0]
                species_name = best_match['species']['scientificNameWithoutAuthor']
                score = best_match['score']
                return species_name, score
            
            return "Unknown", 0.0

        except Exception as e:
            print(f"PlantNet identification error: {e}")
            return "Unknown", 0.0

    @staticmethod
    def extract_measurement(image_file):
        """
        Extract a numeric measurement proxy (height/size) from an uploaded image file.
        """
        try:
            # Load image
            image_file.seek(0)
            img = Image.open(image_file)
            
            # 1. Base measurement from image dimensions
            width, height = img.size
            dim_proxy = (np.log10(width * height + 1) / 5.0) * 10
            
            # 2. Adjust based on 'greenness'
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            stats = ImageStat.Stat(img)
            avg_color = stats.mean # [R, G, B]
            
            r, g, b = avg_color
            greenness = g / (r + b + 1e-6)
            
            # 3. Final calculation (Height proxy)
            # Typically returns values between 10 and 60
            measurement = 20.0 + (dim_proxy * 2.0) + (greenness * 10.0)
            
            # Round to 2 decimal places
            measurement = round(float(measurement), 2)
            
            # Bound it (e.g. 5cm to 150cm range for the model)
            measurement = max(5.0, min(150.0, measurement))
            
            return measurement
            
        except Exception as e:
            print(f"Vision processing error: {e}")
            raise ValueError(f"Could not process image: {str(e)}")

vision_service = VisionService()
