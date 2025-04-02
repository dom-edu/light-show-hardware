from picozero import LED
import time as t 

led = LED(15)

while True:
 led.blink()
 t.sleep(2)

