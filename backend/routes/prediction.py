from flask import Blueprint, request, Response
from flask_jwt_extended import jwt_required as jwt_required_decorator
from datetime import datetime
import csv
import io
from database import get_db
from models import Prediction
from services import prediction_service, vision_service
from utils import success_response, error_response, get_current_user, validate_required_fields

prediction_bp = Blueprint('prediction', __name__, url_prefix='/api/predictions')

@prediction_bp.route('', methods=['POST'])
@jwt_required_decorator()
def create_prediction():
    """Create a new prediction"""
    try:
        user = get_current_user()
        
        if not user:
            return error_response("User not found", 404)
        
        data = request.get_json()
        
        # Validate required fields
        valid, error_msg = validate_required_fields(data, ['measurement_value'])
        if not valid:
            return error_response(error_msg, 400)
        
        # Make prediction
        try:
            predicted_age = prediction_service.predict(data['measurement_value'])
        except ValueError as e:
            return error_response(str(e), 400)
        except RuntimeError as e:
            return error_response(str(e), 500)
        
        # Save to database
        db = get_db()
        prediction = Prediction.create(
            db,
            user_id=user['_id'],
            measurement_value=data['measurement_value'],
            predicted_age=predicted_age,
            plant_name=data.get('plant_name')
        )
        
        return success_response(
            data={'prediction': Prediction.to_dict(prediction)},
            message="Prediction created successfully",
            status=201
        )
        
    except Exception as e:
        return error_response(f"Prediction failed: {str(e)}", 500)


@prediction_bp.route('', methods=['GET'])
@jwt_required_decorator()
def get_predictions():
    """Get user's predictions with filters"""
    try:
        user = get_current_user()
        
        if not user:
            return error_response("User not found", 404)
        
        # Get query parameters
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 100))
        search = request.args.get('search')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        # Parse dates
        start_datetime = None
        end_datetime = None
        
        if start_date:
            try:
                start_datetime = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
            except:
                return error_response("Invalid start_date format", 400)
        
        if end_date:
            try:
                end_datetime = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
            except:
                return error_response("Invalid end_date format", 400)
        
        # Calculate skip
        skip = (page - 1) * limit
        
        # Get predictions
        db = get_db()
        predictions, total = Prediction.find_by_user(
            db,
            user['_id'],
            skip=skip,
            limit=limit,
            search=search,
            start_date=start_datetime,
            end_date=end_datetime
        )
        
        return success_response(
            data={
                'predictions': [Prediction.to_dict(p) for p in predictions],
                'total': total,
                'page': page,
                'limit': limit,
                'pages': (total + limit - 1) // limit
            }
        )
        
    except Exception as e:
        return error_response(f"Failed to get predictions: {str(e)}", 500)


@prediction_bp.route('/export', methods=['GET'])
@jwt_required_decorator()
def export_predictions():
    """Export user's predictions as CSV"""
    try:
        user = get_current_user()
        
        if not user:
            return error_response("User not found", 404)
        
        db = get_db()
        
        # Get all predictions (no limit)
        predictions, _ = Prediction.find_by_user(db, user['_id'], limit=10000)
        
        # Create CSV
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow(['Plant Name', 'Measurement Value', 'Predicted Age (years)', 'Date & Time'])
        
        # Write data
        for pred in predictions:
            writer.writerow([
                pred.get('plant_name', 'N/A'),
                pred['measurement_value'],
                pred['predicted_age'],
                pred['created_at'].strftime('%Y-%m-%d %H:%M:%S')
            ])
        
        # Create response
        output.seek(0)
        return Response(
            output.getvalue(),
            mimetype='text/csv',
            headers={'Content-Disposition': 'attachment; filename=predictions.csv'}
        )
        
    except Exception as e:
        return error_response(f"Export failed: {str(e)}", 500)


@prediction_bp.route('/<prediction_id>', methods=['DELETE'])
@jwt_required_decorator()
def delete_prediction(prediction_id):
    """Delete a prediction"""
    try:
        user = get_current_user()
        
        if not user:
            return error_response("User not found", 404)
        
        db = get_db()
        
        # Delete prediction
        deleted = Prediction.delete(db, prediction_id, user['_id'])
        
        if not deleted:
            return error_response("Prediction not found or unauthorized", 404)
        
        return success_response(message="Prediction deleted successfully")
        
    except Exception as e:
        return error_response(f"Failed to delete prediction: {str(e)}", 500)


@prediction_bp.route('/clear', methods=['DELETE'])
@jwt_required_decorator()
def clear_predictions():
    """Delete all predictions for user"""
    try:
        user = get_current_user()
        
        if not user:
            return error_response("User not found", 404)
        
        db = get_db()
        
        # Delete all predictions
        count = Prediction.delete_all_by_user(db, user['_id'])
        
        return success_response(
            data={'deleted_count': count},
            message=f"Successfully deleted {count} predictions"
        )
        
    except Exception as e:
        return error_response(f"Failed to clear predictions: {str(e)}", 500)
@prediction_bp.route('/upload', methods=['POST'])
@jwt_required_decorator()
def upload_prediction():
    """Create a new prediction via image upload"""
    try:
        user = get_current_user()
        
        if not user:
            return error_response("User not found", 404)
        
        if 'file' not in request.files:
            return error_response("No image file provided", 400)
        
        file = request.files['file']
        if file.filename == '':
            return error_response("Empty filename", 400)
            
        # Optional plant name from user
        user_provided_name = request.form.get('plant_name')
        
        # Step 1: Identify Plant (PlantNet)
        identified_name, confidence = vision_service.identify_plant(file)
        
        # Determine final plant name to use
        # If user didn't provide one, use the identified one
        plant_name = user_provided_name or identified_name
        
        # Step 2: Process image to get measurement (Height proxy)
        try:
            measurement_value = vision_service.extract_measurement(file)
        except ValueError as e:
            return error_response(str(e), 400)
            
        # Step 3: Make prediction with our ML model
        try:
            predicted_age = prediction_service.predict(measurement_value)
        except Exception as e:
            return error_response(f"Prediction failed: {str(e)}", 500)
            
        # Save to database
        db = get_db()
        prediction = Prediction.create(
            db,
            user_id=user['_id'],
            measurement_value=measurement_value,
            predicted_age=predicted_age,
            plant_name=plant_name,
            confidence=confidence
        )
        
        return success_response(
            data={
                'prediction': Prediction.to_dict(prediction),
                'extracted_measurement': measurement_value,
                'identification': {
                    'species': identified_name,
                    'confidence': round(confidence * 100, 2)
                }
            },
            message="Image analyzed and prediction created successfully",
            status=201
        )
        
    except Exception as e:
        return error_response(f"Image processing failed: {str(e)}", 500)
