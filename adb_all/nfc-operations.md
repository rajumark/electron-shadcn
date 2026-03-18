# NFC Operations - ADB Commands

## Description
Commands for managing Android NFC (Near Field Communication), NFC tag operations, and NFC communication testing.

### Basic Commands

Check NFC availability:
```sh
adb shell pm list features | grep nfc
```

Check NFC status:
```sh
adb shell dumpsys nfc
```

Enable NFC:
```sh
adb shell svc nfc enable
```

Disable NFC:
```sh
adb shell svc nfc disable
```

Check NFC permissions:
```sh
adb shell dumpsys package com.example.app | grep -E "nfc|NFC"
```

### Advanced Commands

NFC hardware info:
```sh
adb shell getprop ro.hardware.nfc
adb shell dumpsys nfc | grep -E "hardware|version|chip"
```

NFC tag reading simulation:
```sh
# Simulate NFC tag detection
adb shell am broadcast -a android.nfc.action.TAG_DISCOVERED -e tag_id "12345678"
```

NFC data transfer:
```sh
# Send NFC data
adb shell am broadcast -a android.nfc.action.NDEF_DISCOVERED -e payload "Hello NFC"
```

NFC peer-to-peer:
```sh
# Test NFC P2P
adb shell am start -a android.nfc.action.NDEF_DISCOVERED
```

NFC payment simulation:
```sh
# Simulate NFC payment
adb shell am broadcast -a android.nfc.action.PAYMENT_DETECTED -e amount "10.99" -e currency "USD"
```

NFC tag writing:
```sh
# Prepare for tag writing
adb shell am start -a android.nfc.action.TAG_DISCOVERED
```

NFC adapter control:
```sh
# Check NFC adapter
adb shell dumpsys nfc | grep -E "adapter|enabled|state"

# Restart NFC adapter
adb shell svc nfc disable && sleep 2 && adb shell svc nfc enable
```

NFC debugging:
```sh
# Enable NFC debugging
adb shell setprop log.tag.NfcService VERBOSE
adb shell logcat | grep NfcService
```

NFC security settings:
```sh
# Check NFC security
adb shell settings get secure nfc_payment_default
adb shell settings get secure nfc_payment_foreground
```

NFC beam control:
```sh
# Check Android Beam
adb shell settings get secure beam_enabled
adb shell settings put secure beam_enabled 1
```

NFC tag types:
```sh
# Check supported tag types
adb shell dumpsys nfc | grep -E "tag|type|technology"
```

NFC performance monitoring:
```sh
# Monitor NFC performance
adb shell logcat | grep -E "nfc|NFC|tag"
```

NFC firmware check:
```sh
# Check NFC firmware
adb shell getprop ro.nfc.firmware.version
adb shell cat /sys/class/nfc/fw_version
```

### Examples

NFC hardware check:
```sh
adb shell pm list features | grep nfc
adb shell dumpsys nfc | head -10
```

NFC enable/disable test:
```sh
adb shell svc nfc enable
sleep 2
adb shell dumpsys nfc | grep -E "enabled|state"
adb shell svc nfc disable
```

NFC tag simulation:
```sh
adb shell am broadcast -a android.nfc.action.TAG_DISCOVERED -e tag_id "ABC123" -e payload "Test Data"
```

NFC debugging:
```sh
adb shell setprop log.tag.NfcService VERBOSE
adb shell logcat | grep NfcService | tail -20
```

NFC payment simulation:
```sh
adb shell am broadcast -a android.nfc.action.PAYMENT_DETECTED -e amount "25.50" -e currency "EUR"
```

Complete NFC test:
```sh
#!/bin/bash
echo "=== NFC Test Suite ==="

# Hardware check
echo "Checking NFC hardware..."
adb shell pm list features | grep nfc

# Service status
echo "Checking NFC service..."
adb shell dumpsys nfc | head -5

# Enable NFC
echo "Enabling NFC..."
adb shell svc nfc enable
sleep 2

# Simulate tag detection
echo "Simulating NFC tag..."
adb shell am broadcast -a android.nfc.action.TAG_DISCOVERED -e tag_id "TEST123"

# Monitor results
sleep 5
adb shell logcat -d | grep -E "nfc|NFC|tag" | tail -10

echo "NFC test completed"
```

## Notes
- NFC operations require NFC permission for apps
- Not all devices have NFC hardware
- NFC range is very short (few centimeters)
- NFC consumes minimal power when enabled
- NFC security varies by Android version
- Test NFC operations with actual tags when possible
- Some NFC features may be carrier-restricted
- Consider privacy implications for NFC operations
