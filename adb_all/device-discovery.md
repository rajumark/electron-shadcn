# Device Discovery - ADB Commands

## Description
Commands for finding, identifying, and gathering information about connected Android devices and emulators.

### Basic Commands

List all connected devices:
```sh
adb devices
```

List devices with detailed information:
```sh
adb devices -l
```

Get device serial number:
```sh
adb get-serialno
```

Check if any device is connected:
```sh
adb get-state
```

### Advanced Commands

Get device manufacturer:
```sh
adb shell getprop ro.product.manufacturer
```

Get device model:
```sh
adb shell getprop ro.product.model
```

Get device name:
```sh
adb shell getprop ro.product.device
```

Get Android version:
```sh
adb shell getprop ro.build.version.release
```

Get API level:
```sh
adb shell getprop ro.build.version.sdk
```

Get device ID:
```sh
adb shell settings get secure android_id
```

Get IMEI (requires root or special permissions):
```sh
adb shell service call iphonesubinfo 1
```

Get MAC address:
```sh
adb shell cat /sys/class/net/wlan0/address
```

List all system properties:
```sh
adb shell getprop
```

Get bootloader version:
```sh
adb shell getprop ro.bootloader
```

Get device fingerprint:
```sh
adb shell getprop ro.build.fingerprint
```

### Examples

Comprehensive device information:
```sh
#!/bin/bash
echo "=== Device Information ==="
echo "Serial: $(adb get-serialno)"
echo "Manufacturer: $(adb shell getprop ro.product.manufacturer)"
echo "Model: $(adb shell getprop ro.product.model)"
echo "Android Version: $(adb shell getprop ro.build.version.release)"
echo "API Level: $(adb shell getprop ro.build.version.sdk)"
echo "Device ID: $(adb shell settings get secure android_id)"
```

Find all devices on network:
```sh
adb shell ip neigh | grep -E "REACHABLE|STALE"
```

## Notes
- Some commands may require root access
- IMEI retrieval may not work on all Android versions
- MAC address may show as "02:00:00:00:00:00" on newer Android versions due to privacy restrictions
- Use `-l` flag for more detailed device information including model and transport type
