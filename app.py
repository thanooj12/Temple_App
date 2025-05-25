from flask import Flask
from flask_cors import CORS
from auth_services import auth_bp
from donation_services import donation_bp
from seva_services import seva_bp
from event_services import events_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(donation_bp, url_prefix='/donation')
app.register_blueprint(seva_bp, url_prefix='/seva_service')
app.register_blueprint(events_bp, url_prefix='/events')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, use_reloader=False)
