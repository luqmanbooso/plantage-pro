from pymongo import MongoClient, ASCENDING
from pymongo.errors import ConnectionFailure
import os

class Database:
    """MongoDB Database connection handler"""
    
    _instance = None
    _client = None
    _db = None
    
    def __new__(cls, uri=None, db_name='plantage_pro'):
        if cls._instance is None:
            cls._instance = super(Database, cls).__new__(cls)
            cls._instance._initialize(uri, db_name)
        return cls._instance
    
    def _initialize(self, uri, db_name):
        """Initialize MongoDB connection"""
        try:
            self._client = MongoClient(uri)
            self._db = self._client[db_name]
            
            # Test connection
            self._client.admin.command('ping')
            print(f"SUCCESS: Successfully connected to MongoDB: {db_name}")
            
            # Create indexes
            self._create_indexes()
            
        except ConnectionFailure as e:
            print(f"ERROR: Failed to connect to MongoDB: {e}")
            raise
    
    def _create_indexes(self):
        """Create database indexes for better performance"""
        try:
            # Users collection
            self._db.users.create_index([('email', ASCENDING)], unique=True)
            self._db.users.create_index([('is_active', ASCENDING)])
            
            # Predictions collection
            self._db.predictions.create_index([('user_id', ASCENDING)])
            self._db.predictions.create_index([('created_at', ASCENDING)])
            self._db.predictions.create_index([('plant_name', ASCENDING)])
            
            # Password reset tokens collection
            self._db.password_reset_tokens.create_index([('user_id', ASCENDING)])
            self._db.password_reset_tokens.create_index([('token', ASCENDING)], unique=True)
            self._db.password_reset_tokens.create_index([('expires_at', ASCENDING)], expireAfterSeconds=0)
            
            print("SUCCESS: Database indexes created successfully")
            
        except Exception as e:
            print(f"Warning: Could not create indexes: {e}")
    
    @property
    def db(self):
        """Get database instance"""
        return self._db
    
    @property
    def client(self):
        """Get MongoDB client"""
        return self._client
    
    def close(self):
        """Close database connection"""
        if self._client:
            self._client.close()
            print("SUCCESS: Database connection closed")

# Database instance getter
def get_db():
    """Get database instance"""
    from config import Config
    db_instance = Database(Config.MONGODB_URI, Config.MONGODB_DB_NAME)
    return db_instance.db
