from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os, sys
from dotenv import load_dotenv
from flask_migrate import Migrate
load_dotenv()
app = Flask(__name__)
CORS(app)
# Añadir el directorio raíz al PYTHONPATH
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

TURSO_DATABASE_URL = os.environ.get("TURSO_DATABASE_URL")
TURSO_AUTH_TOKEN = os.environ.get("TURSO_AUTH_TOKEN")

dbUrl = f"sqlite+{TURSO_DATABASE_URL}/?authToken={TURSO_AUTH_TOKEN}&secure=true"

app.config["SQLALCHEMY_DATABASE_URI"] = dbUrl
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'connect_args': {
        'check_same_thread': False
    }
}

db = SQLAlchemy(app)
migrate = Migrate(app, db)

""" frontend_folder = os.path.join(os.getcwd(), "..", "frontend", "dist")

#server static files from the "dist" folder under the "frontend" directory
@app.route("/", defaults={"filename": ""})
@app.route('/<path:filename>')
def index(filename):
    if not filename:
        filename = "index.html"

    return send_from_directory(frontend_folder, filename) """

#api routes
from backend import routes

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
