# Proximity Sensor - ADB Commands

## Description
Commands for managing Android proximity sensors, distance detection, and proximity sensing operations.

### Basic Commands

Check proximity sensor availability:
```sh
adb shell pm list features | grep sensor
```

List proximity sensors:
```sh
adb shell dumpsys sensorservice | grep -E "proximity|Proximity"
```

Check sensor permissions:
```sh
adb shell dumpsys package com.example.app | grep -E "sensor|proximity"
```

Check proximity sensor status:
```sh
adb shell dumpsys sensorservice | grep -A 5 "proximity"
```

Test proximity sensor:
```sh
adb shell service call sensors 8 i32 1  # Enable proximity sensor
```

### Advanced Commands

Proximity sensor activation:
```sh
# Enable proximity sensor
adb shell service call sensors 8 i32 1 i32 8  # Proximity sensor type
```

Proximity data monitoring:
```sh
# Monitor proximity data
while true; do
  echo "$(date): $(adb shell dumpsys sensorservice | grep -E "proximity" | tail -1)"
  sleep 1
done
```

Proximity sensor calibration:
```sh
# Check calibration
adb shell cat /sys/class/sensor/proximity/calibration
adb shell service call sensors 9 i32 0 f32 5.0  # Calibrate distance threshold
```

Proximity sensor accuracy:
```sh
# Check sensor accuracy
adb shell dumpsys sensorservice | grep -E "proximity.*accuracy"
```

Proximity sensor frequency:
```sh
# Set sampling frequency
adb shell service call sensors 10 i32 0 i32 10  # 10Hz sampling
```

Proximity sensor power management:
```sh
# Check power consumption
adb shell dumpsys sensorservice | grep -E "proximity.*power"
```

Proximity sensor debugging:
```sh
# Enable debugging
adb shell setprop log.tag.ProximitySensor VERBOSE
adb shell logcat | grep ProximitySensor
```

Proximity sensor testing:
```sh
# Test with hand covering sensor
echo "Cover proximity sensor with hand..."
for i in {1..10}; do
  echo "Reading $i:"
  adb shell dumpsys sensorservice | grep -E "proximity" | tail -1
  sleep 1
done
```

Proximity sensor range:
```sh
# Check sensor range
adb shell cat /sys/class/sensor/proximity/max_range
adb shell cat /sys/class/sensor/proximity/resolution
```

Proximity sensor events:
```sh
# Monitor sensor events
adb shell logcat | grep -E "proximity.*event|sensor.*change"
```

Proximity sensor integration:
```sh
# Test with app integration
adb shell am start -n com.example.app/.ProximityActivity
sleep 3
# Cover/uncover sensor to test
```

Proximity sensor firmware:
```sh
# Check firmware version
adb shell getprop ro.hardware.proximity.version
adb shell cat /sys/class/sensor/proximity/fw_version
```

Proximity sensor stress test:
```sh
# Stress test sensor
for i in {1..1000}; do
  adb shell service call sensors 8 i32 1 i32 8
  sleep 0.01
done
```

Proximity sensor data validation:
```sh
# Validate sensor data
adb shell am broadcast -a com.example.VALIDATE_PROXIMITY -e distance "5.0" -e near "true"
```

### Examples

Basic proximity sensor check:
```sh
adb shell dumpsys sensorservice | grep -E "proximity|Proximity"
```

Proximity sensor monitoring:
```sh
echo "Monitoring proximity sensor (cover sensor to test)..."
for i in {1..20}; do
  echo "Reading $i:"
  adb shell dumpsys sensorservice | grep -E "proximity" | tail -1
  sleep 1
done
```

Proximity sensor calibration:
```sh
adb shell service call sensors 9 i32 0 f32 3.0
adb shell service call sensors 8 i32 1 i32 8
echo "Sensor calibrated and activated"
```

Proximity sensor performance:
```sh
adb shell logcat | grep -E "proximity|sensor" | tail -20
```

Complete proximity sensor test:
```sh
#!/bin/bash
echo "=== Proximity Sensor Test Suite ==="

# Hardware check
echo "Checking proximity sensor hardware..."
adb shell pm list features | grep sensor

# Sensor status
echo "Checking sensor status..."
adb shell dumpsys sensorservice | grep -E "proximity" | head -5

# Calibration
echo "Calibrating sensor..."
adb shell service call sensors 9 i32 0 f32 5.0

# Test readings
echo "Testing sensor readings..."
echo "Cover and uncover the sensor..."
for i in {1..10}; do
  echo "Reading $i:"
  adb shell service call sensors 8 i32 1 i32 8
  sleep 1
  adb shell dumpsys sensorservice | grep -E "proximity" | tail -1
done

echo "Proximity sensor test completed"
```

## Notes
- Proximity sensors are common on smartphones
- Used for turning off screen during calls
- Sensor range is typically 0-5 cm
- Proximity sensors consume minimal power
- Sensor accuracy may vary by device
- Test sensors with actual proximity changes
- Some devices have multiple proximity sensors
- Consider sensor placement when testing
