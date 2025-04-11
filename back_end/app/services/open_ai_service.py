import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_career_advice(user_message, conversation_history=None):
    """
    Get career advice from OpenAI's GPT model.
    
    Args:
        user_message (str): The user's question or message
        conversation_history (list, optional): Previous messages in the conversation
    
    Returns:
        str: The AI's response
    """
    if conversation_history is None:
        conversation_history = []
    
    # Create system message with career advisor context
    system_message = {
        "role": "system", 
        "content": "You are a career advisor specializing in helping students and professionals make education and career decisions. Provide helpful, accurate, and supportive advice based on the user's questions and situation."
    }
    
    # Prepare conversation messages
    messages = [system_message] + conversation_history + [{"role": "user", "content": user_message}]
    
    try:
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # Or whichever model you prefer
            messages=messages,
            max_tokens=500,
            temperature=0.7
        )
        
        # Extract and return response text
        return response.choices[0].message.content
        
    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        return "I'm sorry, I'm having trouble processing your request right now."