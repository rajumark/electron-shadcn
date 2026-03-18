# Security Auditing - ADB Commands

## Description
Commands for security analysis, vulnerability assessment, and security configuration review.

### Basic Commands
Check device encryption:
```sh
adb shell getprop ro.crypto.state
```

Check SELinux status:
```sh
adb shell getenforce
```

Check app permissions:
```sh
adb shell dumpsys package | grep permission
```

Check device admin:
```sh
adb shell dpm list-active-admins
```

### Advanced Commands
Security audit script:
```sh
echo "=== Security Audit ==="
echo "Encryption: $(adb shell getprop ro.crypto.state)"
echo "SELinux: $(adb shell getenforce)"
echo "Patch Level: $(adb shell getprop ro.build.version.security_patch)"
echo "Verified Boot: $(adb shell getprop ro.boot.verifiedbootstate)"
```

App permission analysis:
```sh
for app in $(adb shell pm list packages | cut -d: -f2); do
  echo "=== $app ==="
  adb shell dumpsys package $app | grep -E "dangerous|permission"
done
```

Network security check:
```sh
adb shell dumpsys connectivity | grep -E "vpn|proxy|dns"
```

File system permissions:
```sh
adb shell find /system -type f -perm /o+w
```

Process security:
```sh
adb shell ps -Z | grep -E "untrusted|isolated"
```

Security log monitoring:
```sh
adb logcat -b security | tail -20
```

Certificate analysis:
```sh
adb shell getprop | grep -E "cert|key|ssl"
```

Firewall rules:
```sh
adb shell iptables -L
```

## Notes
- Security auditing may require root access
- Some security features vary by Android version
- Document security findings for remediation
- Use caution when modifying security settings
