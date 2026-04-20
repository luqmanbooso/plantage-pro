import joblib
import os
import numpy as np

class PredictionService:
    """ML Model service for plant age prediction"""
    
    _instance = None
    _model = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(PredictionService, cls).__new__(cls)
            cls._instance._load_model()
        return cls._instance
    
    def _load_model(self):
        """Load the trained model"""
        try:
            from config import Config
            model_path = Config.MODEL_PATH
            
            if not os.path.exists(model_path):
                raise FileNotFoundError(f"Model file not found at {model_path}")
            
            self._model = joblib.load(model_path)
            print(f"SUCCESS: ML Model loaded successfully from {model_path}")
            print(f"  Model type: {type(self._model).__name__}")
            
        except Exception as e:
            print(f"ERROR: Failed to load ML model: {e}")
            raise
    
    def predict(self, measurement_value):
        """
        Predict plant age from measurement value
        
        Args:
            measurement_value: Single numeric measurement
            
        Returns:
            float: Predicted age in years (with decimal precision)
        """
        if self._model is None:
            raise RuntimeError("Model not loaded")
        
        try:
            # Validate input
            measurement = float(measurement_value)
            
            if measurement <= 0:
                raise ValueError("Measurement value must be positive")
            
            # Prepare input (reshape for sklearn)
            X = np.array([[measurement]])
            
            # Make prediction
            predicted_age = self._model.predict(X)[0]
            
            # Round to 1 decimal place
            predicted_age = round(float(predicted_age), 1)
            
            # Ensure non-negative
            predicted_age = max(0, predicted_age)
            
            return predicted_age
            
        except ValueError as e:
            raise ValueError(f"Invalid measurement value: {e}")
        except Exception as e:
            raise RuntimeError(f"Prediction failed: {e}")
    
    def get_model_info(self):
        """Get model information"""
        if self._model is None:
            return None
        
        return {
            'type': type(self._model).__name__,
            'loaded': True
        }

# Singleton instance
prediction_service = PredictionService()
