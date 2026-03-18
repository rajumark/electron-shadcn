# Tethering - ADB Commands

## Description
Commands for managing USB tethering, WiFi hotspot, and Bluetooth tethering operations on Android devices.

### Basic Commands

Enable WiFi hotspot:
```sh
adb shell svc wifi enable
adb shell settings put global tether_dun_required 0
```

Disable WiFi hotspot:
```sh
adb shell settings put global wifi_ap_state 10
```

Check tethering status:
```sh
adb shell settings get global tether_dun_required
```

List tethered interfaces:
```sh
adb shell cat /proc/net/dev | grep -E "wlan|usb|bt-pan"
```

Check hotspot configuration:
```sh
adb shell settings get global wifi_ap_config
```

### Advanced Commands

Enable USB tethering:
```sh
adb shell service call connectivity 33 i32 0 i32 1
```

Disable USB tethering:
```sh
adb shell service call connectivity 33 i32 0 i32 0
```

Enable Bluetooth tethering:
```sh
adb shell service call connectivity 34 i32 0 i32 1
```

Disable Bluetooth tethering:
```sh
adb shell service call connectivity 34 i32 0 i32 0
```

Check tethering interfaces:
```sh
adb shell dumpsys connectivity | grep -E "tether|interface"
```

Monitor tethering usage:
```sh
adb shell dumpsys netstats | grep -E "tether|hotspot"
```

Set hotspot SSID:
```sh
adb shell settings put global wifi_ap_ssid "MyHotspot"
```

Set hotspot password:
```sh
adb shell settings put global wifi_ap_passphrase "password123"
```

Check tethering permissions:
```sh
adb shell dumpsys package | grep -E "tether|hotspot"
```

Monitor tethering events:
```sh
adb shell logcat | grep -E "tether|hotspot|connectivity"
```

Check tethering data usage:
```sh
adb shell dumpsys netstats | grep -E "tether.*rx|tether.*tx"
```

Set hotspot security:
```sh
adb shell settings put global wifi_ap_security 2
```

Check connected tethered devices:
```sh
adb shell dumpsys connectivity | grep -E "connected.*device|client"
```

### Examples

Enable WiFi hotspot:
```sh
adb shell settings put global wifi_ap_state 13
adb shell settings put global wifi_ap_ssid "AndroidAP"
adb shell settings put global wifi_ap_passphrase "password123"
```

Enable USB tethering:
```sh
adb shell service call connectivity 33 i32 0 i32 1
```

Check tethering status:
```sh
adb shell dumpsys connectivity | grep -E "tether.*active|hotspot.*enabled"
```

Monitor tethering usage:
```sh
adb shell dumpsys netstats | grep -E "tether.*bytes|hotspot.*bytes"
```

Set hotspot configuration:
```sh
adb shell settings put global wifi_ap_ssid "MyHotspot"
adb shell settings put global wifi_ap_passphrase "securepass"
adb shell settings put global wifi_ap_security 2
```

Check connected devices:
```sh
adb shell dumpsys connectivity | grep -E "client.*connected|device.*tethered"
```

## Notes
- Tethering requires appropriate permissions and carrier support
- Some carriers restrict or charge extra for tethering
- Tethering settings may be controlled by device admin
- Use `dumpsys connectivity` for comprehensive tethering info
- Tethering may drain battery quickly
- Some tethering features require specific Android versions
- Use caution when enabling tethering on limited data plans
- Tethering security is important for public hotspots
