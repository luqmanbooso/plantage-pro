from routes.auth import auth_bp
from routes.user import user_bp
from routes.prediction import prediction_bp
from routes.admin import admin_bp

__all__ = ['auth_bp', 'user_bp', 'prediction_bp', 'admin_bp']
