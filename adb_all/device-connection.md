# Device Connection - ADB Commands

## Description
Basic device connection, detection, and ADB server management commands for establishing communication between your computer and Android devices.

### Basic Commands

Start ADB server:
```sh
adb start-server
```

Stop ADB server:
```sh
adb kill-server
```

Check ADB version:
```sh
adb version
```

List connected devices:
```sh
adb devices
```

Check device connection status:
```sh
adb get-state
```

### Advanced Commands

Restart ADB server with custom port:
```sh
adb -P 5038 start-server
```

Check ADB server status:
```sh
adb get-serialno
```

List devices with detailed info:
```sh
adb devices -l
```

Connect to specific device by serial:
```sh
adb -s <serial_number> <command>
```

Connect to USB device only:
```sh
adb -d <command>
```

Connect to emulator only:
```sh
adb -e <command>
```

### Examples

Check if device is properly connected:
```sh
adb devices
# Expected output:
# List of devices attached
# emulator-5554	device
```

Get device serial number:
```sh
adb get-serialno
# Expected output:
# emulator-5554
```

## Notes
- ADB server starts automatically when you run any adb command
- Default ADB port is 5037
- Use `-s` flag when multiple devices are connected
- Some commands require USB debugging enabled on device
