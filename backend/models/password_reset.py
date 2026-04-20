from bson import ObjectId
from datetime import datetime, timedelta
import secrets

class PasswordResetToken:
    """Password reset token model"""
    
    @staticmethod
    def create(db, user_id):
        """Create a password reset token"""
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
        
        # Delete any existing tokens for this user
        db.password_reset_tokens.delete_many({'user_id': user_id})
        
        # Generate secure token
        token = secrets.token_urlsafe(32)
        
        from config import Config
        expires_at = datetime.utcnow() + timedelta(hours=Config.PASSWORD_RESET_TOKEN_EXPIRY_HOURS)
        
        token_data = {
            'user_id': user_id,
            'token': token,
            'expires_at': expires_at,
            'created_at': datetime.utcnow()
        }
        
        db.password_reset_tokens.insert_one(token_data)
        return token
    
    @staticmethod
    def verify(db, token):
        """Verify a password reset token"""
        token_doc = db.password_reset_tokens.find_one({'token': token})
        
        if not token_doc:
            return None, "Invalid or expired token"
        
        if token_doc['expires_at'] < datetime.utcnow():
            db.password_reset_tokens.delete_one({'_id': token_doc['_id']})
            return None, "Token has expired"
        
        return token_doc, None
    
    @staticmethod
    def delete(db, token):
        """Delete a password reset token"""
        db.password_reset_tokens.delete_one({'token': token})
