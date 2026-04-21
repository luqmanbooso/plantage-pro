import os
import random
import pandas as pd
from PIL import Image, ImageDraw

def generate_training_library(count=100):
    image_folder = 'training_images'
    if not os.path.exists(image_folder):
        os.makedirs(image_folder)

    data = []
    print(f"Generating {count} synthetic training images...")

    for i in range(1, count + 1):
        filename = f"plant_sample_{i}.jpg"
        filepath = os.path.join(image_folder, filename)
        
        # We create images that vary in 'size' and 'greenness' based on age
        # This teaches the AI the correlation
        age = random.randint(1, 100) # Age in days
        
        # Basic visual logic: Older plants are bigger and darker green
        size = int(64 + (age * 1.5))
        img = Image.new('RGB', (200, 200), (20, 20, 20)) # Dark background
        draw = ImageDraw.Draw(img)
        
        # Draw a 'plant-like' shape whose size and color varies with age
        # Younger = small, bright green circle
        # Older = large, dark green/brownish circle
        green_val = max(100, 255 - age)
        red_val = min(150, age)
        
        shape_size = 20 + (age * 1.5)
        center = (100, 100)
        draw.ellipse([100-shape_size/2, 100-shape_size/2, 100+shape_size/2, 100+shape_size/2], 
                    fill=(red_val, green_val, 30))

        img.save(filepath)
        data.append({'image_path': filename, 'age_days': age})

    # Save to CSV
    df = pd.DataFrame(data)
    df.to_csv('image_dataset.csv', index=False)
    print(f"SUCCESS: 100 images generated and recorded in image_dataset.csv")

if __name__ == "__main__":
    generate_training_library(100)
