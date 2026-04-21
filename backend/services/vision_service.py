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
        Identify plant species using PlantNet API (Strict Doc implementation).
        """
        try:
            api_key = Config.PLANTNET_API_KEY
            if not api_key:
                print("DEBUG: No API key found in configuration.")
                return "Unknown", 0.0

            # Step 1: Standardize the image (Convert for Pl@ntNet compatibility)
            # This ensures WP, BMP, PNG, etc. are all sent as valid JPEG
            image_file.seek(0)
            with Image.open(image_file) as img:
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Save as JPEG into a bytes buffer
                buffer = io.BytesIO()
                img.save(buffer, format='JPEG', quality=90)
                standardized_image_data = buffer.getvalue()

            # Pl@ntNet requirements: organs must be a list
            data = { 'organs': ['habit'] }
            files = [('images', ('image.jpg', standardized_image_data, 'image/jpeg'))]

            api_endpoint = f"https://my-api.plantnet.org/v2/identify/all?api-key={api_key}"

            print(f"DEBUG: Attempting PlantNet identification (Standardized Image) at {api_endpoint}")
            
            response = requests.post(
                api_endpoint,
                files=files,
                data=data,
                timeout=20
            )

            print(f"DEBUG: PlantNet Status: {response.status_code}")
            
            if response.status_code != 200:
                print(f"DEBUG: API Error Detail: {response.text}")
                return "Unknown", 0.0

            result = response.json()
            if result.get('results'):
                best_match = result['results'][0]
                species_name = best_match['species']['scientificNameWithoutAuthor']
                score = best_match['score']
                print(f"DEBUG: Identified as {species_name} with {score} confidence")
                return species_name, score
            
            return "Unknown", 0.0

        except Exception as e:
            print(f"DEBUG: Exception during identification: {str(e)}")
            return "Unknown", 0.0

    @staticmethod
    def extract_image_features(image_file):
        """
        Converts an image into a numeric vector for direct model prediction.
        Must match the logic in train_image_model.py
        """
        try:
            image_file.seek(0)
            img = Image.open(image_file).convert('RGB')
            img = img.resize((64, 64))
            
            # 1. Pixel Data
            pixels = np.array(img).flatten() / 255.0
            
            # 2. Color Distribution
            hist = np.array(img.histogram()).flatten() / (64*64)
            
            return np.concatenate([pixels, hist])
        except Exception as e:
            print(f"Feature extraction error: {e}")
            return None

    @staticmethod
    def extract_measurement(image_file):
        # We keep this for backward compatibility and UI display
        try:
            image_file.seek(0)
            img = Image.open(image_file)
            width, height = img.size
            dim_proxy = (np.log10(width * height + 1) / 5.0) * 1.5
            if img.mode != 'RGB':
                img = img.convert('RGB')
            stats = ImageStat.Stat(img)
            r, g, b = stats.mean 
            greenness = g / (r + b + 1e-6)
            base_val = 1.9 
            measurement = base_val + (dim_proxy * 0.2) + (greenness * 0.1)
            return round(float(measurement), 3)
        except Exception:
            return 2.0

vision_service = VisionService()
