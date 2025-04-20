# import os
# from flask import Flask, request, jsonify
# from google.generative_ai import GenerativeModel, configure

# app = Flask(__name__)

# # Configure Gemini with environment variable
# configure(api_key=os.environ.get("GOOGLE_API_KEY"))

# # Initialize Gemini model
# model = GenerativeModel("gemini-1.5-flash")
# chat = model.start_chat(history=[])

# # Gemini response generation
# def generate_response(user_input):
#     system_prompt = (
#         "You are a programming error-solving expert. Your goal is to provide accurate, beginner-friendly, and concise answers to programming errors based on verified knowledge. "
#         "Follow these strict guidelines to avoid hallucination:\n"
#         "1. Rely solely on verified programming knowledge. Do not invent solutions or details.\n"
#         "2. If you lack sufficient information to answer accurately, say: 'I don’t have enough information to answer accurately. Please provide more details or a code snippet.'\n"
#         "3. For each response, include:\n"
#         "   - A brief explanation of the error.\n"
#         "   - A corrected code example (if applicable).\n"
#         "   - A question asking if the user needs further clarification.\n"
#         "4. For follow-up questions, reference the original error and prior responses in the conversation history to maintain context.\n"
#         "5. Avoid jargon and ensure explanations are clear for beginners.\n"
#         "6. Support all major programming languages (e.g., Python, JavaScript, Java, C++).\n"
#         "7. If the query involves deprecated methods, note this and suggest modern alternatives only if certain.\n"
#         "Example:\n"
#         "Q: TypeError: unsupported operand type(s) for +: 'int' and 'str'\n"
#         "A: This error occurs in Python when you try to add a number and a string. Convert the string to a number with int(). Example:\n"
#         "```python\nx = 5\ny = '3'\nresult = x + int(y)\nprint(result)\n```\nNeed further clarification?"
#     )
#     prompt = f"{system_prompt}\n\nUser Query: {user_input}"
    
#     try:
#         response = chat.send_message(prompt, stream=True)
#         full_response = ""
#         for chunk in response:
#             if chunk.text:
#                 full_response += chunk.text
#         return full_response
#     except Exception as e:
#         return f"Gemini error: {str(e)}"

# @app.route('/api/ai/ask', methods=['POST'])
# def gemini_api_call():
#     try:
#         data = request.get_json()
#         prompt = data.get('prompt')
#         if not prompt:
#             return jsonify({"error": "Prompt is required"}), 400
        
#         # Generate response with Gemini
#         reply = generate_response(prompt)
        
#         return jsonify({"reply": reply})
#     except Exception as e:
#         print(f"Error: {str(e)}")
#         return jsonify({"error": "AI service failed", "details": str(e)}), 500

# # Vercel serverless entry point
# def handler(event, context):
#     from serverless_wsgi import handle_request
#     return handle_request(app, event, context)

# if __name__ == '__main__':
#     app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))

# """
# Install the Google AI Python SDK

# $ pip install google-generativeai

# See the getting started guide for more information:
# https://ai.google.dev/gemini-api/docs/get-started/python
# """

# import os
# import google.generativeai as genai
# # from main import text_to_speech

# from dotenv import load_dotenv
# load_dotenv()


# genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# # Create the model
# # See https://ai.google.dev/api/python/google/generativeai/GenerativeModel
# generation_config = {
#   "temperature": 0,
#   "top_p": 0.95,
#   "top_k": 64,
#   "max_output_tokens": 8192,
#   "response_mime_type": "text/plain",
# }
# safety_settings = [
#   {
#     "category": "HARM_CATEGORY_HARASSMENT",
#     "threshold": "BLOCK_NONE",
#   },
#   {
#     "category": "HARM_CATEGORY_HATE_SPEECH",
#     "threshold": "BLOCK_MEDIUM_AND_ABOVE",
#   },
#   {
#     "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
#     "threshold": "BLOCK_MEDIUM_AND_ABOVE",
#   },
#   {
#     "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
#     "threshold": "BLOCK_MEDIUM_AND_ABOVE",
#   },
# ]

