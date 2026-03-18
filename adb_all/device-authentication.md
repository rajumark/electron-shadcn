# Device Authentication - ADB Commands

## Description
ADB authentication, security, and authorization commands for secure device connections and permission management.

### Basic Commands

Check device authorization status:
```sh
adb devices
```

Revoke ADB authorizations (requires root):
```sh
adb shell rm /data/misc/adb/adb_keys
```

Check ADB key fingerprint:
```sh
adb shell getprop ro.adb.secure
```

### Advanced Commands

Generate new ADB key:
```sh
adb keygen ~/.android/adbkey_new
```

Check ADB public key on device:
```sh
adb shell cat /data/misc/adb/adb_keys
```

Push new ADB key to device (requires root):
```sh
adb push ~/.android/adbkey.pub /data/misc/adb/adb_keys
```

Check secure ADB status:
```sh
adb shell getprop ro.adb.secure
```

Enable/disable secure ADB (requires root):
```sh
adb shell setprop ro.adb.secure 1  # Enable
adb shell setprop ro.adb.secure 0  # Disable
```

Restart ADB daemon with new keys:
```sh
adb shell stop adbd && adb shell start adbd
```

Check authentication logs:
```sh
adb logcat | grep "adb"
```

List authorized keys:
```sh
adb shell ls -la /data/misc/adb/
```

Check ADB debugging permissions:
```sh
adb shell settings get global adb_enabled
```

Enable ADB debugging (requires root):
```sh
adb shell settings put global adb_enabled 1
```

Check USB debugging authorization:
```sh
adb shell dumpsys usb | grep "adb"
```

Reset USB debugging authorizations:
```sh
adb shell svc usb reset
```

### Examples

Authorization troubleshooting script:
```sh
#!/bin/bash
echo "=== ADB Authentication Check ==="

# Check if device is authorized
STATUS=$(adb devices | grep -v "List of devices" | awk '{print $2}')
echo "Device status: $STATUS"

if [ "$STATUS" = "unauthorized" ]; then
    echo "Device is unauthorized. Please check device screen."
    echo "Revoke and reauthorize if necessary."
fi

# Check secure ADB status
SECURE=$(adb shell getprop ro.adb.secure)
echo "Secure ADB: $SECURE"
```

Key management:
```sh
# Backup existing keys
cp ~/.android/adbkey ~/.android/adbkey.backup
cp ~/.android/adbkey.pub ~/.android/adbkey.pub.backup

# Generate new key pair
adb keygen ~/.android/adbkey_new

# View public key
cat ~/.android/adbkey_new.pub
```

Complete authorization reset:
```sh
#!/bin/bash
# Reset ADB authorization completely
echo "Resetting ADB authorization..."

# Kill ADB server
adb kill-server

# Remove local keys (optional)
rm -f ~/.android/adbkey*

# Remove device keys (requires root)
adb shell su -c "rm -f /data/misc/adb/adb_keys"

# Restart ADB
adb start-server

echo "Please reconnect device and authorize when prompted"
```

## Notes
- ADB keys are stored in `~/.android/` directory on computer
- Device stores authorized keys in `/data/misc/adb/adb_keys`
- Root access required to modify device-side authentication
- Android 4.2.2+ requires device authorization for USB debugging
- Some devices show "unauthorized" if USB debugging is not enabled
- Always verify RSA key fingerprint on device when authorizing
- Multiple computers can be authorized on the same device
