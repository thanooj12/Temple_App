from flask import Blueprint, request, jsonify
from pymongo import MongoClient
import config

client = MongoClient(config.MONGO_URI)
db = client["usersdb"]
donations = db["donations"]
donation_bp = Blueprint('donation', __name__)

@donation_bp.route('/donations', methods=['POST'])
def add_donation():
    try:
        data = request.get_json()
        amount = data.get("amount")
        name = data.get("name")
        email = data.get("email")
        phone = data.get("phone")

        if not all([amount, name, email, phone]):
            return jsonify({"error": "All fields are required"}), 400
        if not isinstance(amount, (int, float)) or amount <= 0:
            return jsonify({"error": "Amount must be a positive number"}), 400
        if not isinstance(name, str) or len(name) < 3:
            return jsonify({"error": "Invalid name"}), 400
        phone = str(phone)
        if not phone.isdigit() or len(phone) != 10:
            return jsonify({"error": "Phone must be 10 digits"}), 400

        donations.insert_one({
            "amount": amount,
            "name": name,
            "email": email,
            "phone": phone,
        })

        return jsonify({
            "message": "Donation added successfully!",
            "user": {"name": name}
        }), 201

    except Exception as e:
        print(f"Error occurred: {e}") 
        return jsonify({"error": "An unexpected error occurred. Please try again later."}), 500
