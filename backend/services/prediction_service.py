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
    
    def predict(self, input_data):
        """
        Predict plant age from measurement value or feature vector
        
        Args:
            input_data: Single numeric measurement or pixel feature vector
            
        Returns:
            float: Predicted age in days
        """
        if self._model is None:
            raise RuntimeError("Model not loaded")
        
        try:
            # If input_data is a feature vector (e.g., pixel data)
            if isinstance(input_data, (list, np.ndarray)):
                X = np.array(input_data).reshape(1, -1)
            else:
                # Traditional single-value numeric input
                measurement = float(input_data)
                X = np.array([[measurement]])
            
            # Make prediction
            prediction = self._model.predict(X)
            
            # Extract the raw number (Scikit-learn returns an array [val])
            predicted_age = float(prediction[0])
            
            # Round and ensure it's at least a small positive number
            return round(max(0.1, predicted_age), 1)
            
        except Exception as e:
            print(f"DEBUG: Prediction model error: {e}")
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
