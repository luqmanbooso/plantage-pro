from flask import jsonify

def success_response(data=None, message=None, status=200):
    """Standard success response"""
    response = {'success': True}
    if message:
        response['message'] = message
    if data:
        response['data'] = data
    return jsonify(response), status

def error_response(message, status=400, errors=None):
    """Standard error response"""
    response = {
        'success': False,
        'error': message
    }
    if errors:
        response['errors'] = errors
    return jsonify(response), status

def validate_required_fields(data, required_fields):
    """Validate required fields in request data"""
    missing_fields = [field for field in required_fields if field not in data or not data[field]]
    
    if missing_fields:
        return False, f"Missing required fields: {', '.join(missing_fields)}"
    
    return True, None
