from flask import Flask, render_template, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": os.getenv("CORS_ORIGIN", "*")}})

DB_PATH = os.getenv("DB_PATH", "logs.db")  # configurable para despliegue

def get_logs():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS logs (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, type TEXT)")
    cursor.execute("SELECT id, content, type FROM logs ORDER BY id DESC LIMIT 50")
    logs = [{"id": row[0], "content": row[1], "type": row[2]} for row in cursor.fetchall()]
    conn.close()
    return logs

@app.route("/")
def index():
    logs = get_logs()
    return render_template("index.html", logs=logs)

@app.route("/api/logs")
def api_logs():
    return jsonify(get_logs())

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
