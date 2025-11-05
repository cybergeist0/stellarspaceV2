import socket
import threading
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])  # and again

latest_data = {
    "humidity": None,
    "temperature": None,
    "oxygen": None,
    "water_detected": None
}

def socket_server():
    HOST = '0.0.0.0'
    PORT = 8000

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind((HOST, PORT))
        s.listen()
        print(f"[SOCKET] Listening for Raspberry Pi on {HOST}:{PORT}")

        while True:
            conn, addr = s.accept()
            with conn:
                print(f"[SOCKET] Connected by {addr}")
                data = conn.recv(1024)
                if not data:
                    continue

                decoded = data.decode('utf-8')
                print(f"[SOCKET] Received data: {decoded}")

                # could be messed due to emi but who knows
                parts = decoded.split()
                try:
                    humidity = float(parts[0].replace('%', ''))
                    temp = float(parts[1].replace('C', ''))
                    oxygen = float(parts[2].replace('%', ''))
                    water = parts[3] == 'True'
                    light = parts[4]
                    waterc = parts[5]

                    if (float(waterc) > 15.0):
                        water = "True"
                    else:
                        water = "False"

                    latest_data.update({
                        "humidity": humidity,
                        "temperature": temp,
                        "oxygen": oxygen,
                        "water_detected": water,
                        "light": light,
                        "water_conductivity": waterc
                    })
                    print(f"[SOCKET] Updated data: {latest_data}")
                except Exception as e:
                    print(f"[ERROR] Parsing failed: {e}")

@app.route("/get-environment", methods=["GET"])
def get_environment():
    return jsonify(latest_data)

if __name__ == "__main__":
    socket_thread = threading.Thread(target=socket_server, daemon=True)
    socket_thread.start()
    app.run(host="0.0.0.0", port=5001)
