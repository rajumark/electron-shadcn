# Biometric Security - ADB Commands

## Description
Commands for managing biometric security, fingerprint/face recognition, and biometric authentication systems.

### Basic Commands

Check biometric support:
```sh
adb shell pm list features | grep -E "fingerprint|face|iris|biometric"
```

Check biometric status:
```sh
adb shell dumpsys biometric
```

Check enrolled biometrics:
```sh
adb shell dumpsys biometric | grep -E "enrolled|registered"
```

Check biometric permissions:
```sh
adb shell pm list permissions | grep -E "BIOMETRIC|USE_BIOMETRIC"
```

Monitor biometric events:
```sh
adb shell logcat | grep -E "biometric|fingerprint|face"
```

### Advanced Commands

Biometric hardware analysis:
```sh
#!/bin/bash
echo "=== Biometric Hardware Analysis ==="

# Check available biometric sensors
echo "Biometric sensors:"
adb shell pm list features | grep -E "fingerprint|face|iris|biometric"

# Check biometric service status
echo "Biometric service status:"
adb shell dumpsys biometric | head -10

# Check sensor details
echo "Sensor details:"
adb shell dumpsys biometric | grep -E "sensor|hardware|version"
```

Biometric enrollment management:
```sh
#!/bin/bash
echo "=== Biometric Enrollment Management ==="

# Check enrolled fingerprints
echo "Enrolled fingerprints:"
adb shell dumpsys biometric | grep -E "fingerprint.*enrolled|Fingerprint.*ID"

# Check enrolled faces
echo "Enrolled faces:"
adb shell dumpsys biometric | grep -E "face.*enrolled|Face.*ID"

# Check enrolled irises
echo "Enrolled irises:"
adb shell dumpsys biometric | grep -E "iris.*enrolled|Iris.*ID"

# Total enrolled count
echo "Total enrolled biometrics:"
adb shell dumpsys biometric | grep -c "Enrolled"
```

Biometric authentication testing:
```sh
#!/bin/bash
echo "=== Biometric Authentication Testing ==="

# Test fingerprint authentication
echo "Testing fingerprint authentication..."
adb shell am start -n com.example.app/.FingerprintActivity
sleep 3
echo "Place finger on sensor"
adb shell logcat | grep -E "fingerprint|biometric" | tail -10

# Test face authentication
echo "Testing face authentication..."
adb shell am start -n com.example.app/.FaceActivity
sleep 3
echo "Face the camera"
adb shell logcat | grep -E "face|biometric" | tail -10
```

Biometric security settings:
```sh
#!/bin/bash
echo "=== Biometric Security Settings ==="

# Check biometric security policies
echo "Security policies:"
adb shell settings get secure biometric_enabled
adb shell settings get secure biometric_timeout
adb shell settings get secure biometric_accept_nonstrong

# Check device admin policies
echo "Device admin policies:"
adb shell dumpsys device_policy | grep -E "biometric|fingerprint|face"

# Configure biometric settings
adb shell settings put secure biometric_timeout 300  # 5 minutes
adb shell settings put secure biometric_accept_nonstrong 0
```

Biometric performance monitoring:
```sh
while true; do
  echo "=== Biometric Performance $(date) ==="
  
  # Authentication success rate
  echo "Authentication attempts:"
  adb shell dumpsys biometric | grep -E "success|failure|attempt" | tail -3
  
  # Sensor performance
  echo "Sensor performance:"
  adb shell dumpsys biometric | grep -E "performance|quality|accuracy" | tail -3
  
  sleep 30
done
```

Biometric debugging:
```sh
#!/bin/bash
echo "=== Biometric Debugging ==="

# Enable biometric debugging
adb shell setprop log.tag.BiometricService VERBOSE
adb shell setprop log.tag.FingerprintService VERBOSE
adb shell setprop log.tag.FaceService VERBOSE

# Monitor biometric events
adb shell logcat | grep -E "biometric|Biometric|fingerprint|Fingerprint|face|Face" | tail -20

# Check biometric errors
adb shell dumpsys biometric | grep -E "error|fail|timeout|lockout"
```

