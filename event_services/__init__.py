from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId
from event_services.models import parse_excel_file
import config

client = MongoClient(config.MONGO_URI)
db = client['eventsDB']
events_collection = db['events']
events_bp = Blueprint('events', __name__)

@events_bp.route('/get_events', methods=['GET'])
def get_events():
    try:
        events = list(events_collection.find())
        for e in events:
            e['_id'] = str(e['_id'])
        return jsonify(events), 200
    except Exception as e:
        print(f"Error fetching events: {e}")
        return jsonify({'error': 'Failed to fetch events'}), 500

@events_bp.route('/post_events', methods=['POST'])
def add_event():
    try:
        data = request.json
        if not data.get('date') or not data.get('title') or not data.get('time'):
            return jsonify({'error': 'Missing fields'}), 400
        
        existing_event = events_collection.find_one({
            'date': data['date'],
            'title': data['title'],
            'time': data['time']
        })
        if existing_event: 
            return jsonify({'error': 'Event already exists'}), 400
        
        result = events_collection.insert_one(data)
        return jsonify({'message': 'Event added', 'id': str(result.inserted_id)}), 201
    except Exception as e:
        print(f"Error adding event: {e}")
        return jsonify({'error': 'Failed to add event'}), 500

@events_bp.route('/delete_events/<event_id>', methods=['DELETE'])
def delete_event(event_id):
    try:
        try:
            object_id = ObjectId(event_id)
        except Exception as e:
            print(f"Invalid ObjectId: {e}")
            return jsonify({'error': 'Invalid event ID'}), 400
        result = events_collection.delete_one({'_id': object_id})
        if result.deleted_count == 0:
            return jsonify({'error': 'Event not found'}), 404
        return jsonify({'message': 'Event deleted'}), 200
    except Exception as e:
        print(f"Error deleting event: {e}")
        return jsonify({'error': 'Invalid event ID'}), 400

@events_bp.route('/bulk_events', methods=['POST'])
def bulk_upload():
    try:
        if not request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        
        file  = next(iter(request.files.values()))
        filename = file.filename
        
        if not filename.endswith('.xlsx'):
            return jsonify({'error': 'Invalid file format. Only .xlsx files are allowed.'}), 400
        
        events = parse_excel_file(file)
        # print(f"Parsed events: {events}")
        if not events:
            return jsonify({'error': 'No valid events found in the file'}), 400
        else:
            results = events_collection.insert_many(events)
            for event, inserted_id in zip(events, results.inserted_ids):
                event['_id'] = str(inserted_id)
            # print(f"Inserted events: {events}")
            return jsonify({'message': 'Bulk upload successfully', 'events': events}), 200
    except Exception as e:
        print(f"Error in bulk upload: {e}")
        return jsonify({'error': 'Failed to process the file'}), 500