# Sensors - ADB Commands

## Description
Commands for accessing sensor information, monitoring sensor data, and managing device sensors via ADB.

### Basic Commands

List available sensors:
```sh
adb shell dumpsys sensorservice
```

Get sensor list:
```sh
adb shell dumpsys sensorservice | grep -A 20 "Dynamic Sensor List"
```

Monitor accelerometer:
```sh
adb shell dumpsys sensorservice | grep -A 10 "Accelerometer"
```

Check gyroscope status:
```sh
adb shell dumpsys sensorservice | grep -A 10 "Gyroscope"
```

Get magnetometer data:
```sh
adb shell dumpsys sensorservice | grep -A 10 "Magnetic"
```

### Advanced Commands

Get all sensor details:
```sh
adb shell dumpsys sensorservice | grep -E "name|vendor|version|handle"
```

Monitor light sensor:
```sh
adb shell dumpsys sensorservice | grep -A 10 "Light"
```

Check proximity sensor:
```sh
adb shell dumpsys sensorservice | grep -A 10 "Proximity"
```

Get pressure sensor data:
```sh
adb shell dumpsys sensorservice | grep -A 10 "Pressure"
```

Monitor temperature sensors:
```sh
adb shell dumpsys sensorservice | grep -A 10 "Temperature"
```

Check sensor power consumption:
```sh
adb shell dumpsys sensorservice | grep -E "power|mA"
```

Get sensor resolution:
```sh
adb shell dumpsys sensorservice | grep -E "resolution|maxRange"
```

Monitor sensor events:
```sh
adb shell logcat | grep -i sensor
```

Check sensor HAL version:
```sh
adb shell dumpsys sensorservice | grep -E "HAL|version"
```

### Examples

List all sensor types:
```sh
adb shell dumpsys sensorservice | grep "handle=" | awk '{print $2}'
```

Check if specific sensor exists:
```sh
adb shell dumpsys sensorservice | grep -i accelerometer
```

Monitor sensor activity:
```sh
adb shell watch -n 1 "dumpsys sensorservice | grep -A 5 'Active sensors'"
```

Get sensor vendor info:
```sh
adb shell dumpsys sensorservice | grep -E "vendor|name"
```

Check sensor power usage:
```sh
adb shell dumpsys sensorservice | grep -i power
```

## Notes
- Sensor data access may require specific permissions
- Not all devices have all sensor types
- Sensor availability varies by device manufacturer
- Some sensors may be disabled when screen is off
- Use `adb shell dumpsys sensorservice` for comprehensive sensor info
- Real-time sensor monitoring may require special permissions or root