# model = genai.GenerativeModel(
#   model_name="gemini-1.5-pro",
#   safety_settings=safety_settings,
#   generation_config=generation_config,
#   system_instruction= "You are a programming error-solving expert. Your goal is to provide accurate, beginner-friendly, and concise answers to programming errors based on verified knowledge. "
#         "Follow these strict guidelines to avoid hallucination:\n"
#         "1. Rely solely on verified programming knowledge. Do not invent solutions or details.\n"
#         "2. If you lack sufficient information to answer accurately, say: 'I don’t have enough information to answer accurately. Please provide more details or a code snippet.'\n"
#         "3. For each response, include:\n"
#         "   - A brief explanation of the error.\n"
#         "   - A corrected code example (if applicable).\n"
#         "   - A question asking if the user needs further clarification.\n"
#         "4. For follow-up questions, reference the original error and prior responses in the conversation history to maintain context.\n"
#         "5. Avoid jargon and ensure explanations are clear for beginners.\n"
#         "6. Support all major programming languages (e.g., Python, JavaScript, Java, C++).\n"
#         "7. If the query involves deprecated methods, note this and suggest modern alternatives only if certain.\n"
#         "Example:\n"
#         "Q: TypeError: unsupported operand type(s) for +: 'int' and 'str'\n"
#         "A: This error occurs in Python when you try to add a number and a string. Convert the string to a number with int(). Example:\n"
#         "```python\nx = 5\ny = '3'\nresult = x + int(y)\nprint(result)\n```\nNeed further clarification?"
#     )



# chat_session = model.start_chat(
#     history=[]
# )

# print("Bot: Hello, how can I help you?")
# print()
# # text_to_speech("Hello, how can I help you?")

# while True:

#     user_input = input("You: ")
#     print()

#     response = chat_session.send_message(user_input)

#     model_response = response.text

#     print(f'Bot: {model_response}')
#     print()
#     # text_to_speech(model_response)

#     chat_session.history.append({"role": "user", "parts": [user_input]})
#     chat_session.history.append({"role": "model", "parts": [model_response]})

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

generation_config = {
    "temperature": 0,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}
safety_settings = [
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
]

model = genai.GenerativeModel(
    model_name="gemini-1.5-pro",
    safety_settings=safety_settings,
    generation_config=generation_config,
    system_instruction=(
        "You are a programming error-solving expert. Your goal is to provide accurate, beginner-friendly, and concise answers to programming errors based on verified knowledge. "
        "Follow these strict guidelines to avoid hallucination:\n"
        "1. Rely solely on verified programming knowledge. Do not invent solutions or details.\n"
        "2. If you lack sufficient information to answer accurately, say: 'I don’t have enough information to answer accurately. Please provide more details or a code snippet.'\n"
        "3. For each response, include:\n"
        "   - A brief explanation of the error.\n"
        "   - A corrected code example (if applicable).\n"
        "   - A question asking if the user needs further clarification.\n"
        "4. For follow-up questions, reference the original error and prior responses in the conversation history to maintain context.\n"
        "5. Avoid jargon and ensure explanations are clear for beginners.\n"
        "6. Support all major programming languages (e.g., Python, JavaScript, Java, C++).\n"
        "7. If the query involves deprecated methods, note this and suggest modern alternatives only if certain."
    )
)

# Start one chat session (you could expand this to handle multi-user sessions)
chat_session = model.start_chat(history=[])

# FastAPI setup
app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with frontend URL for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class PromptRequest(BaseModel):
    prompt: str

@app.post("/api/ai/ask")
async def ask_ai(request: PromptRequest):
    try:
        user_input = request.prompt
        response = chat_session.send_message(user_input)
        model_response = response.text

        # Keep chat history for context
        chat_session.history.append({"role": "user", "parts": [user_input]})
        chat_session.history.append({"role": "model", "parts": [model_response]})

        return {"reply": model_response}
    except Exception as e:
        return {"error": str(e)}
