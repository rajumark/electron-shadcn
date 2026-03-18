# Sensor Calibration - ADB Commands

## Description
Commands for calibrating Android sensors, managing sensor accuracy, and sensor performance optimization.

### Basic Commands

List available sensors:
```sh
adb shell dumpsys sensorservice | grep -E "Sensor|Name"
```

Check sensor status:
```sh
adb shell dumpsys sensorservice | grep -E "active|enabled"
```

Calibrate accelerometer:
```sh
adb shell service call sensors 1 i32 0 f32 0.0 f32 0.0 f32 1.0
```

Calibrate gyroscope:
```sh
adb shell service call sensors 2 i32 0 f32 0.0 f32 0.0 f32 0.0
```

Check sensor accuracy:
```sh
adb shell dumpsys sensorservice | grep -E "accuracy|precision"
```

### Advanced Commands

Complete sensor calibration:
```sh
#!/bin/bash
echo "=== Sensor Calibration ==="

# Accelerometer calibration
adb shell service call sensors 1 i32 0 f32 0.0 f32 0.0 f32 1.0

# Gyroscope calibration
adb shell service call sensors 2 i32 0 f32 0.0 f32 0.0 f32 0.0

# Magnetometer calibration
adb shell service call sensors 3 i32 0 f32 0.0 f32 0.0 f32 0.0

# Light sensor calibration
adb shell service call sensors 5 i32 0 f32 1.0

echo "Calibration completed"
```

Sensor drift compensation:
```sh
adb shell service call sensors 10 i32 0 f32 0.1
```

Sensor filter settings:
```sh
adb shell service call sensors 11 i32 0 i32 1  # Enable low-pass filter
```

Sensor sampling rate:
```sh
adb shell service call sensors 12 i32 0 i32 100  # 100Hz sampling
```

Sensor bias correction:
```sh
adb shell service call sensors 13 i32 0 f32 0.01 f32 0.01 f32 0.01
```

Temperature compensation:
```sh
adb shell service call sensors 14 i32 0 f32 0.001
```

Sensor noise reduction:
```sh
adb shell service call sensors 15 i32 0 i32 1
```

Calibration validation:
```sh
adb shell dumpsys sensorservice | grep -E "calibrated|offset|bias"
```

Auto-calibration enable:
```sh
adb shell service call sensors 16 i32 0 i32 1
```

Sensor factory reset:
```sh
adb shell service call sensors 99 i32 0
```

Calibration data backup:
```sh
adb shell cat /data/system/sensors/calibration_data.xml > sensor_backup.xml
```

Calibration data restore:
```sh
adb push sensor_backup.xml /data/system/sensors/calibration_data.xml
```

### Examples

Basic sensor calibration:
```sh
adb shell service call sensors 1 i32 0 f32 0.0 f32 0.0 f32 1.0  # Accelerometer
adb shell service call sensors 2 i32 0 f32 0.0 f32 0.0 f32 0.0  # Gyroscope
```

Check sensor accuracy:
```sh
adb shell dumpsys sensorservice | grep -E "accuracy|precision|calibrated"
```

Calibration validation:
```sh
adb shell service call sensors 1 i32 0 f32 0.0 f32 0.0 f32 1.0
sleep 5
adb shell dumpsys sensorservice | grep accelerometer
```

Sensor sampling rate adjustment:
```sh
adb shell service call sensors 12 i32 0 i32 200  # 200Hz for high precision
```

Complete calibration workflow:
```sh
#!/bin/bash
echo "Starting sensor calibration..."

# Enable auto-calibration
adb shell service call sensors 16 i32 0 i32 1

# Calibrate all sensors
for sensor in 1 2 3 5; do
  adb shell service call sensors $sensor i32 0 f32 0.0 f32 0.0 f32 0.0
  sleep 2
done

# Validate calibration
adb shell dumpsys sensorservice | grep -E "calibrated|accuracy"

echo "Calibration completed"
```

## Notes
- Sensor calibration requires appropriate permissions
- Some calibration may require device to be stationary
- Calibration data may be lost after reboot
- Test sensor accuracy after calibration
- Different devices have different sensor hardware
- Some sensors may not support manual calibration
- Calibration affects app sensor readings
- Document calibration procedures for consistency
