# Iris Scanner - ADB Commands

## Description
Commands for managing Android iris scanners, biometric iris recognition, and iris scanning operations.

### Basic Commands

Check iris scanner availability:
```sh
adb shell pm list features | grep -E "iris|biometric"
```

Check iris scanner permissions:
```sh
adb shell dumpsys package com.example.app | grep -E "iris|biometric|USE_BIOMETRIC"
```

Grant biometric permission:
```sh
adb shell pm grant com.example.app android.permission.USE_BIOMETRIC
```

Check iris scanner service:
```sh
adb shell dumpsys biometric | grep -E "iris|IrisService"
```

Check enrolled irises:
```sh
adb shell dumpsys biometric | grep -E "iris|enrolled|registered"
```

### Advanced Commands

Iris scanner hardware info:
```sh
adb shell getprop ro.hardware.iris
adb shell dumpsys biometric | grep -E "iris|camera|sensor|hardware"
```

Iris enrollment management:
```sh
# Check enrollment status
adb shell dumpsys biometric | grep -E "iris.*enroll|registration"

# Start iris enrollment
adb shell am start -a android.settings.IRIS_SETTINGS
```

Iris authentication testing:
```sh
# Test iris authentication
adb shell am start -n com.example.app/.IrisAuthActivity
sleep 3
# User needs to look at iris scanner
```

Iris scanner calibration:
```sh
# Check calibration status
adb shell dumpsys biometric | grep -E "iris.*calibrate|offset|accuracy"
adb shell cat /sys/class/iris/calibration
```

Iris recognition security:
```sh
# Check security settings
adb shell settings get secure iris_unlock_enabled
adb shell settings get secure iris_unlock_timeout
```

Iris scanner performance:
```sh
# Monitor performance
adb shell logcat | grep -E "iris|biometric|IrisService"
```

Iris scanner debugging:
```sh
# Enable debugging
adb shell setprop log.tag.IrisService VERBOSE
adb shell logcat | grep IrisService
```

Iris scanner error analysis:
```sh
# Check errors
adb shell dumpsys biometric | grep -E "iris.*error|fail|timeout"
adb shell logcat -d | grep -E "iris.*error|biometric.*fail"
```

Iris template management:
```sh
# Check iris templates
adb shell ls -la /data/system/users/0/irisdata/
adb shell dumpsys biometric | grep -E "iris.*template|id"
```

Camera integration for iris:
```sh
# Check front camera for iris scanning
adb shell dumpsys media.camera | grep -E "front|iris|biometric"
```

Iris scanner settings:
```sh
# Check iris recognition settings
adb shell settings get secure iris_unlock_allowed
adb shell settings get secure iris_unlock_attention_required
```

Iris scanner security policy:
```sh
# Check security policies
adb shell dumpsys biometric | grep -E "iris.*policy|security|timeout"
adb shell settings get secure iris_unlock_timeout
```

Multi-iris management:
```sh
# Check multiple irises
adb shell dumpsys biometric | grep -E "Iris.*ID|Enrolled.*iris"
adb shell dumpsys biometric | grep -c "Enrolled.*iris"
```

Iris scanner firmware:
```sh
# Check firmware version
adb shell getprop ro.hardware.iris.version
adb shell cat /sys/class/firmware/iris/fw_version
```

### Examples

Check iris scanner hardware:
```sh
adb shell pm list features | grep -E "iris|biometric"
adb shell dumpsys biometric | grep -E "iris|hardware"
```

Iris authentication test:
```sh
adb shell am start -n com.example.app/.IrisLoginActivity
echo "Look at the iris scanner for authentication"
adb shell logcat | grep -E "iris|biometric"
```

Iris enrollment:
```sh
adb shell am start -a android.settings.IRIS_SETTINGS
echo "Follow on-screen instructions to enroll iris"
```

Iris scanner security:
```sh
adb shell settings get secure iris_unlock_enabled
adb shell settings get secure iris_unlock_attention_required
```

Iris scanner performance:
```sh
adb shell logcat | grep -E "iris|biometric" | tail -20
```

Complete iris scanner test:
```sh
#!/bin/bash
echo "=== Iris Scanner Test Suite ==="

# Hardware check
echo "Checking iris scanner hardware..."
adb shell pm list features | grep -E "iris|biometric"

# Service status
echo "Checking iris service..."
adb shell dumpsys biometric | grep -E "iris|IrisService" | head -5

# Enrolled irises
echo "Checking enrolled irises..."
adb shell dumpsys biometric | grep -E "Enrolled.*iris"

# Authentication test
echo "Testing iris authentication..."
adb shell am start -n com.example.app/.IrisActivity
echo "Look at the iris scanner"

# Monitor results
sleep 10
adb shell logcat -d | grep -E "iris|biometric" | tail -10

echo "Iris scanner test completed"
```

## Notes
- Iris scanning requires USE_BIOMETRIC permission
- Commands require user interaction for authentication
- Iris data is highly sensitive and protected
- Very few devices support iris scanning
- Iris recognition requires specialized hardware
- Security varies by Android version and device
- Use iris scanning testing for biometric apps
- Consider privacy and security implications
- Iris scanning may be affected by lighting conditions
