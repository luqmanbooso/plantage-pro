from bson import ObjectId
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
import re

class User:
    """User model"""
    
    @staticmethod
    def create(db, full_name, email, password, role='user'):
        """Create a new user"""
        
        # Validate email
        if not User.validate_email(email):
            raise ValueError("Invalid email format")
        
        # Validate password
        if not User.validate_password(password):
            raise ValueError("Password must be at least 8 characters and include at least one number")
        
        # Check if email already exists
        if db.users.find_one({'email': email}):
            raise ValueError("Email already registered")
        
        user_data = {
            'full_name': full_name,
            'email': email.lower(),
            'password_hash': generate_password_hash(password),
            'role': role,
            'profile_photo_url': None,
            'is_active': True,
            'failed_login_attempts': 0,
            'locked_until': None,
            'created_at': datetime.utcnow(),
            'scheduled_deletion_date': None
        }
        
        result = db.users.insert_one(user_data)
        user_data['_id'] = result.inserted_id
        return user_data
    
    @staticmethod
    def find_by_email(db, email):
        """Find user by email"""
        return db.users.find_one({'email': email.lower()})
    
    @staticmethod
    def find_by_id(db, user_id):
        """Find user by ID"""
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
        return db.users.find_one({'_id': user_id})
    
    @staticmethod
    def verify_password(db, email, password):
        """Verify user password"""
        user = User.find_by_email(db, email)
        
        if not user:
            return None, "Invalid email or password"
        
        # Check if account is locked
        if user.get('locked_until') and user['locked_until'] > datetime.utcnow():
            minutes_left = int((user['locked_until'] - datetime.utcnow()).total_seconds() / 60)
            return None, f"Account locked. Try again in {minutes_left} minutes"
        
        # Check if account is active
        if not user.get('is_active', True):
            return None, "Account is deactivated"
        
        # Verify password
        if check_password_hash(user['password_hash'], password):
            # Reset failed login attempts
            db.users.update_one(
                {'_id': user['_id']},
                {'$set': {'failed_login_attempts': 0, 'locked_until': None}}
            )
            return user, None
        else:
            # Increment failed login attempts
            failed_attempts = user.get('failed_login_attempts', 0) + 1
            update_data = {'failed_login_attempts': failed_attempts}
            
            # Lock account after max attempts
            from config import Config
            if failed_attempts >= Config.MAX_FAILED_LOGIN_ATTEMPTS:
                update_data['locked_until'] = datetime.utcnow() + timedelta(minutes=Config.ACCOUNT_LOCKOUT_MINUTES)
            
            db.users.update_one({'_id': user['_id']}, {'$set': update_data})
            
            if failed_attempts >= Config.MAX_FAILED_LOGIN_ATTEMPTS:
                return None, f"Account locked due to {Config.MAX_FAILED_LOGIN_ATTEMPTS} failed login attempts. Try again in {Config.ACCOUNT_LOCKOUT_MINUTES} minutes"
            
            return None, "Invalid email or password"
    
    @staticmethod
    def update_profile(db, user_id, full_name=None, profile_photo_url=None):
        """Update user profile"""
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
        
        update_data = {}
        if full_name is not None:
            update_data['full_name'] = full_name
        if profile_photo_url is not None:
            update_data['profile_photo_url'] = profile_photo_url
        
        if update_data:
            db.users.update_one({'_id': user_id}, {'$set': update_data})
            return True
        return False
    
    @staticmethod
    def change_password(db, user_id, current_password, new_password):
        """Change user password"""
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
        
        user = db.users.find_one({'_id': user_id})
        if not user:
            raise ValueError("User not found")
        
        # Verify current password
        if not check_password_hash(user['password_hash'], current_password):
            raise ValueError("Current password is incorrect")
        
        # Validate new password
        if not User.validate_password(new_password):
            raise ValueError("Password must be at least 8 characters and include at least one number")
        
        # Update password
        db.users.update_one(
            {'_id': user_id},
            {'$set': {'password_hash': generate_password_hash(new_password)}}
        )
        return True
    
    @staticmethod
    def schedule_deletion(db, user_id):
        """Schedule user account for deletion"""
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
        
        from config import Config
        deletion_date = datetime.utcnow() + timedelta(days=Config.ACCOUNT_DELETION_GRACE_DAYS)
        
        db.users.update_one(
            {'_id': user_id},
            {'$set': {
                'scheduled_deletion_date': deletion_date,
                'is_active': False
            }}
        )
        return deletion_date
    
    @staticmethod
    def validate_email(email):
        """Validate email format"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    @staticmethod
    def validate_password(password):
        """Validate password: at least 8 chars and 1 number"""
        return len(password) >= 8 and any(char.isdigit() for char in password)
    
    @staticmethod
    def to_dict(user):
        """Convert user document to dictionary (remove sensitive data)"""
        if not user:
            return None
        
        return {
            'id': str(user['_id']),
            'full_name': user['full_name'],
            'email': user['email'],
            'role': user['role'],
            'profile_photo_url': user.get('profile_photo_url'),
            'is_active': user.get('is_active', True),
            'created_at': user['created_at'].isoformat() if user.get('created_at') else None,
            'scheduled_deletion_date': user['scheduled_deletion_date'].isoformat() if user.get('scheduled_deletion_date') else None
        }
