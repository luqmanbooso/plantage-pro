import joblib
import os
from sklearn.base import is_classifier, is_regressor

def analyze_model(model_path):
    if not os.path.exists(model_path):
        print(f"Error: {model_path} not found.")
        return

    try:
        model = joblib.load(model_path)
        print(f"Model File: {model_path}")
        print(f"Model Type: {type(model)}")
        
        if hasattr(model, 'coef_'):
            print(f"Coefficients (coef_): {model.coef_}")
        
        if hasattr(model, 'intercept_'):
            print(f"Intercept (intercept_): {model.intercept_}")

        if hasattr(model, 'n_features_in_'):
            print(f"Number of input features (n_features_in_): {model.n_features_in_}")

    except Exception as e:
        print(f"Error loading model: {e}")

if __name__ == "__main__":
    # Check both potential locations
    paths = ['plant_age_model.pkl', '../plant_age_model.pkl']
    for p in paths:
        if os.path.exists(p):
            analyze_model(p)
            break
