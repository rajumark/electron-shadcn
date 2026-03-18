# Heart Rate Sensor - ADB Commands

## Description
Commands for managing Android heart rate sensors, monitoring heart rate data, and health sensor operations.

### Basic Commands

Check heart rate sensor availability:
```sh
adb shell pm list features | grep -E "heart|sensor|health"
```

List heart rate sensors:
```sh
adb shell dumpsys sensorservice | grep -E "heart.*rate|Heart.*Rate"
```

Check sensor permissions:
```sh
adb shell dumpsys package com.example.app | grep -E "sensor|body|HEART_RATE"
```

Grant body sensor permission:
```sh
adb shell pm grant com.example.app android.permission.BODY_SENSORS
```

Check heart rate data:
```sh
adb shell dumpsys sensorservice | grep -A 5 "heart.*rate"
```

### Advanced Commands

Heart rate sensor activation:
```sh
# Enable heart rate sensor
adb shell service call sensors 20 i32 1 i32 65534  # Heart rate sensor type
```

Heart rate monitoring:
```sh
# Start continuous monitoring
adb shell am startservice -n com.example.app/.HeartRateService
```

Heart rate data collection:
```sh
# Collect heart rate data
for i in {1..60}; do
  echo "Reading $i:"
  adb shell dumpsys sensorservice | grep -E "heart.*rate" | tail -1
  sleep 2
done
```

Heart rate sensor calibration:
```sh
# Check calibration
adb shell cat /sys/class/sensor/heart_rate/calibration
adb shell service call sensors 21 i32 0 f32 1.0  # Calibration factor
```

Heart rate sensor accuracy:
```sh
# Check sensor accuracy
adb shell dumpsys sensorservice | grep -E "heart.*rate.*accuracy"
```

Heart rate sensor frequency:
```sh
# Set sampling frequency
adb shell service call sensors 22 i32 0 i32 50  # 50Hz sampling
```

Heart rate sensor power management:
```sh
# Check power consumption
adb shell dumpsys sensorservice | grep -E "heart.*rate.*power"
```

Heart rate sensor debugging:
```sh
# Enable debugging
adb shell setprop log.tag.HeartRateSensor VERBOSE
adb shell logcat | grep HeartRateSensor
```

Heart rate data validation:
```sh
# Validate heart rate data
adb shell am broadcast -a com.example.VALIDATE_HEART_RATE -e bpm "72" -e accuracy "HIGH"
```

Health data integration:
```sh
# Integrate with health platform
adb shell am start -a com.google.android.apps.health.DATA_ADD -e datatype "com.google.heart_rate.bpm" -e value "75"
```

Heart rate alert system:
```sh
# Set heart rate alerts
adb shell am broadcast -a com.example.HEART_RATE_ALERT -e threshold "150" -e action "HIGH_RATE"
```

Heart rate sensor firmware:
```sh
# Check firmware version
adb shell getprop ro.hardware.heart_rate.version
adb shell cat /sys/class/sensor/heart_rate/fw_version
```

Heart rate sensor stress test:
```sh
# Stress test sensor
for i in {1..100}; do
  adb shell service call sensors 20 i32 1 i32 65534
  sleep 0.1
done
```

Heart rate sensor data export:
```sh
# Export heart rate data
adb shell am broadcast -a com.example.EXPORT_HEART_RATE -e format "csv" -e duration "3600"
```

### Examples

Basic heart rate sensor check:
```sh
adb shell pm list features | grep -E "heart|sensor"
adb shell dumpsys sensorservice | grep -E "heart.*rate"
```

Heart rate monitoring:
```sh
adb shell am startservice -n com.example.app/.HeartRateService
for i in {1..10}; do
  echo "Heart rate reading $i:"
  adb shell dumpsys sensorservice | grep -E "heart.*rate" | tail -1
  sleep 3
done
```

Heart rate sensor calibration:
```sh
adb shell service call sensors 21 i32 0 f32 1.05
adb shell service call sensors 20 i32 1 i32 65534
sleep 5
adb shell dumpsys sensorservice | grep -E "heart.*rate"
```

Heart rate sensor performance:
```sh
adb shell logcat | grep -E "heart.*rate|sensor" | tail -20
```

Complete heart rate sensor test:
```sh
#!/bin/bash
echo "=== Heart Rate Sensor Test Suite ==="

# Hardware check
echo "Checking heart rate sensor hardware..."
adb shell pm list features | grep -E "heart|sensor"

# Sensor status
echo "Checking sensor status..."
adb shell dumpsys sensorservice | grep -E "heart.*rate" | head -5

# Calibration
echo "Calibrating sensor..."
adb shell service call sensors 21 i32 0 f32 1.0

# Test readings
echo "Taking heart rate readings..."
for i in {1..5}; do
  echo "Reading $i:"
  adb shell service call sensors 20 i32 1 i32 65534
  sleep 2
  adb shell dumpsys sensorservice | grep -E "heart.*rate" | tail -1
done

echo "Heart rate sensor test completed"
```

## Notes
- Heart rate sensors require BODY_SENSORS permission
- Not all devices have heart rate sensors
- Heart rate data is considered sensitive health information
- Sensor accuracy may vary by device and conditions
- Heart rate monitoring can impact battery life
- Consider privacy regulations for health data
- Test sensors in appropriate conditions
- Some devices may have specialized health sensors
