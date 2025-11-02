# backend_server.py
import socket
import threading
from flask import Flask, jsonify

app = Flask(__name__)

# --- Global variable to hold latest data from Raspberry Pi ---
latest_data = {
    "humidity": None,
    "temperature": None,
    "oxygen": None,
    "water_detected": None
}

# --- Function to start a TCP socket server ---
def socket_server():
    HOST = '0.0.0.0'  # Listen on all interfaces
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

                # Example data format: "100% 37.1C 85.4% False"
                parts = decoded.split()
                try:
                    humidity = float(parts[0].replace('%', ''))
                    temp = float(parts[1].replace('C', ''))
                    oxygen = float(parts[2].replace('%', ''))
                    water = parts[3] == 'True'

                    latest_data.update({
                        "humidity": humidity,
                        "temperature": temp,
                        "oxygen": oxygen,
                        "water_detected": water
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
