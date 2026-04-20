from flask import Blueprint, request
from flask_jwt_extended import jwt_required as jwt_required_decorator
from database import get_db
from models import User
from utils import success_response, error_response, get_current_user

user_bp = Blueprint('user', __name__, url_prefix='/api/user')

@user_bp.route('/profile', methods=['GET'])
@jwt_required_decorator()
def get_profile():
    """Get user profile"""
    try:
        user = get_current_user()
        
        if not user:
            return error_response("User not found", 404)
        
        return success_response(data={'user': User.to_dict(user)})
        
    except Exception as e:
        return error_response(f"Failed to get profile: {str(e)}", 500)


@user_bp.route('/profile', methods=['PUT'])
@jwt_required_decorator()
def update_profile():
    """Update user profile"""
    try:
        user = get_current_user()
        
        if not user:
            return error_response("User not found", 404)
        
        data = request.get_json()
        db = get_db()
        
        # Update profile
        User.update_profile(
            db,
            user['_id'],
            full_name=data.get('full_name'),
            profile_photo_url=data.get('profile_photo_url')
        )
        
        # Get updated user
        updated_user = User.find_by_id(db, user['_id'])
        
        return success_response(
            data={'user': User.to_dict(updated_user)},
            message="Profile updated successfully"
        )
        
    except Exception as e:
        return error_response(f"Failed to update profile: {str(e)}", 500)


@user_bp.route('/password', methods=['PUT'])
@jwt_required_decorator()
def change_password():
    """Change user password"""
    try:
        user = get_current_user()
        
        if not user:
            return error_response("User not found", 404)
        
        data = request.get_json()
        
        # Validate required fields
        if not data.get('current_password') or not data.get('new_password'):
            return error_response("Current password and new password are required", 400)
        
        db = get_db()
        
        # Change password
        User.change_password(
            db,
            user['_id'],
            data['current_password'],
            data['new_password']
        )
        
        return success_response(message="Password changed successfully")
        
    except ValueError as e:
        return error_response(str(e), 400)
    except Exception as e:
        return error_response(f"Failed to change password: {str(e)}", 500)


@user_bp.route('/account', methods=['DELETE'])
@jwt_required_decorator()
def delete_account():
    """Schedule account for deletion"""
    try:
        user = get_current_user()
        
        if not user:
            return error_response("User not found", 404)
        
        db = get_db()
        
        # Schedule deletion
        deletion_date = User.schedule_deletion(db, user['_id'])
        
        return success_response(
            data={'deletion_date': deletion_date.isoformat()},
            message="Account scheduled for deletion. You have 7 days to cancel."
        )
        
    except Exception as e:
        return error_response(f"Failed to delete account: {str(e)}", 500)
