# Connection Troubleshooting - ADB Commands

## Description
Commands for diagnosing and resolving ADB connection issues, device detection problems, and communication errors.

### Basic Commands

Restart ADB server:
```sh
adb kill-server && adb start-server
```

Check ADB server status:
```sh
adb version
```

List devices with detailed info:
```sh
adb devices -l
```

Check device state:
```sh
adb get-state
```

### Advanced Commands

Check ADB server process:
```sh
ps aux | grep adb
```

Check if ADB port is in use:
```sh
netstat -an | grep 5037
```

Kill ADB processes forcefully:
```sh
pkill -f adb
```

Check USB device permissions (Linux):
```sh
ls -l /dev/bus/usb/*/
```

Check device authorization status:
```sh
adb shell dumpsys adb
```

Reset USB connection:
```sh
adb shell svc usb reset
```

Check device connectivity:
```sh
adb shell echo "Device is connected"
```

Test network connectivity to device:
```sh
ping <device_ip>
```

Check firewall status for ADB port:
```sh
sudo ufw status
```

Restart device ADB daemon:
```sh
adb shell stop adbd && adb shell start adbd
```

Check device logs for ADB errors:
```sh
adb logcat | grep adb
```

Verify device driver installation (Windows):
```sh
pnputil /enum-devices /class Android
```

### Examples

Complete ADB reset procedure:
```sh
#!/bin/bash
echo "=== ADB Troubleshooting ==="

# Step 1: Kill all ADB processes
pkill -f adb
echo "Killed ADB processes"

# Step 2: Remove ADB socket
rm -f ~/.android/adbkey*
echo "Cleaned ADB keys"

# Step 3: Restart ADB server
adb start-server
echo "Restarted ADB server"

# Step 4: Check devices
adb devices -l
echo "Device list updated"
```

Device authorization check:
```sh
adb devices
# If device shows as "unauthorized":
# 1. Check device screen for authorization prompt
# 2. Revoke USB debugging authorization on device
# 3. Reconnect USB cable
# 4. Authorize when prompted
```

Network debugging:
```sh
# Test connectivity to wireless device
adb connect 192.168.1.100:5555
adb shell echo "Connection successful"
```

## Notes
- Always restart ADB server after connection issues
- Check USB cable and port if device not detected
- Ensure USB debugging is enabled on device
- Some devices require specific drivers (especially on Windows)
- Firewall may block ADB connections on port 5037
- Unauthorized devices need manual approval on device screen
- Restart both computer and device if issues persist
