from flask import Blueprint, request
from flask_jwt_extended import jwt_required as jwt_required_decorator
from database import get_db
from models import User, Prediction
from utils import success_response, error_response, get_current_user
from bson import ObjectId

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

def admin_required_check():
    """Check if current user is admin"""
    user = get_current_user()
    
    if not user:
        return None, error_response("User not found", 404)
    
    if user.get('role') != 'admin':
        return None, error_response("Admin access required", 403)
    
    return user, None


@admin_bp.route('/stats', methods=['GET'])
@jwt_required_decorator()
def get_stats():
    """Get system statistics"""
    try:
        user, error = admin_required_check()
        if error:
            return error
        
        db = get_db()
        
        # Total users
        total_users = db.users.count_documents({'is_active': True})
        
        # Prediction stats
        pred_stats = Prediction.get_stats(db)
        
        # Get most active users with details
        most_active_users = []
        for item in pred_stats['most_active_users']:
            user_doc = User.find_by_id(db, item['_id'])
            if user_doc:
                most_active_users.append({
                    'user': User.to_dict(user_doc),
                    'prediction_count': item['count']
                })
        
        return success_response(
            data={
                'total_users': total_users,
                'total_predictions': pred_stats['total_predictions'],
                'predictions_today': pred_stats['predictions_today'],
                'most_active_users': most_active_users
            }
        )
        
    except Exception as e:
        return error_response(f"Failed to get stats: {str(e)}", 500)


@admin_bp.route('/users', methods=['GET'])
@jwt_required_decorator()
def get_users():
    """Get all users with search and filter"""
    try:
        user, error = admin_required_check()
        if error:
            return error
        
        db = get_db()
        
        # Get query parameters
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 50))
        search = request.args.get('search')
        status = request.args.get('status')  # 'active' or 'inactive'
        
        # Build query
        query = {}
        
        if search:
            query['$or'] = [
                {'full_name': {'$regex': search, '$options': 'i'}},
                {'email': {'$regex': search, '$options': 'i'}}
            ]
        
        if status:
            query['is_active'] = (status == 'active')
        
        # Calculate skip
        skip = (page - 1) * limit
        
        # Get users
        users = list(db.users.find(query)
                    .sort('created_at', -1)
                    .skip(skip)
                    .limit(limit))
        
        total = db.users.count_documents(query)
        
        return success_response(
            data={
                'users': [User.to_dict(u) for u in users],
                'total': total,
                'page': page,
                'limit': limit,
                'pages': (total + limit - 1) // limit
            }
        )
        
    except Exception as e:
        return error_response(f"Failed to get users: {str(e)}", 500)


@admin_bp.route('/users/<user_id>', methods=['PUT'])
@jwt_required_decorator()
def update_user(user_id):
    """Update user status (activate/deactivate)"""
    try:
        admin, error = admin_required_check()
        if error:
            return error
        
        data = request.get_json()
        db = get_db()
        
        # Find user
        target_user = User.find_by_id(db, user_id)
        
        if not target_user:
            return error_response("User not found", 404)
        
        # Prevent self-deactivation
        if str(target_user['_id']) == str(admin['_id']):
            return error_response("Cannot modify your own account", 400)
        
        # Update status
        if 'is_active' in data:
            db.users.update_one(
                {'_id': ObjectId(user_id)},
                {'$set': {'is_active': data['is_active']}}
            )
        
        # Get updated user
        updated_user = User.find_by_id(db, user_id)
        
        return success_response(
            data={'user': User.to_dict(updated_user)},
            message="User updated successfully"
        )
        
    except Exception as e:
        return error_response(f"Failed to update user: {str(e)}", 500)


@admin_bp.route('/users/<user_id>', methods=['DELETE'])
@jwt_required_decorator()
def delete_user(user_id):
    """Delete a user permanently"""
    try:
        admin, error = admin_required_check()
        if error:
            return error
        
        db = get_db()
        
        # Find user
        target_user = User.find_by_id(db, user_id)
        
        if not target_user:
            return error_response("User not found", 404)
        
        # Prevent self-deletion
        if str(target_user['_id']) == str(admin['_id']):
            return error_response("Cannot delete your own account", 400)
        
        # Delete user's predictions
        db.predictions.delete_many({'user_id': ObjectId(user_id)})
        
        # Delete user
        db.users.delete_one({'_id': ObjectId(user_id)})
        
        return success_response(message="User deleted successfully")
        
    except Exception as e:
        return error_response(f"Failed to delete user: {str(e)}", 500)


@admin_bp.route('/predictions', methods=['GET'])
@jwt_required_decorator()
def get_all_predictions():
    """Get all predictions from all users"""
    try:
        user, error = admin_required_check()
        if error:
            return error
        
        # Get query parameters
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 100))
        
        # Calculate skip
        skip = (page - 1) * limit
        
        # Get predictions
        db = get_db()
        predictions, total = Prediction.get_all(db, skip=skip, limit=limit)
        
        # Include user info
        predictions_with_users = [
            Prediction.to_dict(p, include_user=True, db=db) 
            for p in predictions
        ]
        
        return success_response(
            data={
                'predictions': predictions_with_users,
                'total': total,
                'page': page,
                'limit': limit,
                'pages': (total + limit - 1) // limit
            }
        )
        
    except Exception as e:
        return error_response(f"Failed to get predictions: {str(e)}", 500)
