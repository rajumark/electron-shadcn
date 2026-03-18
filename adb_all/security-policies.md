# Security Policies - ADB Commands

## Description
Commands for managing security policies, checking security settings, and security configuration on Android devices.

### Basic Commands

Check security patch level:
```sh
adb shell getprop ro.build.version.security_patch
```

Check device security status:
```sh
adb shell getprop ro.build.tags
```

Check verified boot status:
```sh
adb shell getprop ro.boot.verifiedbootstate
```

Check device encryption:
```sh
adb shell getprop ro.crypto.state
```

Check security providers:
```sh
adb shell getprop ro.security.patch
```

### Advanced Commands

Check SELinux status:
```sh
adb shell getenforce
```

Check app security permissions:
```sh
adb shell dumpsys package | grep -E "permission|security"
```

Check network security config:
```sh
adb shell dumpsys connectivity | grep -E "security|policy"
```

Check keymaster version:
```sh
adb shell getprop ro.hardware.keymaster
```

Check security log:
```sh
adb shell logcat -b security
```

Check TrustZone status:
```sh
adb shell getprop ro.hardware.trustzone
```

Check secure boot:
```sh
adb shell getprop ro.boot.secureboot
```

Check security policies:
```sh
adb shell dumpsys device_policy | grep -E "security|policy"
```

Check app signing:
```sh
adb shell dumpsys package com.example.app | grep -E "signatures|certificates"
```

Check security updates:
```sh
adb shell getprop | grep -E "security|patch|update"
```

Check firewall rules:
```sh
adb shell iptables -L
```

Check security providers:
```sh
adb shell getprop ro.hardware.security
```

### Examples

Check device security status:
```sh
adb shell getprop ro.build.version.security_patch
adb shell getprop ro.boot.verifiedbootstate
```

Verify device encryption:
```sh
adb shell getprop ro.crypto.state
adb shell getprop ro.crypto.type
```

Check SELinux enforcement:
```sh
adb shell getenforce
adb shell getprop ro.boot.selinux
```

Monitor security events:
```sh
adb shell logcat -b security | tail -20
```

Check app security permissions:
```sh
adb shell dumpsys package com.example.app | grep -E "permission|dangerous"
```

Verify secure boot:
```sh
adb shell getprop ro.boot.secureboot
adb shell getprop ro.boot.verifiedbootstate
```

Check security patch level:
```sh
adb shell getprop ro.build.version.security_patch
```

## Notes
- Security policies may be enforced by device admin
- Some security settings cannot be modified via ADB
- Security status varies by device manufacturer
- Use `logcat -b security` for security-specific logs
- Security patch level indicates last update
- Verified boot status affects device integrity
- Some security features require specific Android versions
- Security policies may affect app functionality
