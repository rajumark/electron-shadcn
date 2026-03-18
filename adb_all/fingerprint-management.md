# Fingerprint Management - ADB Commands

## Description
Commands for managing Android fingerprint sensors, fingerprint authentication, and biometric security operations.

### Basic Commands

Check fingerprint sensor availability:
```sh
adb shell pm list features | grep fingerprint
```

Check fingerprint permissions:
```sh
adb shell dumpsys package com.example.app | grep -E "fingerprint|USE_FINGERPRINT"
```

Grant fingerprint permission:
```sh
adb shell pm grant com.example.app android.permission.USE_FINGERPRINT
```

Check fingerprint service status:
```sh
adb shell dumpsys fingerprint
```

Check enrolled fingerprints:
```sh
adb shell dumpsys fingerprint | grep -E "enrolled|registered"
```

### Advanced Commands

Fingerprint hardware info:
```sh
adb shell getprop ro.hardware.fingerprint
adb shell dumpsys fingerprint | grep -E "sensor|hardware|version"
```

Fingerprint enrollment management:
```sh
# Check enrollment status
adb shell dumpsys fingerprint | grep -E "enroll|registration"

# Start enrollment (requires user interaction)
adb shell am start -a android.settings.FINGERPRINT_ENROLL
```

Fingerprint authentication testing:
```sh
# Test fingerprint authentication
adb shell am start -n com.example.app/.FingerprintActivity
sleep 3
# User needs to place finger on sensor
```

Fingerprint sensor calibration:
```sh
# Check sensor calibration
adb shell cat /sys/class/fingerprint/calibration
adb shell dumpsys fingerprint | grep -E "calibrate|offset"
```

Fingerprint security settings:
```sh
# Check fingerprint security
adb shell settings get secure lockscreen.biometric_weak_allowed
adb shell settings get secure fingerprint_already_enabled
```

Fingerprint performance monitoring:
```sh
# Monitor fingerprint performance
adb shell logcat | grep -E "fingerprint|biometric|FingerprintService"
```

Fingerprint debugging:
```sh
# Enable fingerprint debugging
adb shell setprop log.tag.FingerprintService VERBOSE
adb shell logcat | grep FingerprintService
```

Fingerprint error analysis:
```sh
# Check fingerprint errors
adb shell dumpsys fingerprint | grep -E "error|fail|timeout"
adb shell logcat -d | grep -E "fingerprint.*error|biometric.*fail"
```

Fingerprint template management:
```sh
# Check fingerprint templates
adb shell ls -la /data/system/users/0/fpdata/
adb shell dumpsys fingerprint | grep -E "template|id"
```

Fingerprint sensor testing:
```sh
# Test sensor responsiveness
adb shell am start -a com.example.TEST_FINGERPRINT
# Monitor sensor response
adb shell logcat | grep -E "fingerprint.*acquired|sensor.*detect"
```

Fingerprint security policy:
```sh
# Check security policies
adb shell dumpsys fingerprint | grep -E "policy|security|timeout"
adb shell settings get secure fingerprint_timeout
```

Multi-fingerprint management:
```sh
# List all enrolled fingerprints
adb shell dumpsys fingerprint | grep -E "Fingerprint.*ID|Enrolled.*finger"

# Check fingerprint count
adb shell dumpsys fingerprint | grep -c "Enrolled"
```

Firmware update check:
```sh
# Check fingerprint firmware
adb shell getprop ro.hardware.fingerprint.version
adb shell cat /sys/class/firmware/fingerprint/fw_version
```

### Examples

Check fingerprint hardware:
```sh
adb shell pm list features | grep fingerprint
adb shell dumpsys fingerprint | head -10
```

Fingerprint authentication test:
```sh
adb shell am start -n com.example.app/.LoginActivity
echo "Place finger on sensor to test authentication"
adb shell logcat | grep -E "fingerprint|biometric"
```

Fingerprint enrollment:
```sh
adb shell am start -a android.settings.FINGERPRINT_ENROLL
echo "Follow on-screen instructions to enroll fingerprint"
```

Fingerprint security check:
```sh
adb shell settings get secure lockscreen.biometric_weak_allowed
adb shell dumpsys fingerprint | grep -E "secure|policy|timeout"
```

Fingerprint performance monitoring:
```sh
adb shell logcat | grep -E "fingerprint|biometric" | tail -20
```

Complete fingerprint test:
```sh
#!/bin/bash
echo "=== Fingerprint Test Suite ==="

# Hardware check
echo "Checking fingerprint hardware..."
adb shell pm list features | grep fingerprint

# Service status
echo "Checking service status..."
adb shell dumpsys fingerprint | head -5

# Enrolled fingers
echo "Checking enrolled fingerprints..."
adb shell dumpsys fingerprint | grep -E "Enrolled|registered"

# Authentication test
echo "Testing authentication..."
adb shell am start -n com.example.app/.BiometricActivity
echo "Place finger on sensor"

# Monitor results
sleep 10
adb shell logcat -d | grep -E "fingerprint|biometric" | tail -10

echo "Fingerprint test completed"
```

## Notes
- Fingerprint operations require USE_FINGERPRINT permission
- Some commands require user interaction
- Fingerprint data is highly sensitive
- Not all devices have fingerprint sensors
- Fingerprint security varies by Android version
- Use fingerprint testing for biometric-dependent apps
- Consider privacy implications when testing
- Some operations may require root access
