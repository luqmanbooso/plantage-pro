from flask import Blueprint, request
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity
from datetime import timedelta
from database import get_db
from models import User, PasswordResetToken
from utils import success_response, error_response, validate_required_fields
from werkzeug.security import generate_password_hash

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        valid, error_msg = validate_required_fields(data, ['full_name', 'email', 'password'])
        if not valid:
            return error_response(error_msg, 400)
        
        db = get_db()
        
        # Create user
        user = User.create(
            db,
            full_name=data['full_name'],
            email=data['email'],
            password=data['password']
        )
        
        # Generate JWT tokens
        access_token = create_access_token(identity=str(user['_id']))
        refresh_token = create_refresh_token(identity=str(user['_id']))
        
        return success_response(
            data={
                'user': User.to_dict(user),
                'access_token': access_token,
                'refresh_token': refresh_token
            },
            message="Registration successful",
            status=201
        )
        
    except ValueError as e:
        return error_response(str(e), 400)
    except Exception as e:
        return error_response(f"Registration failed: {str(e)}", 500)


@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        valid, error_msg = validate_required_fields(data, ['email', 'password'])
        if not valid:
            return error_response(error_msg, 400)
        
        db = get_db()
        
        # Verify credentials
        user, error = User.verify_password(db, data['email'], data['password'])
        
        if error:
            return error_response(error, 401)
        
        # Check remember_me option
        remember_me = data.get('remember_me', False)
        
        # Generate JWT tokens
        if remember_me:
            # 30 days for remember me
            access_token = create_access_token(
                identity=str(user['_id']),
                expires_delta=timedelta(days=30)
            )
        else:
            # Default expiry from config
            access_token = create_access_token(identity=str(user['_id']))
        
        refresh_token = create_refresh_token(identity=str(user['_id']))
        
        return success_response(
            data={
                'user': User.to_dict(user),
                'access_token': access_token,
                'refresh_token': refresh_token
            },
            message="Login successful"
        )
        
    except Exception as e:
        return error_response(f"Login failed: {str(e)}", 500)


@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """Request password reset"""
    try:
        data = request.get_json()
        
        # Validate required fields
        valid, error_msg = validate_required_fields(data, ['email'])
        if not valid:
            return error_response(error_msg, 400)
        
        db = get_db()
        user = User.find_by_email(db, data['email'])
        
        # Always return success to prevent email enumeration
        if not user:
            return success_response(
                message="If the email exists, a password reset link has been generated"
            )
        
        # Generate reset token
        reset_token = PasswordResetToken.create(db, user['_id'])
        
        # Log token to server console instead of sending email
        print(f"Password reset token generated for {user['email']}: {reset_token}")
        
        return success_response(
            message="If the email exists, a password reset link has been generated"
        )
        
    except Exception as e:
        return error_response(f"Password reset request failed: {str(e)}", 500)


@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    """Reset password with token"""
    try:
        data = request.get_json()
        
        # Validate required fields
        valid, error_msg = validate_required_fields(data, ['token', 'new_password'])
        if not valid:
            return error_response(error_msg, 400)
        
        db = get_db()
        
        # Verify token
        token_doc, error = PasswordResetToken.verify(db, data['token'])
        
        if error:
            return error_response(error, 400)
        
        # Validate new password
        if not User.validate_password(data['new_password']):
            return error_response("Password must be at least 8 characters and include at least one number", 400)
        
        # Update password
        db.users.update_one(
            {'_id': token_doc['user_id']},
            {'$set': {'password_hash': generate_password_hash(data['new_password'])}}
        )
        
        # Delete used token
        PasswordResetToken.delete(db, data['token'])
        
        return success_response(message="Password reset successful")
        
    except Exception as e:
        return error_response(f"Password reset failed: {str(e)}", 500)


@auth_bp.route('/refresh', methods=['POST'])
def refresh():
    """Refresh access token"""
    from flask_jwt_extended import jwt_required as jwt_refresh_required
    try:
        jwt_refresh_required(refresh=True)
        user_id = get_jwt_identity()
        
        new_access_token = create_access_token(identity=user_id)
        
        return success_response(
            data={'access_token': new_access_token},
            message="Token refreshed"
        )
        
    except Exception as e:
        return error_response(f"Token refresh failed: {str(e)}", 401)
