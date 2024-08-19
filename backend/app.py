from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

app = Flask(__name__)
#CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///productscraper.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

frontend_folder = os.path.join(os.getcwd(), "..", "frontend", "dist")

#server static files from the "dist" folder under the "frontend" directory
@app.route("/", defaults={"filename": ""})
@app.route('/<path:filename>')
def index(filename):
    if not filename:
        filename = "index.html"

    return send_from_directory(frontend_folder, filename)

#api routes
import routes

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
