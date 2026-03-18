# Device Info Detailed - ADB Commands

## Description
Comprehensive device information gathering, detailed hardware specs, and system analysis.

### Basic Commands
Complete device info:
```sh
adb shell getprop
```

Hardware details:
```sh
adb shell cat /proc/cpuinfo
```

Memory information:
```sh
adb shell cat /proc/meminfo
```

Storage details:
```sh
adb shell df -h
```

Display information:
```sh
adb shell dumpsys display
```

### Advanced Commands
Full system report:
```sh
adb shell "getprop && cat /proc/cpuinfo && cat /proc/meminfo && df -h" > device_report.txt
```

Sensor information:
```sh
adb shell dumpsys sensorservice
```

Camera details:
```sh
adb shell dumpsys media.camera
```

Network hardware:
```sh
adb shell cat /proc/net/wireless
```

Battery details:
```sh
adb shell dumpsys battery
```

Thermal information:
```sh
adb shell cat /sys/class/thermal/thermal_zone*/temp
```

Audio hardware:
```sh
adb shell dumpsys audio
```

Graphics information:
```sh
adb shell dumpsys SurfaceFlinger
```

Security information:
```sh
adb shell getprop ro.boot.verifiedbootstate
```

System services:
```sh
adb shell service list
```

## Notes
- Some information requires root access
- Device specs vary by manufacturer
- Use comprehensive reports for documentation
- Some hardware info may be restricted
