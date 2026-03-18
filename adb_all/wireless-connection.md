# Wireless Connection - ADB Commands

## Description
Wireless ADB connection commands for WiFi-based device communication, enabling cable-free debugging and device management.

### Basic Commands

Connect to device via WiFi:
```sh
adb connect <device_ip>:5555
```

Disconnect wireless connection:
```sh
adb disconnect <device_ip>:5555
```

List all connected devices:
```sh
adb devices
```

### Advanced Commands

Enable wireless debugging (Android 11+):
```sh
adb shell svc adb tcpip 5555
```

Disable wireless debugging:
```sh
adb shell svc adb usb
``

Check current connection mode:
```sh
adb shell getprop service.adb.tcp.port
```

Set custom port for wireless debugging:
```sh
adb shell svc adb tcpip 5556
```

Connect with custom port:
```sh
adb connect <device_ip>:5556
```

Check WiFi connection status:
```sh
adb shell dumpsys wifi | grep mWifiInfo
```

Get device IP address:
```sh
adb shell ip addr show wlan0
```

Pair device with pairing code (Android 11+):
```sh
adb pair <device_ip>:port <pairing_code>
```

### Examples

Standard wireless connection setup:
```sh
# Step 1: Connect via USB first
adb devices

# Step 2: Enable TCP/IP mode
adb shell svc adb tcpip 5555

# Step 3: Get device IP
adb shell ip addr show wlan0 | grep 'inet '

# Step 4: Connect wirelessly
adb connect 192.168.1.100:5555
```

Pair with Android 11+ device:
```sh
adb pair 192.168.1.100:38679 123456
# Expected output: Successfully paired to 192.168.1.100:38679
```

## Notes
- Device must be on the same WiFi network as the computer
- Initial USB connection is required for most devices
- Android 11+ supports wireless debugging without initial USB connection
- Default port is 5555, but can be customized
- Some devices may require root for wireless debugging
