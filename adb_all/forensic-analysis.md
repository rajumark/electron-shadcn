# Forensic Analysis - ADB Commands

## Description
Commands for forensic analysis, data recovery, and security investigation on Android devices.

### Basic Commands

Check device info:
```sh
adb shell getprop
```

List all files:
```sh
adb shell find / -type f 2>/dev/null
```

Check installed apps:
```sh
adb shell pm list packages -f
```

Check network history:
```sh
adb shell dumpsys connectivity | grep -E "network|history"
```

Check call logs:
```sh
adb shell content query --uri content://call_log/calls
```

### Advanced Commands

Device fingerprinting:
```sh
#!/bin/bash
echo "=== Device Fingerprinting ==="

# Collect device identifiers
echo "Device identifiers:"
adb shell getprop ro.product.model
adb shell getprop ro.product.manufacturer
adb shell getprop ro.build.version.release
adb shell getprop ro.build.version.security_patch
adb shell getprop ro.serialno

# Collect hardware identifiers
echo "Hardware identifiers:"
adb shell getprop ro.hardware
adb shell getprop ro.board
adb shell getprop ro.bootloader
adb shell getprop ro.baseband

# Collect unique identifiers
echo "Unique identifiers:"
adb shell getprop ro.product.device
adb shell getprop ro.product.name
adb shell getprop ro.build.fingerprint

# Generate device hash
echo "Device hash:"
adb shell getprop | md5sum
```

Data recovery analysis:
```sh
#!/bin/bash
echo "=== Data Recovery Analysis ==="

# Check for deleted files
echo "Deleted file analysis:"
adb shell find /data -name "*~" -o -name "*.tmp" -o -name "*.bak" 2>/dev/null

# Check application data
echo "Application data recovery:"
for app in $(adb shell pm list packages | cut -d: -f2 | head -10); do
  echo "=== $app ==="
  adb shell ls -la /data/data/$app/ 2>/dev/null | head -5
done

# Check cache data
echo "Cache data recovery:"
adb shell find /data/data -name "cache" -type d | head -10

# Check shared preferences
echo "Shared preferences recovery:"
adb shell find /data/data -name "*.xml" -path "*/shared_prefs/*" | head -10
```

Network forensics:
```sh
#!/bin/bash
echo "=== Network Forensics ==="

# Check network history
echo "Network history:"
adb shell dumpsys connectivity | grep -E "network|history|wifi|mobile"

# Check DNS cache
echo "DNS cache:"
adb shell cat /system/etc/hosts
adb shell getprop | grep dns

# Check network configurations
echo "Network configurations:"
adb shell cat /data/misc/wifi/wpa_supplicant.conf 2>/dev/null
adb shell cat /data/misc/wifi/wpa_supplicant.conf 2>/dev/null | grep -E "ssid|psk"

# Check network statistics
echo "Network statistics:"
adb shell cat /proc/net/dev
adb shell cat /proc/net/netstat
```

Application forensics:
```sh
#!/bin/bash
echo "=== Application Forensics ==="

# Analyze installed applications
echo "Installed application analysis:"
for app in $(adb shell pm list packages | cut -d: -f2); do
  echo "=== $app ==="
  
  # App metadata
  adb shell dumpsys package $app | grep -E "versionCode|versionName|installTime"
  
  # App permissions
  adb shell dumpsys package $app | grep -A 20 "requested permissions"
  
  # App data directories
  adb shell ls -la /data/data/$app/ 2>/dev/null | head -5
done

# Check for suspicious applications
echo "Suspicious application check:"
adb shell pm list packages | grep -E "root|hack|crack|mod"
```

Timeline analysis:
```sh
#!/bin/bash
echo "=== Timeline Analysis ==="

# Check system boot timeline
echo "System boot timeline:"
adb shell dmesg | grep -E "kernel|init|boot" | head -20

# Check application launch timeline
echo "Application launch timeline:"
adb shell logcat -d | grep -E "am.*start|ActivityManager" | head -20

# Check network connection timeline
echo "Network connection timeline:"
adb shell logcat -d | grep -E "connectivity|wifi|mobile" | head -20

# Check system event timeline
echo "System event timeline:"
adb shell logcat -d | grep -E "system|event|error" | head -20
```

