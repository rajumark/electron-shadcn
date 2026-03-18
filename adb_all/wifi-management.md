# WiFi Management - ADB Commands

## Description
Commands for managing WiFi connections, configuring wireless settings, and WiFi network operations on Android devices.

### Basic Commands

Enable WiFi:
```sh
adb shell svc wifi enable
```

Disable WiFi:
```sh
adb shell svc wifi disable
```

Check WiFi status:
```sh
adb shell settings get global wifi_on
```

List WiFi networks:
```sh
adb shell dumpsys wifi | grep -E "SSID|BSSID"
```

Get current WiFi info:
```sh
adb shell dumpsys wifi | grep -E "SSID|frequency|rssi"
```

### Advanced Commands

Connect to WiFi network:
```sh
adb shell su -c "wpa_supplicant -i wlan0 -B"
```

Check WiFi configuration:
```sh
adb shell dumpsys wifi | grep -A 10 "Configured networks"
```

Get WiFi signal strength:
```sh
adb shell dumpsys wifi | grep -E "rssi|signal"
```

Check WiFi frequency:
```sh
adb shell dumpsys wifi | grep frequency
```

List saved networks:
```sh
adb shell settings get global wifi_saved_state
```

Monitor WiFi connections:
```sh
adb shell logcat | grep -E "wifi|wlan|connect"
```

Check WiFi IP address:
```sh
adb shell ip addr show wlan0
```

Get WiFi MAC address:
```sh
adb shell cat /sys/class/net/wlan0/address
```

Check WiFi speed:
```sh
adb shell dumpsys wifi | grep -E "link.*speed|bitrate"
```

Forget WiFi network:
```sh
adb shell su -c "wpa_cli remove_network network_id"
```

Check WiFi security:
```sh
adb shell dumpsys wifi | grep -E "security|encryption"
```

Set WiFi scan mode:
```sh
adb shell settings put global wifi_scan_always_enabled 1
```

### Examples

Enable WiFi and check status:
```sh
adb shell svc wifi enable
adb shell settings get global wifi_on
```

Check current WiFi connection:
```sh
adb shell dumpsys wifi | grep -E "SSID|BSSID|rssi"
```

Get WiFi IP configuration:
```sh
adb shell ip addr show wlan0 | grep -E "inet|wlan0"
```

Monitor WiFi connection events:
```sh
adb shell logcat | grep -E "wifi.*connect|wlan.*state"
```

Check WiFi signal strength:
```sh
adb shell dumpsys wifi | grep rssi
```

List all configured networks:
```sh
adb shell dumpsys wifi | grep -A 20 "Configured networks"
```

Get WiFi hardware info:
```sh
adb shell cat /sys/class/net/wlan0/address
adb shell iwconfig wlan0
```

## Notes
- WiFi management requires appropriate permissions
- Some commands require root access
- WiFi settings may be controlled by device admin
- Network configuration varies by Android version
- Use `dumpsys wifi` for comprehensive WiFi info
- Some WiFi operations may be restricted on carrier devices
- WiFi MAC address may be randomized for privacy
- Use `svc wifi` for basic WiFi control
