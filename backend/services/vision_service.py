import io
from PIL import Image, ImageStat
import numpy as np

class VisionService:
    """Service for processing plant images to extract measurement proxies"""
    
    @staticmethod
    def extract_measurement(image_file):
        """
        Extract a numeric measurement proxy from an uploaded image file.
        
        This uses image properties (size, brightness, color balance) to 
        calculate a predictable 'measurement' value that fits the 
        expected range of the Linear Regression model.
        """
        try:
            # Load image
            img = Image.open(image_file)
            
            # 1. Base measurement from image dimensions (larger images = more 'biomass')
            # Normalized log-scale to keep it within sensible bounds
            width, height = img.size
            dim_proxy = (np.log(width * height) / 10.0) * 10
            
            # 2. Adjust based on 'greenness' (plant health/maturity proxy)
            # Convert to RGB if needed
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Simple color stats
            stats = ImageStat.Stat(img)
            avg_color = stats.mean # [R, G, B]
            
            # Greenness ratio: G / (R + B)
            r, g, b = avg_color
            greenness = g / (r + b + 1e-6)
            
            # 3. Final calculation
            # We want a value typically between 5.0 and 50.0 for the current model
            # Base value around 15, shifted by dimensions and color
            measurement = 15.0 + (dim_proxy * 0.5) + (greenness * 5.0)
            
            # Round to 2 decimal places
            measurement = round(float(measurement), 2)
            
            # Ensure it's positive and not too extreme
            measurement = max(2.0, min(100.0, measurement))
            
            return measurement
            
        except Exception as e:
            print(f"Vision processing error: {e}")
            raise ValueError(f"Could not process image: {str(e)}")

vision_service = VisionService()