Memory forensics:
```sh
#!/bin/bash
echo "=== Memory Forensics ==="

# Check memory dumps
echo "Memory dump analysis:"
adb shell find /data -name "*.dmp" -o -name "*.core" 2>/dev/null

# Check process memory
echo "Process memory analysis:"
for pid in $(adb shell ps -A | awk '{print $2}' | head -10); do
  echo "=== PID $pid ==="
  adb shell cat /proc/$pid/status | grep -E "Name|VmSize|VmRSS"
  adb shell cat /proc/$pid/maps | head -5
done

# Check shared memory
echo "Shared memory analysis:"
adb shell cat /proc/sysvipc/shm | head -10
```

Storage forensics:
```sh
#!/bin/bash
echo "=== Storage Forensics ==="

# Check file system metadata
echo "File system metadata:"
adb shell stat /data
adb shell stat /sdcard

# Check file access times
echo "File access time analysis:"
adb shell find /data/data -type f -exec stat {} \; 2>/dev/null | head -10

# Check hidden files
echo "Hidden file analysis:"
adb shell find /data -name ".*" -type f 2>/dev/null | head -10

# Check recently modified files
echo "Recently modified files:"
adb shell find /data -type f -mtime -7 2>/dev/null | head -10
```

Security forensics:
```sh
#!/bin/bash
echo "=== Security Forensics ==="

# Check security events
echo "Security event analysis:"
adb shell logcat -d | grep -E "security|selinux|avc" | head -20

# Check permission usage
echo "Permission usage analysis:"
adb shell logcat -d | grep -E "permission|grant|revoke" | head -20

# Check authentication events
echo "Authentication event analysis:"
adb shell logcat -d | grep -E "auth|login|biometric" | head -20

# Check system integrity
echo "System integrity check:"
adb shell getprop ro.build.tags
adb shell cat /proc/mounts | grep -E "ro|rw"
```

Communication forensics:
```sh
#!/bin/bash
echo "=== Communication Forensics ==="

# Check call logs
echo "Call log analysis:"
adb shell content query --uri content://call_log/calls | head -10

# Check SMS logs
echo "SMS log analysis:"
adb shell content query --uri content://sms | head -10

# Check contacts
echo "Contact analysis:"
adb shell content query --uri content://contacts/people | head -10

# Check browser history
echo "Browser history analysis:"
adb shell content query --uri content://browser/bookmarks | head -10
```

Malware forensics:
```sh
#!/bin/bash
echo "=== Malware Forensics ==="

# Check for malware signatures
echo "Malware signature check:"
adb shell find /data/app -name "*.apk" -exec grep -l "malicious" {} \; 2>/dev/null

# Check for suspicious processes
echo "Suspicious process check:"
adb shell ps -A | grep -E "root|su|sh"

# Check for suspicious network connections
echo "Suspicious network connection check:"
adb shell netstat -anp | grep -E ":4444|:5555|:6666"

# Check for suspicious files
echo "Suspicious file check:"
adb shell find /data -name "*root*" -o -name "*hack*" 2>/dev/null
```

### Examples

Basic forensic analysis:
```sh
adb shell getprop | head -20
adb shell pm list packages -f | head -10
adb shell ps -A | head -10
```

Device fingerprinting:
```sh
adb shell getprop ro.product.model
adb shell getprop ro.product.manufacturer
adb shell getprop ro.build.version.release
adb shell getprop ro.serialno
```

Application forensics:
```sh
for app in $(adb shell pm list packages | cut -d: -f2 | head -5); do
  echo "=== $app ==="
  adb shell dumpsys package $app | grep -E "versionCode|versionName"
  adb shell ls -la /data/data/$app/ 2>/dev/null | head -3
done
```

Complete forensic analysis:
```sh
#!/bin/bash
echo "=== Complete Forensic Analysis ==="

# Device info
echo "Device information:"
adb shell getprop | head -15

# System status
echo "System status:"
adb shell ps -A | head -10
adb shell cat /proc/loadavg

# Network status
echo "Network status:"
adb shell netstat -anp | head -10

# Storage status
echo "Storage status:"
adb shell df -h | head -5

echo "Forensic analysis completed"
```

## Notes
- Forensic analysis requires root access for most operations
- Forensic analysis can affect device performance
- Some forensic features depend on Android version
- Use forensic analysis only for legitimate investigations
- Document all forensic findings carefully
- Follow legal requirements for forensic analysis
- Consider chain of custody for forensic evidence
- Use forensic tools responsibly and ethically
