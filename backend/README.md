# PlantAge Pro - Backend API

Flask-based REST API for plant age prediction using machine learning.

## Features

- User authentication (JWT-based)
- Plant age prediction using ML model
- Prediction history management
- Admin dashboard and user management
- Password reset functionality
- Export predictions to CSV

## Setup

### Prerequisites

- Python 3.8+
- MongoDB Atlas account

### Installation

1. Create virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment:
```bash
copy .env.example .env
# Edit .env with your MongoDB credentials and configuration
```

4. Run the application:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/refresh` - Refresh access token

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/password` - Change password
- `DELETE /api/user/account` - Schedule account deletion

### Predictions
- `POST /api/predictions` - Create new prediction
- `GET /api/predictions` - Get user's predictions (with filters)
- `GET /api/predictions/export` - Export predictions as CSV
- `DELETE /api/predictions/:id` - Delete a prediction
- `DELETE /api/predictions/clear` - Delete all predictions

### Admin
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user status
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/predictions` - Get all predictions

## Project Structure

```
backend/
├── app.py                 # Main Flask application
├── config.py              # Configuration
├── database.py            # MongoDB connection
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables
├── models/                # Data models
│   ├── user.py
│   ├── prediction.py
│   └── password_reset.py
├── routes/                # API routes
│   ├── auth.py
│   ├── user.py
│   ├── prediction.py
│   └── admin.py
├── services/              # Business logic
│   └── prediction_service.py
└── utils/                 # Utilities
    ├── auth_decorators.py
    ├── email_utils.py
    └── response_utils.py
```

## Environment Variables

See `.env.example` for all available configuration options.

## License

MIT
