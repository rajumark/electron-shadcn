# Hardware Information - ADB Commands

## Description
Commands for retrieving detailed hardware specifications, CPU information, and hardware component details from Android devices.

### Basic Commands

Get CPU architecture:
```sh
adb shell getprop ro.product.cpu.abi
```

Get CPU info:
```sh
adb shell cat /proc/cpuinfo
```

Get memory info:
```sh
adb shell cat /proc/meminfo
```

Get hardware platform:
```sh
adb shell getprop ro.hardware
```

Get board platform:
```sh
adb shell getprop ro.board.platform
```

### Advanced Commands

Get CPU frequency info:
```sh
adb shell cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_cur_freq
```

Get CPU cores count:
```sh
adb shell ls /sys/devices/system/cpu/ | grep cpu | wc -l
```

Get GPU info:
```sh
adb shell cat /proc/driver/graphics/*/info
```

Get thermal zones:
```sh
adb shell ls /sys/class/thermal/
```

Get temperature sensors:
```sh
adb shell cat /sys/class/thermal/thermal_zone*/temp
```

Get display hardware:
```sh
adb shell dumpsys display | grep -E "mBaseDisplayInfo|mPhysicalDisplayInfo"
```

Get camera hardware:
```sh
adb shell dumpsys media.camera | grep -E "Camera|Sensor"
```

Get sensor list:
```sh
adb shell dumpsys sensorservice
```

Get storage devices:
```sh
adb shell ls -la /dev/block/
```

### Examples

Check CPU architecture details:
```sh
adb shell getprop | grep cpu
```

Monitor CPU frequency in real-time:
```sh
adb shell watch -n 1 cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_cur_freq
```

Get all hardware properties:
```sh
adb shell getprop | grep -E "ro.hardware|ro.board|ro.product.cpu"
```

Check GPU renderer:
```sh
adb shell dumpsys SurfaceFlinger | grep GLES
```

Get battery health:
```sh
adb shell dumpsys battery | grep -E "health|technology|status"
```

## Notes
- Some hardware info requires root access
- CPU frequency paths may vary between devices
- Not all devices expose all sensor information
- GPU information varies by manufacturer
- Use `adb shell dumpsys` for comprehensive hardware service information
- Some files in /proc/ and /sys/ may not be accessible on all devices
