# Bluetooth - ADB Commands

## Description
Commands for managing Bluetooth connections, configuring Bluetooth settings, and Bluetooth device operations.

### Basic Commands

Enable Bluetooth:
```sh
adb shell settings put global bluetooth_on 1
```

Disable Bluetooth:
```sh
adb shell settings put global bluetooth_on 0
```

Check Bluetooth status:
```sh
adb shell settings get global bluetooth_on
```

List paired devices:
```sh
adb shell dumpsys bluetooth_manager | grep -A 10 "Paired devices"
```

Get Bluetooth adapter info:
```sh
adb shell dumpsys bluetooth_manager | grep -E "Adapter|State"
```

### Advanced Commands

Start Bluetooth discovery:
```sh
adb shell service call bluetooth_manager 6
```

Stop Bluetooth discovery:
```sh
adb shell service call bluetooth_manager 7
```

Connect to Bluetooth device:
```sh
adb shell service call bluetooth_manager 8 i32 0 s16 "device_address"
```

Disconnect Bluetooth device:
```sh
adb shell service call bluetooth_manager 9 i32 0 s16 "device_address"
```

Check Bluetooth profiles:
```sh
adb shell dumpsys bluetooth_manager | grep -E "Profile|Service"
```

Monitor Bluetooth events:
```sh
adb shell logcat | grep -E "Bluetooth|bluetooth"
```

Get device name:
```sh
adb shell settings get secure bluetooth_name
```

Set device name:
```sh
adb shell settings put secure bluetooth_name "My Device"
```

Check Bluetooth version:
```sh
adb shell getprop ro.bluetooth.version
```

List available services:
```sh
adb shell dumpsys bluetooth_manager | grep -E "Service.*registered"
```

Check Bluetooth codecs:
```sh
adb shell settings get global bluetooth_a2dp_codec_config
```

Enable/disable visibility:
```sh
adb shell service call bluetooth_manager 10 i32 1
```

Check battery level of connected device:
```sh
adb shell dumpsys bluetooth_manager | grep -E "battery|charge"
```

### Examples

Enable Bluetooth and check status:
```sh
adb shell settings put global bluetooth_on 1
adb shell settings get global bluetooth_on
```

List paired Bluetooth devices:
```sh
adb shell dumpsys bluetooth_manager | grep -A 10 "Paired devices"
```

Connect to specific device:
```sh
adb shell service call bluetooth_manager 8 i32 0 s16 "AA:BB:CC:DD:EE:FF"
```

Monitor Bluetooth connections:
```sh
adb shell logcat | grep -E "Bluetooth.*connect|bluetooth.*state"
```

Check Bluetooth profiles:
```sh
adb shell dumpsys bluetooth_manager | grep -E "A2DP|HFP|HID"
```

Set device name:
```sh
adb shell settings put secure bluetooth_name "Android Device"
```

Check Bluetooth audio status:
```sh
adb shell dumpsys bluetooth_manager | grep -E "audio|A2DP"
```

## Notes
- Bluetooth operations require appropriate permissions
- Some commands may not work on all Android versions
- Device addresses must be in format "AA:BB:CC:DD:EE:FF"
- Bluetooth settings may be controlled by device admin
- Use `dumpsys bluetooth_manager` for comprehensive info
- Some Bluetooth features require specific hardware
- Bluetooth discovery may be time-limited
- Use caution when modifying Bluetooth settings
