from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
from functools import wraps

app = Flask(__name__)
# damn CORS
CORS(app, 
     resources={r"/api/*": {"origins": "*"}},
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "OPTIONS"])

db_config = {
    'host': 'sql5.freesqldatabase.com',
    'user': '',
    'password': '',
    'database': '',
    'port': 3306,
}

app.config['JWT_SECRET_KEY'] = 'dev-secret-change-me'


def get_db_connection():
    try:
        conn = mysql.connector.connect(**db_config)
        return conn
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None


def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        try:
            token = token.split(' ')[1]
            data = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=["HS256"])
            current_user = data['user_id']
        except Exception:
            return jsonify({'message': 'Token is invalid'}), 401
        return f(current_user, *args, **kwargs)
    return decorator


@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection error'}), 500

    cursor = conn.cursor()
    hashed_password = generate_password_hash(data['password'])

    try:
        cursor.execute(
            "INSERT INTO users (username, password_hash, preferred_sleep_hours, daily_water_goal_ml) VALUES (%s, %s, %s, %s)",
            (data['username'], hashed_password, data.get('preferred_sleep_hours', 8), data.get('daily_water_goal_ml', 2000))
        )
        conn.commit()
        return jsonify({'message': 'User registered successfully'}), 201
    except Error as e:
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
        conn.close()


@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection error'}), 500

    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id, password_hash FROM users WHERE username = %s", (data['username'],))
        user = cursor.fetchone()

        if user and check_password_hash(user[1], data['password']):
            token = jwt.encode({
                'user_id': user[0],
                'exp': datetime.utcnow() + timedelta(days=1)
            }, app.config['JWT_SECRET_KEY'])
            return jsonify({'token': token})

        return jsonify({'message': 'Invalid credentials'}), 401
    finally:
        cursor.close()
        conn.close()


@app.route('/api/sleep', methods=['POST'])
@token_required
def log_sleep(current_user):
    data = request.get_json()
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection error'}), 500

    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO sleep_logs (user_id, sleep_hours, sleep_quality, date) VALUES (%s, %s, %s, %s)",
            (current_user, data['sleep_hours'], data['sleep_quality'], data['date'])
        )
        conn.commit()
        return jsonify({'message': 'Sleep log added successfully'}), 201
    except Error as e:
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
        conn.close()


@app.route('/api/water', methods=['POST'])
@token_required
def log_water(current_user):
    data = request.get_json()
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection error'}), 500

    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO water_logs (user_id, water_amount_ml, date) VALUES (%s, %s, %s)",
            (current_user, data['water_amount_ml'], data['date'])
        )
        conn.commit()
        return jsonify({'message': 'Water log added successfully'}), 201
    except Error as e:
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
        conn.close()


@app.route('/api/health-summary', methods=['GET'])
@token_required
def get_health_summary(current_user):
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection error'}), 500

    cursor = conn.cursor()
    try:
        cursor.execute("SELECT preferred_sleep_hours, daily_water_goal_ml FROM users WHERE id = %s", (current_user,))
        preferences = cursor.fetchone()

        cursor.execute(
            "SELECT sleep_hours, sleep_quality, date FROM sleep_logs WHERE user_id = %s ORDER BY date DESC LIMIT 1",
            (current_user,)
        )
        sleep_log = cursor.fetchone()

        cursor.execute(
            "SELECT SUM(water_amount_ml) FROM water_logs WHERE user_id = %s AND date = CURDATE()",
            (current_user,)
        )
        water_intake = cursor.fetchone()[0] or 0

        return jsonify({
            'preferences': {
                'preferred_sleep_hours': preferences[0] if preferences else 8,
                'daily_water_goal_ml': preferences[1] if preferences else 2000,
            },
            'latest_sleep': {
                'hours': sleep_log[0] if sleep_log else None,
                'quality': sleep_log[1] if sleep_log else None,
                'date': sleep_log[2].strftime('%Y-%m-%d') if sleep_log and hasattr(sleep_log[2], 'strftime') else (sleep_log[2] if sleep_log else None),
            },
            'today_water_intake': water_intake,
        })
    except Error as e:
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
        conn.close()


if __name__ == '__main__':
    # Run on all interfaces (0.0.0.0) to ensure it's accessible
    app.run(debug=True, host='0.0.0.0', port=5555)
