# Mobile Data - ADB Commands

## Description
Commands for managing cellular data connections, mobile network settings, and data usage monitoring on Android devices.

### Basic Commands

Enable mobile data:
```sh
adb shell svc data enable
```

Disable mobile data:
```sh
adb shell svc data disable
```

Check mobile data status:
```sh
adb shell settings get global mobile_data
```

Check network type:
```sh
adb shell dumpsys telephony.registry | grep networkType
```

Get signal strength:
```sh
adb shell dumpsys telephony.registry | grep signalStrength
```

### Advanced Commands

Check data connection state:
```sh
adb shell dumpsys connectivity | grep -E "mobile|cellular"
```

Monitor data usage:
```sh
adb shell dumpsys netstats | grep -E "mobile|cellular"
```

Check APN settings:
```sh
adb shell content query --uri content://telephony/carriers
```

Set preferred network type:
```sh
adb shell service call phone 29 i32 10
```

Check roaming status:
```sh
adb shell dumpsys telephony.registry | grep serviceState
```

Monitor network changes:
```sh
adb shell logcat | grep -E "mobile.*data|cellular.*connect"
```

Check data connection details:
```sh
adb shell dumpsys connectivity | grep -A 10 "NetworkAgentInfo"
```

Get SIM card info:
```sh
adb shell dumpsys telephony.registry | grep -E "sim|operator"
```

Check data speed:
```sh
adb shell dumpsys connectivity | grep -E "link.*speed|bitrate"
```

Set data roaming:
```sh
adb shell settings put global data_roaming 1
```

Check network operator:
```sh
adb shell getprop gsm.operator.alpha
```

Monitor data connectivity:
```sh
adb shell watch -n 2 "dumpsys connectivity | grep mobile"
```

### Examples

Enable mobile data and check status:
```sh
adb shell svc data enable
adb shell settings get global mobile_data
```

Check current network type and signal:
```sh
adb shell dumpsys telephony.registry | grep -E "networkType|signalStrength"
```

Monitor data usage:
```sh
adb shell dumpsys netstats | grep -E "mobile|uid" | head -10
```

Check if roaming:
```sh
adb shell dumpsys telephony.registry | grep serviceState
```

Set 4G/LTE preferred:
```sh
adb shell service call phone 29 i32 10
```

Get SIM operator info:
```sh
adb shell getprop gsm.operator.alpha
adb shell getprop gsm.operator.numeric
```

Monitor data connection changes:
```sh
adb shell logcat | grep -E "mobile.*data|network.*state"
```

## Notes
- Mobile data control requires appropriate permissions
- Some commands may not work on all carriers
- Network type codes vary by Android version
- Data roaming may incur additional charges
- Use `dumpsys telephony.registry` for cellular info
- Some settings may be controlled by carrier policies
- Mobile data settings may be overridden by device admin
- Use caution when modifying mobile data settings
