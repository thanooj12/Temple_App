from flask import Blueprint, request, jsonify
from pymongo import MongoClient
import config

client = MongoClient(config.MONGO_URI)
db = client['usersdb']
users = db['users']

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirmPassword')

    if not username or not email or not password or not confirm_password:
        return jsonify({"error": "All fields are required"}), 400
    if password != confirm_password:
        return jsonify({"error": "Passwords do not match"}), 400
    if users.find_one({"email": email}):
        return jsonify({"error": "Email already exists"}), 400
    
    users.insert_one({
        "username":username,
        "email":email,
        "password":password
    })
    
    return jsonify({"message": "User created successfully", "user": {"username": username, "email": email}}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        identifier = data.get('identifier')
        password = data.get('password')

        if not identifier or not password:
            return jsonify({"error": "Email and password are required"}), 400

        user = users.find_one({"$or": [{"email": identifier}, {"username": identifier}]})

        if not user:
            return jsonify({"error": "User not found"}), 404

        if user['password'] != password:
            return jsonify({"error": "Invalid password"}), 401  
                
        return jsonify({
            "message": "Login successful",
            "user": {
                "username": user['username'],
                "email": user['email']
            }
        }), 200

    except Exception as e:
        print("Login Exception:", str(e))
        return jsonify({"error": "An unexpected error occurred"}), 500
