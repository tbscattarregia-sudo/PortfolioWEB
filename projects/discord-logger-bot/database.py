import sqlite3
import os

DB_PATH = os.getenv("DB_PATH", "logs.db")
conn = sqlite3.connect(DB_PATH, check_same_thread=False)
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT,
    content TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)
""")
conn.commit()

def add_log(log_type, content):
    cursor.execute(
        "INSERT INTO logs (type, content) VALUES (?, ?)",
        (log_type, content)
    )
    conn.commit()

def get_logs():
    cursor.execute("SELECT * FROM logs ORDER BY id DESC")
    return cursor.fetchall()
