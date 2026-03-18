# Ambient Light Sensor - ADB Commands

## Description
Commands for managing Android ambient light sensors, light detection, and automatic brightness control operations.

### Basic Commands

Check ambient light sensor availability:
```sh
adb shell pm list features | grep sensor
```

List ambient light sensors:
```sh
adb shell dumpsys sensorservice | grep -E "light|Light|ambient"
```

Check sensor permissions:
```sh
adb shell dumpsys package com.example.app | grep -E "sensor|light"
```

Check ambient light status:
```sh
adb shell dumpsys sensorservice | grep -A 5 "light"
```

Test ambient light sensor:
```sh
adb shell service call sensors 5 i32 1  # Enable light sensor
```

### Advanced Commands

Ambient light sensor activation:
```sh
# Enable ambient light sensor
adb shell service call sensors 5 i32 1 i32 5  # Light sensor type
```

Light level monitoring:
```sh
# Monitor light levels
while true; do
  echo "$(date): $(adb shell dumpsys sensorservice | grep -E "light" | tail -1)"
  sleep 2
done
```

Ambient light calibration:
```sh
# Check calibration
adb shell cat /sys/class/sensor/light/calibration
adb shell service call sensors 6 i32 0 f32 1.2  # Calibration factor
```

Light sensor accuracy:
```sh
# Check sensor accuracy
adb shell dumpsys sensorservice | grep -E "light.*accuracy"
```

Light sensor frequency:
```sh
# Set sampling frequency
adb shell service call sensors 7 i32 0 i32 5  # 5Hz sampling
```

Light sensor range:
```sh
# Check sensor range
adb shell cat /sys/class/sensor/light/max_range
adb shell cat /sys/class/sensor/light/resolution
```

Automatic brightness control:
```sh
# Check auto-brightness settings
adb shell settings get system screen_brightness_mode
adb shell settings put system screen_brightness_mode 1  # Enable auto-brightness
```

Light sensor power management:
```sh
# Check power consumption
adb shell dumpsys sensorservice | grep -E "light.*power"
```

Light sensor debugging:
```sh
# Enable debugging
adb shell setprop log.tag.LightSensor VERBOSE
adb shell logcat | grep LightSensor
```

Light level testing:
```sh
# Test different light conditions
echo "Testing in different light conditions..."
for i in {1..20}; do
  echo "Reading $i (change lighting conditions):"
  adb shell dumpsys sensorservice | grep -E "light" | tail -1
  sleep 3
done
```

Light sensor events:
```sh
# Monitor sensor events
adb shell logcat | grep -E "light.*event|sensor.*change"
```

Light sensor integration:
```sh
# Test with app integration
adb shell am start -n com.example.app/.LightSensorActivity
sleep 3
# Change lighting conditions to test
```

Light sensor firmware:
```sh
# Check firmware version
adb shell getprop ro.hardware.light.version
adb shell cat /sys/class/sensor/light/fw_version
```

Light sensor stress test:
```sh
# Stress test sensor
for i in {1..500}; do
  adb shell service call sensors 5 i32 1 i32 5
  sleep 0.02
done
```

Brightness adjustment based on light:
```sh
# Automatic brightness adjustment
while true; do
  light_level=$(adb shell dumpsys sensorservice | grep -E "light" | grep -o '[0-9]*\.' | head -1)
  if [ ! -z "$light_level" ]; then
    brightness=$((light_level / 10))
    if [ $brightness -gt 255 ]; then brightness=255; fi
    adb shell settings put system screen_brightness $brightness
    echo "Light: $light_level, Brightness: $brightness"
  fi
  sleep 5
done
```

### Examples

Basic ambient light sensor check:
```sh
adb shell dumpsys sensorservice | grep -E "light|Light|ambient"
```

Light level monitoring:
```sh
echo "Monitoring ambient light levels (change lighting to test)..."
for i in {1..15}; do
  echo "Reading $i:"
  adb shell dumpsys sensorservice | grep -E "light" | tail -1
  sleep 2
done
```

Automatic brightness control:
```sh
adb shell settings put system screen_brightness_mode 1
echo "Auto-brightness enabled"
for i in {1..10}; do
  light=$(adb shell dumpsys sensorservice | grep -E "light" | grep -o '[0-9]*\.' | head -1)
  brightness=$((light / 10))
  adb shell settings put system screen_brightness $brightness
  echo "Light: $light, Brightness: $brightness"
  sleep 3
done
```

Light sensor calibration:
```sh
adb shell service call sensors 6 i32 0 f32 1.0
adb shell service call sensors 5 i32 1 i32 5
echo "Sensor calibrated and activated"
```

Complete ambient light sensor test:
```sh
#!/bin/bash
echo "=== Ambient Light Sensor Test Suite ==="

# Hardware check
echo "Checking ambient light sensor hardware..."
adb shell pm list features | grep sensor

# Sensor status
echo "Checking sensor status..."
adb shell dumpsys sensorservice | grep -E "light" | head -5

# Calibration
echo "Calibrating sensor..."
adb shell service call sensors 6 i32 0 f32 1.0

# Test readings
echo "Testing sensor readings (change lighting conditions)..."
for i in {1..10}; do
  echo "Reading $i:"
  adb shell service call sensors 5 i32 1 i32 5
  sleep 2
  adb shell dumpsys sensorservice | grep -E "light" | tail -1
done

echo "Ambient light sensor test completed"
```

## Notes
- Ambient light sensors are common on smartphones
- Used for automatic brightness adjustment
- Light levels measured in lux
- Sensor range varies by device
- Light sensors consume minimal power
- Test sensors in different lighting conditions
- Some devices have multiple light sensors
- Consider sensor placement when testing
- Automatic brightness may be affected by screen protector
