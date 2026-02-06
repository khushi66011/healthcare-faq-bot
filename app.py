from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)   # allow frontend requests

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "").lower()

    reply = "Please consult a doctor for proper diagnosis."

    if "hello" in user_message:
        reply = "Hello! I am Healthbot. How can I help you?"
    elif "fever" in user_message:
        reply = "Do you have temperature above 98.6°F?"
    elif "cold" in user_message:
        reply = "You may have a common cold. Drink warm fluids and take rest."
    elif "pain" in user_message:
        reply = "If abdominal pain is severe, please consult a doctor."
    elif "yes" in user_message:
        reply = "Please take proper medication and rest."
    elif "no" in user_message:
        reply = "Monitor your symptoms and stay hydrated."

    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(debug=True) 