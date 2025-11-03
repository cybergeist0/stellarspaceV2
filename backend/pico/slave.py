from machine import Pin, UART, ADC
import time

uart0 = UART(0, baudrate=9600, tx=Pin(0), rx=Pin(1))
ldr = machine.ADC(1)
POWER_PIN = 15
SIGNAL_PIN = 26

power = Pin(POWER_PIN, Pin.OUT)
power.value(1)
signal = ADC(Pin(SIGNAL_PIN))

while True:
    water = str(signal.read_u16() / 655.36)[:6]
    print("Sensor value:", water)
    val = str(ldr.read_u16() / 655.36)[:6]
    print(val)
    uart0.write(val + " " + water)
    time.sleep(0.2)
