import sqlite3
import os
from datetime import datetime
from typing import List, Dict, Any, Union

DB_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(DB_DIR, "calculator.db")


def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_db_connection() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS calculation_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                expression TEXT NOT NULL,
                result REAL NOT NULL,
                timestamp TEXT NOT NULL
            );
        """)
        conn.commit()


def add_history(expression: str, result: Union[int, float]) -> Dict[str, Any]:
    timestamp = datetime.now().isoformat()
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO calculation_history (expression, result, timestamp) VALUES (?, ?, ?)",
            (expression, result, timestamp)
        )
        conn.commit()
        record_id = cursor.lastrowid
        return {
            "id": record_id,
            "expression": expression,
            "result": result,
            "timestamp": timestamp
        }


def get_history(limit: int = 100) -> List[Dict[str, Any]]:
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, expression, result, timestamp FROM calculation_history ORDER BY id DESC LIMIT ?",
            (limit,)
        )
        rows = cursor.fetchall()
        history = []
        for row in rows:
            res = row["result"]
            # Convert float to int if integer value
            if isinstance(res, float) and res.is_integer():
                res = int(res)
            history.append({
                "id": row["id"],
                "expression": row["expression"],
                "result": res,
                "timestamp": row["timestamp"]
            })
        return history


def clear_history() -> bool:
    with get_db_connection() as conn:
        conn.execute("DELETE FROM calculation_history")
        conn.commit()
        return True
