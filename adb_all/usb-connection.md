# USB Connection - ADB Commands

## Description
USB-specific ADB connection commands for wired device communication, debugging, and troubleshooting USB connectivity issues.

### Basic Commands

Check USB connection status:
```sh
adb usb
```

Restart USB connection:
```sh
adb disconnect
```

Reconnect via USB:
```sh
adb connect <device_ip>:5555
```

### Advanced Commands

Check USB device permissions:
```sh
adb shell cat /sys/bus/usb/devices/*/product
```

List USB devices connected to host:
```sh
adb shell ls /sys/bus/usb/devices/
```

Check USB debugging status:
```sh
adb shell settings get global adb_enabled
```

Enable USB debugging via ADB (requires root):
```sh
adb shell settings put global adb_enabled 1
```

Check USB configuration:
```sh
adb shell getprop sys.usb.config
```

Set USB configuration (requires root):
```sh
adb shell setprop sys.usb.config mtp,adb
```

Reset USB connection:
```sh
adb shell svc usb reset
```

### Examples

Check if USB debugging is enabled:
```sh
adb shell settings get global adb_enabled
# Expected output: 1 (enabled) or 0 (disabled)
```

View current USB configuration:
```sh
adb shell getprop sys.usb.config
# Expected output: mtp,adb
```

## Notes
- USB debugging must be enabled in Developer Options on the device
- Some commands require root access
- USB drivers must be properly installed on the host computer
- Always authorize the connection on the device when prompted
