import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_mail import Mail

from config import Config
from database import Database, get_db

bcrypt = Bcrypt()
jwt = JWTManager()
mail = Mail()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    CORS(app, resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}})
    bcrypt.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)
    
    try:
        db = Database(app.config["MONGODB_URI"], app.config["MONGODB_DB_NAME"])
    except Exception as e:
        app.logger.error(f"Failed to initialize database: {e}")

    try:
        from services.prediction_service import prediction_service
        app.config["ML_MODEL_INFO"] = prediction_service.get_model_info()
    except Exception as e:
        app.logger.error(f"Failed to initialize ML model: {e}")

    from routes.auth import auth_bp
    from routes.user import user_bp
    from routes.prediction import prediction_bp
    from routes.admin import admin_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(user_bp, url_prefix="/api/users")
    app.register_blueprint(prediction_bp, url_prefix="/api/predictions")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")

    @app.route("/health")
    def health_check():
        from services.prediction_service import prediction_service
        return jsonify({
            "status": "healthy",
            "model": prediction_service.get_model_info()
        })
        
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
