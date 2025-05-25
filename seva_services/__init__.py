from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from datetime import datetime, timedelta 
import config

client = MongoClient(config.MONGO_URI)
seva_db = client['sevaDB']
seva_users = seva_db['seva_entries']
user_db = client["usersdb"]
users = user_db["users"]
seva_bp = Blueprint('seva_service', __name__)


@seva_bp.route('/seva', methods=['POST'])
def add_seva_entry():
    try:
        data = request.get_json()
        email = data.get('email')
        seva = data.get('seva')
        datetime_str = data.get('datetime', '').strip() 
        duration = data.get('duration')

        if not all([email, seva, datetime_str]):
            return jsonify({'error': 'All fields are required'}), 400
        if not isinstance(email, str) or '@' not in email:
            return jsonify({'error': 'Invalid email address'}), 400

        user = users.find_one({"email": email})
        if not user:
            return jsonify({'error': 'User not found'}), 404

        try:
            base_datetime = datetime.fromisoformat(datetime_str)
        except Exception:
            return jsonify({'error': 'Invalid datetime format. Use ISO format (YYYY-MM-DDTHH:MM:SS)'}), 400

        recurrence = data.get('recurrence', {})
        recurrence_from = recurrence.get('from')
        recurrence_to = recurrence.get('to')

        seva_entries = []

        if recurrence_from and recurrence_to:
            try:
                start_date = datetime.fromisoformat(recurrence_from)
                end_date = datetime.fromisoformat(recurrence_to)
            except Exception:
                return jsonify({'error': 'Invalid recurrence date format'}), 400

            current_date = start_date
            while current_date <= end_date:
                new_datetime = current_date.replace(
                    hour=base_datetime.hour,
                    minute=base_datetime.minute,
                    second=base_datetime.second
                )
                seva_entries.append({
                    'email': email,
                    'seva': seva,
                    'datetime': new_datetime.isoformat(),
                    'duration': duration,
                    'recurrence': {
                        'from': recurrence_from,
                        'to': recurrence_to
                    }
                })
                current_date += timedelta(days=1)
        else:
            seva_entries.append({
                'email': email,
                'seva': seva,
                'datetime': base_datetime.isoformat(),
                'duration': duration,
                
            })

        seva_users.insert_many(seva_entries) 
        print(f"Seva entries added: {seva_entries}")

        return jsonify({
            'message': 'Seva entry added successfully!',
            'user': {'email': email}
        })

    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({'error': 'An unexpected error occurred. Please try again later.'}), 500
