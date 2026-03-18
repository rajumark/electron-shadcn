# Face Recognition - ADB Commands

## Description
Commands for managing Android face recognition, facial authentication, and biometric face scanning operations.

### Basic Commands

Check face recognition availability:
```sh
adb shell pm list features | grep -E "face|biometric"
```

Check face recognition permissions:
```sh
adb shell dumpsys package com.example.app | grep -E "face|biometric|USE_BIOMETRIC"
```

Grant biometric permission:
```sh
adb shell pm grant com.example.app android.permission.USE_BIOMETRIC
```

Check face recognition service:
```sh
adb shell dumpsys biometric
```

Check enrolled faces:
```sh
adb shell dumpsys biometric | grep -E "face|enrolled|registered"
```

### Advanced Commands

Face recognition hardware info:
```sh
adb shell getprop ro.hardware.face
adb shell dumpsys biometric | grep -E "sensor|camera|hardware"
```

Face enrollment management:
```sh
# Check enrollment status
adb shell dumpsys biometric | grep -E "enroll|registration"

# Start face enrollment
adb shell am start -a android.settings.FACE_SETTINGS
```

Face authentication testing:
```sh
# Test face authentication
adb shell am start -n com.example.app/.FaceAuthActivity
sleep 3
# User needs to face the camera
```

Face recognition calibration:
```sh
# Check calibration status
adb shell dumpsys biometric | grep -E "calibrate|offset|accuracy"
adb shell cat /sys/class/face/calibration
```

Face recognition security:
```sh
# Check security settings
adb shell settings get secure face_unlock_enabled
adb shell settings get secure face_unlock_timeout
```

Face recognition performance:
```sh
# Monitor performance
adb shell logcat | grep -E "face|biometric|FaceService"
```

Face recognition debugging:
```sh
# Enable debugging
adb shell setprop log.tag.FaceService VERBOSE
adb shell logcat | grep FaceService
```

Face recognition error analysis:
```sh
# Check errors
adb shell dumpsys biometric | grep -E "error|fail|timeout"
adb shell logcat -d | grep -E "face.*error|biometric.*fail"
```

Face template management:
```sh
# Check face templates
adb shell ls -la /data/system/users/0/facedata/
adb shell dumpsys biometric | grep -E "template|id|face"
```

Camera integration:
```sh
# Check front camera for face recognition
adb shell dumpsys media.camera | grep -E "front|face|biometric"
adb shell am start -a android.media.action.IMAGE_CAPTURE
```

Face recognition settings:
```sh
# Check face recognition settings
adb shell settings get secure face_unlock_allowed
adb shell settings get secure face_unlock_attention_required
```

Face recognition security policy:
```sh
# Check security policies
adb shell dumpsys biometric | grep -E "policy|security|timeout"
adb shell settings get secure face_unlock_timeout
```

Multi-face management:
```sh
# Check multiple faces
adb shell dumpsys biometric | grep -E "Face.*ID|Enrolled.*face"
adb shell dumpsys biometric | grep -c "Enrolled"
```

Face recognition firmware:
```sh
# Check firmware version
adb shell getprop ro.hardware.face.version
adb shell cat /sys/class/firmware/face/fw_version
```

### Examples

Check face recognition hardware:
```sh
adb shell pm list features | grep -E "face|biometric"
adb shell dumpsys biometric | head -10
```

Face authentication test:
```sh
adb shell am start -n com.example.app/.FaceLoginActivity
echo "Face the camera for authentication"
adb shell logcat | grep -E "face|biometric"
```

Face enrollment:
```sh
adb shell am start -a android.settings.FACE_SETTINGS
echo "Follow on-screen instructions to enroll face"
```

Face recognition security:
```sh
adb shell settings get secure face_unlock_enabled
adb shell settings get secure face_unlock_attention_required
```

Face recognition performance:
```sh
adb shell logcat | grep -E "face|biometric" | tail -20
```

Complete face recognition test:
```sh
#!/bin/bash
echo "=== Face Recognition Test Suite ==="

# Hardware check
echo "Checking face recognition hardware..."
adb shell pm list features | grep -E "face|biometric"

# Service status
echo "Checking service status..."
adb shell dumpsys biometric | head -5

# Enrolled faces
echo "Checking enrolled faces..."
adb shell dumpsys biometric | grep -E "Enrolled|face"

# Authentication test
echo "Testing face authentication..."
adb shell am start -n com.example.app/.FaceActivity
echo "Face the camera for authentication"

# Monitor results
sleep 10
adb shell logcat -d | grep -E "face|biometric" | tail -10

echo "Face recognition test completed"
```

## Notes
- Face recognition requires USE_BIOMETRIC permission
- Commands require user interaction for authentication
- Face data is highly sensitive and protected
- Not all devices support face recognition
- Face recognition requires front camera
- Security varies by Android version and device
- Use face recognition testing for biometric apps
- Consider privacy and security implications
