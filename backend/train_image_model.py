import os
import pandas as pd
import numpy as np
import joblib
from PIL import Image
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split

def extract_image_features(image_path):
    """
    Converts a single image into a numeric vector of features.
    """
    try:
        # Load and resize to a constant small size (e.g. 64x64)
        img = Image.open(image_path).convert('RGB')
        img = img.resize((64, 64))
        
        # 1. Raw Pixel Data (Downsampled)
        pixels = np.array(img).flatten() / 255.0
        
        # 2. Color Distribution (Histograms)
        # This helps the model understand the balance of green/brown
        hist = np.array(img.histogram()).flatten() / (64*64)
        
        # Combine both into one long 'Image Signature'
        return np.concatenate([pixels, hist])
    except Exception as e:
        print(f"Error processing {image_path}: {e}")
        return None

def train_image_model():
    dataset_path = 'image_dataset.csv'
    image_folder = 'training_images'
    
    if not os.path.exists(dataset_path):
        print("Error: image_dataset.csv not found.")
        return

    print("Loading image dataset...")
    df = pd.read_csv(dataset_path)
    
    all_features = []
    valid_ages = []
    
    print("Extracting features from pixels (this may take a moment)...")
    
    # Logic 1: Load from CSV
    for index, row in df.iterrows():
        img_path = os.path.join(image_folder, row['image_path'])
        if os.path.exists(img_path):
            features = extract_image_features(img_path)
            if features is not None:
                all_features.append(features)
                valid_ages.append(row['age_days'])
    
    # Logic 2: Auto-discover months-wise folders (Your new data!)
    for folder_name in os.listdir(image_folder):
        if folder_name.startswith('months_'):
            try:
                months = int(folder_name.split('_')[1])
                # Convert months to days (handling 12 as 365, others as 30-day months)
                age_in_days = 365 if months == 12 else (730 if months == 24 else months * 30)
                folder_path = os.path.join(image_folder, folder_name)
                
                print(f"-> Processing folder {folder_name} (Age: {age_in_days} days)")
                for img_file in os.listdir(folder_path):
                    if img_file.lower().endswith(('.jpg', '.jpeg', '.png')):
                        img_path = os.path.join(folder_path, img_file)
                        features = extract_image_features(img_path)
                        if features is not None:
                            all_features.append(features)
                            valid_ages.append(age_in_days)
            except (ValueError, IndexError):
                continue

    if not all_features:
        print("Error: No valid images found to train on.")
        return

    X = np.array(all_features)
    y = np.array(valid_ages)

    print(f"Training on {len(X)} images...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=42)

    # Train the 'Visual Brain'
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Save as the official model
    joblib.dump(model, 'plant_age_model.pkl')
    # Save the feature extraction config so the app knows how to process new images
    print("SUCCESS: Direct Image Model trained and deployed.")

if __name__ == "__main__":
    train_image_model()
