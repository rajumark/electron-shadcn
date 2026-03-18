# LED Control - ADB Commands

## Description
Commands for controlling Android device LEDs, notification light management, and LED indicator testing.

### Basic Commands

Check LED availability:
```sh
adb shell pm list features | grep led
```

Check notification LED status:
```sh
adb shell dumpsys notification | grep -E "led|LED"
```

Test notification LED:
```sh
adb shell service call notification 4 i32 1 i32 255 i32 0 i32 0  # Red
```

Turn off LED:
```sh
adb shell service call notification 4 i32 0
```

Check LED permissions:
```sh
adb shell dumpsys package com.example.app | grep -E "notification|NOTIFICATIONS"
```

### Advanced Commands

LED color control:
```sh
# Red LED
adb shell service call notification 4 i32 1 i32 255 i32 0 i32 0

# Green LED
adb shell service call notification 4 i32 1 i32 0 i32 255 i32 0

# Blue LED
adb shell service call notification 4 i32 1 i32 0 i32 0 i32 255

# White LED
adb shell service call notification 4 i32 1 i32 255 i32 255 i32 255
```

LED brightness control:
```sh
# Full brightness
adb shell service call notification 4 i32 1 i32 255 i32 255 i32 255

# Half brightness
adb shell service call notification 4 i32 1 i32 128 i32 128 i32 128

# Low brightness
adb shell service call notification 4 i32 1 i32 64 i32 64 i32 64
```

LED pattern control:
```sh
# Blink pattern
adb shell service call notification 5 i32 1 i32 1000 i32 1000

# Fast blink
adb shell service call notification 5 i32 1 i32 200 i32 200

# Slow blink
adb shell service call notification 5 i32 1 i32 2000 i32 2000
```

RGB LED testing:
```sh
#!/bin/bash
echo "=== RGB LED Test ==="

colors=("255 0 0" "0 255 0" "0 0 255" "255 255 0" "255 0 255" "0 255 255" "255 255 255")

for color in "${colors[@]}"; do
  echo "Testing RGB: $color"
  adb shell service call notification 4 i32 1 $color
  sleep 2
done

adb shell service call notification 4 i32 0
```

LED breathing effect:
```sh
#!/bin/bash
echo "=== LED Breathing Effect ==="

for i in {1..5}; do
  # Fade in
  for brightness in 0 64 128 192 255; do
    adb shell service call notification 4 i32 1 i32 $brightness i32 $brightness i32 $brightness
    sleep 0.2
  done
  
  # Fade out
  for brightness in 255 192 128 64 0; do
    adb shell service call notification 4 i32 1 i32 $brightness i32 $brightness i32 $brightness
    sleep 0.2
  done
done
```

Notification LED control:
```sh
# Enable notification LED
adb shell settings put system notification_light_enabled 1

# Disable notification LED
adb shell settings put system notification_light_enabled 0
```

Charging LED control:
```sh
# Check charging LED status
adb shell dumpsys battery | grep -E "status|health"

# Force charging LED on
adb shell service call battery 6 i32 1
```

LED hardware info:
```sh
adb shell cat /sys/class/leds/*/brightness
adb shell cat /sys/class/leds/*/max_brightness
```

LED debugging:
```sh
adb shell logcat | grep -E "led|LED|notification"
```

System LED settings:
```sh
# Check LED settings
adb shell settings get system notification_light_enabled
adb shell settings get system notification_light_pulse

# Enable pulse effect
adb shell settings put system notification_light_pulse 1
```

App notification LED:
```sh
# Send notification with LED
adb shell am broadcast -a com.example.NOTIFICATION_LED -e color "255 0 0" -e pattern "1000 1000"
```

### Examples

Basic LED color test:
```sh
adb shell service call notification 4 i32 1 i32 255 i32 0 i32 0  # Red
sleep 2
adb shell service call notification 4 i32 1 i32 0 i32 255 i32 0  # Green
sleep 2
adb shell service call notification 4 i32 0
```

LED breathing effect:
```sh
for i in {1..3}; do
  for brightness in 0 64 128 192 255 192 128 64 0; do
    adb shell service call notification 4 i32 1 i32 $brightness i32 $brightness i32 $brightness
    sleep 0.3
  done
done
```

RGB LED spectrum:
```sh
for r in {0..255..51}; do
  g=$((255 - r))
  b=0
  adb shell service call notification 4 i32 1 i32 $r i32 $g i32 $b
  sleep 0.5
done
adb shell service call notification 4 i32 0
```

LED pattern test:
```sh
adb shell service call notification 5 i32 1 i32 500 i32 500
sleep 5
adb shell service call notification 4 i32 0
```

Complete LED test suite:
```sh
#!/bin/bash
echo "=== LED Test Suite ==="

# Color test
echo "Testing colors..."
colors=("255 0 0" "0 255 0" "0 0 255" "255 255 255")
for color in "${colors[@]}"; do
  adb shell service call notification 4 i32 1 $color
  sleep 1
done

# Brightness test
echo "Testing brightness..."
for brightness in 64 128 192 255 128 64; do
  adb shell service call notification 4 i32 1 i32 $brightness i32 $brightness i32 $brightness
  sleep 1
done

# Pattern test
echo "Testing patterns..."
adb shell service call notification 5 i32 1 i32 200 i32 200
sleep 3

# Turn off
adb shell service call notification 4 i32 0

echo "LED test completed"
```

## Notes
- LED control requires appropriate permissions
- Not all devices have notification LEDs
- LED colors may vary by device
- LED operations consume minimal power
- Some devices only support limited colors
- LED patterns may not work on all devices
- Use LED for important notifications only
- Test LED functionality across different devices
