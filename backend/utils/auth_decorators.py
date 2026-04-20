from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from database import get_db
from models.user import User

def jwt_required():
    """Decorator to require JWT authentication"""
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            try:
                verify_jwt_in_request()
                return fn(*args, **kwargs)
            except Exception as e:
                return jsonify({'error': 'Authentication required', 'message': str(e)}), 401
        return wrapper
    return decorator

def get_current_user():
    """Get current authenticated user"""
    try:
        user_id = get_jwt_identity()
        db = get_db()
        user = User.find_by_id(db, user_id)
        
        if not user:
            return None
        
        if not user.get('is_active', True):
            return None
        
        return user
    except:
        return None

def admin_required():
    """Decorator to require admin role"""
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            try:
                verify_jwt_in_request()
                user = get_current_user()
                
                if not user:
                    return jsonify({'error': 'User not found'}), 404
                
                if user.get('role') != 'admin':
                    return jsonify({'error': 'Admin access required'}), 403
                
                return fn(*args, **kwargs)
            except Exception as e:
                return jsonify({'error': 'Authentication required', 'message': str(e)}), 401
        return wrapper
    return decorator