Biometric security audit:
```sh
#!/bin/bash
echo "=== Biometric Security Audit ==="

# Check biometric strength
echo "Biometric strength:"
adb shell dumpsys biometric | grep -E "strength|security|level"

# Check authentication history
echo "Authentication history:"
adb shell dumpsys biometric | grep -E "history|log|audit"

# Check security vulnerabilities
echo "Security checks:"
adb shell dumpsys biometric | grep -E "vulnerable|weak|compromise"

# Check lockout status
echo "Lockout status:"
adb shell dumpsys biometric | grep -E "lockout|disabled|blocked"
```

Biometric template management:
```sh
#!/bin/bash
echo "=== Biometric Template Management ==="

# Check template storage
echo "Template storage:"
adb shell ls -la /data/system/users/0/fpdata/
adb shell ls -la /data/system/users/0/facedata/
adb shell ls -la /data/system/users/0/irisdata/

# Check template security
echo "Template security:"
adb shell find /data/system/users/0/ -name "*data*" -perm /o+r

# Template backup (if supported)
echo "Template backup:"
adb shell tar -czf /sdcard/biometric_backup.tar.gz /data/system/users/0/fpdata/ /data/system/users/0/facedata/
```

Biometric error analysis:
```sh
#!/bin/bash
echo "=== Biometric Error Analysis ==="

# Check recent errors
echo "Recent biometric errors:"
adb shell logcat -d | grep -E "biometric.*error|fingerprint.*error|face.*error" | tail -10

# Check lockout events
echo "Lockout events:"
adb shell logcat -d | grep -E "lockout|disabled|blocked" | tail -5

# Check sensor errors
echo "Sensor errors:"
adb shell dumpsys biometric | grep -E "sensor.*error|hardware.*error"
```

Biometric integration testing:
```sh
#!/bin/bash
echo "=== Biometric Integration Testing ==="

# Test app biometric integration
test_apps=("com.example.bank" "com.example.payment" "com.example.security")

for app in "${test_apps[@]}"; do
  if adb shell pm list packages | grep -q $app; then
    echo "Testing biometric integration with $app:"
    adb shell am start -n $app/.MainActivity
    sleep 3
    adb shell logcat | grep -E "$app.*biometric|biometric.*$app" | tail -5
    adb shell am force-stop $app
  fi
done
```

Biometric security hardening:
```sh
#!/bin/bash
echo "=== Biometric Security Hardening ==="

# Enable strong biometric requirement
adb shell settings put secure biometric_strong_required 1

# Set short timeout
adb shell settings put secure biometric_timeout 60  # 1 minute

# Disable non-strong biometrics
adb shell settings put secure biometric_accept_nonstrong 0

# Enable device unlock with biometric
adb shell settings put secure biometric_device_unlock_enabled 1

# Verify settings
echo "Hardening settings:"
adb shell settings get secure biometric_strong_required
adb shell settings get secure biometric_timeout
```

### Examples

Basic biometric check:
```sh
adb shell pm list features | grep -E "fingerprint|face|biometric"
adb shell dumpsys biometric | head -5
```

Biometric authentication test:
```sh
adb shell am start -n com.example.app/.BiometricActivity
echo "Use biometric to authenticate"
adb shell logcat | grep -E "biometric|fingerprint|face" | tail -10
```

Biometric security audit:
```sh
echo "Biometric security audit:"
adb shell dumpsys biometric | grep -E "strength|security|lockout"
adb shell settings get secure biometric_enabled
```

Complete biometric analysis:
```sh
#!/bin/bash
echo "=== Complete Biometric Analysis ==="

# Hardware support
echo "Biometric hardware:"
adb shell pm list features | grep -E "fingerprint|face|iris|biometric"

# Enrolled biometrics
echo "Enrolled biometrics:"
adb shell dumpsys biometric | grep -E "enrolled|registered"

# Security settings
echo "Security settings:"
adb shell settings get secure biometric_enabled
adb shell settings get secure biometric_timeout

echo "Biometric analysis completed"
```

## Notes
- Biometric commands require appropriate permissions
- Some biometric features may not be available on all devices
- Biometric data is highly sensitive and protected
- Test biometric features with actual user input
- Biometric security varies by Android version
- Consider accessibility when implementing biometric features
- Monitor biometric performance and accuracy
- Document biometric security policies and procedures
