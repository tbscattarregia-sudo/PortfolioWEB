from flask import Flask, render_template
import sqlite3
import os

app = Flask(__name__)

DB_PATH = "logs.db"  # misma base de datos que usa tu bot

def get_logs():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS logs (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, type TEXT)")
    cursor.execute("SELECT content, type FROM logs ORDER BY id DESC")
    logs = [{"content": row[0], "type": row[1]} for row in cursor.fetchall()]
    conn.close()
    return logs

@app.route("/")
def index():
    logs = get_logs()
    return render_template("index.html", logs=logs)

if __name__ == "__main__":
    app.run(debug=True)
