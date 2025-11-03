import socket
import random
import board
import adafruit_si7021
import serial
import time

HOST = '192.168.1.174'
PORT = 8000

ser = serial.Serial("/dev/ttyS0", 9600, timeout=1)
thsensor = adafruit_si7021.SI7021(board.I2C())

# data

humidity = thsensor.relative_humidity
temp = thsensor.temperature
oxygen = random.randint(0,100)
lwd = ser.read(13).decode("utf-8").split(" ")

# results

humidity = float(f"{humidity:.2f}")
temp = float(f"{temp:.2f}")
light = lwd[0]
waterc = lwd[1]
water = True # Dummy value

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect((HOST, PORT))
    data = str(humidity) + "% " + str(temp) + "C " + str(oxygen) + "% " + str(wa                                                                                                                                                             ter) + " " + str(light) + " " + str(waterc)
    print(data)
    print(humidity, temp, oxygen, water, light, waterc)
    encoded_bytes = data.encode('utf-8')
    s.sendall(encoded_bytes)
