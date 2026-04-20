from bson import ObjectId
from datetime import datetime

class Prediction:
    """Prediction model"""
    
    @staticmethod
    def create(db, user_id, measurement_value, predicted_age, plant_name=None):
        """Create a new prediction"""
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
        
        prediction_data = {
            'user_id': user_id,
            'plant_name': plant_name,
            'measurement_value': float(measurement_value),
            'predicted_age': float(predicted_age),
            'created_at': datetime.utcnow()
        }
        
        result = db.predictions.insert_one(prediction_data)
        prediction_data['_id'] = result.inserted_id
        return prediction_data
    
    @staticmethod
    def find_by_user(db, user_id, skip=0, limit=100, search=None, start_date=None, end_date=None):
        """Find predictions by user with filters"""
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
        
        query = {'user_id': user_id}
        
        # Add search filter
        if search:
            query['plant_name'] = {'$regex': search, '$options': 'i'}
        
        # Add date range filter
        if start_date or end_date:
            date_query = {}
            if start_date:
                date_query['$gte'] = start_date
            if end_date:
                date_query['$lte'] = end_date
            query['created_at'] = date_query
        
        predictions = list(db.predictions.find(query)
                          .sort('created_at', -1)
                          .skip(skip)
                          .limit(limit))
        
        total = db.predictions.count_documents(query)
        
        return predictions, total
    
    @staticmethod
    def find_by_id(db, prediction_id):
        """Find prediction by ID"""
        if isinstance(prediction_id, str):
            prediction_id = ObjectId(prediction_id)
        return db.predictions.find_one({'_id': prediction_id})
    
    @staticmethod
    def delete(db, prediction_id, user_id):
        """Delete a prediction (only if it belongs to the user)"""
        if isinstance(prediction_id, str):
            prediction_id = ObjectId(prediction_id)
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
        
        result = db.predictions.delete_one({'_id': prediction_id, 'user_id': user_id})
        return result.deleted_count > 0
    
    @staticmethod
    def delete_all_by_user(db, user_id):
        """Delete all predictions for a user"""
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
        
        result = db.predictions.delete_many({'user_id': user_id})
        return result.deleted_count
    
    @staticmethod
    def get_all(db, skip=0, limit=100):
        """Get all predictions (admin only)"""
        predictions = list(db.predictions.find()
                          .sort('created_at', -1)
                          .skip(skip)
                          .limit(limit))
        
        total = db.predictions.count_documents({})
        
        return predictions, total
    
    @staticmethod
    def get_stats(db):
        """Get prediction statistics (admin only)"""
        total_predictions = db.predictions.count_documents({})
        
        # Predictions today
        today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        predictions_today = db.predictions.count_documents({
            'created_at': {'$gte': today_start}
        })
        
        # Most active users
        pipeline = [
            {'$group': {
                '_id': '$user_id',
                'count': {'$sum': 1}
            }},
            {'$sort': {'count': -1}},
            {'$limit': 5}
        ]
        
        most_active = list(db.predictions.aggregate(pipeline))
        
        return {
            'total_predictions': total_predictions,
            'predictions_today': predictions_today,
            'most_active_users': most_active
        }
    
    @staticmethod
    def to_dict(prediction, include_user=False, db=None):
        """Convert prediction document to dictionary"""
        if not prediction:
            return None
        
        result = {
            'id': str(prediction['_id']),
            'plant_name': prediction.get('plant_name'),
            'measurement_value': prediction['measurement_value'],
            'predicted_age': prediction['predicted_age'],
            'created_at': prediction['created_at'].isoformat() if prediction.get('created_at') else None
        }
        
        if include_user and db:
            from models.user import User
            user = User.find_by_id(db, prediction['user_id'])
            if user:
                result['user'] = {
                    'id': str(user['_id']),
                    'full_name': user['full_name'],
                    'email': user['email']
                }
        
        return result
