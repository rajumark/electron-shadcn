# Network Information - ADB Commands

## Description
Commands for retrieving network configuration, connectivity status, and network interface information on Android devices.

### Basic Commands

Get network interfaces:
```sh
adb shell ip addr
```

Check network connectivity:
```sh
adb shell ping -c 4 8.8.8.8
```

Get WiFi status:
```sh
adb shell dumpsys wifi
```

Check mobile data status:
```sh
adb shell dumpsys telephony.registry
```

Get network statistics:
```sh
adb shell cat /proc/net/dev
```

### Advanced Commands

Get detailed network config:
```sh
adb shell dumpsys connectivity
```

Check DNS settings:
```sh
adb shell getprop | grep dns
```

Get network routes:
```sh
adb shell ip route
```

Monitor network traffic:
```sh
adb shell cat /proc/net/netstat
```

Check network latency:
```sh
adb shell ping -c 10 -i 0.5 8.8.8.8
```

Get WiFi connection details:
```sh
adb shell dumpsys wifi | grep -E "SSID|BSSID|frequency"
```

Check mobile network type:
```sh
adb shell dumpsys telephony.registry | grep networkType
```

Get network interface stats:
```sh
adb shell cat /proc/net/wireless
```

Monitor network connections:
```sh
adb shell netstat -an
```

### Examples

Check if WiFi is connected:
```sh
adb shell dumpsys wifi | grep "Wi-Fi is enabled"
```

Get current WiFi SSID:
```sh
adb shell dumpsys wifi | grep "SSID:"
```

Check mobile data signal strength:
```sh
adb shell dumpsys telephony.registry | grep signalStrength
```

Monitor network data usage:
```sh
adb shell cat /proc/net/dev | grep -E "wlan|rmnet"
```

Get network gateway:
```sh
adb shell ip route | grep default
```

## Notes
- Some network information requires location permissions
- WiFi commands may not work on all Android versions
- Mobile network info varies by carrier and device
- Network statistics reset on device reboot
- Use `adb shell dumpsys` for comprehensive network service info
- Some network monitoring may require root access
