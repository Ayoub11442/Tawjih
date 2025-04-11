
from flask import Blueprint, request, jsonify
from .services.open_ai_service import get_career_advice  # Or your DeepSeek service if you switched

main_bp = Blueprint('main', __name__)

@main_bp.route('/api/chat', methods=['POST'])
def chat():
    """
    API endpoint to handle chat requests from the frontend
    """
    data = request.get_json()
    
    # Check if the request contains a message
    if not data or 'message' not in data:
        return jsonify({
            'success': False,
            'error': 'No message provided'
        }), 400
    
    # Get the user's message
    user_message = data['message']
    
    try:
        # Get AI response from your service
        ai_response = get_career_advice(user_message)
        
        # Return success response
        return jsonify({
            'success': True,
            'response': ai_response
        })
    except Exception as e:
        # Log the error
        print(f"Error processing chat request: {str(e)}")
        
        # Return error response
        return jsonify({
            'success': False,
            'error': 'Failed to get AI response',
            'details': str(e)
        }), 500