# Security Testing - ADB Commands

## Description
Commands for security testing Android applications, vulnerability assessment, and security validation.

### Basic Commands

Check app permissions:
```sh
adb shell dumpsys package com.example.app | grep -E "permission|dangerous"
```

Check device encryption:
```sh
adb shell getprop ro.crypto.state
```

Check SELinux status:
```sh
adb shell getenforce
```

Check root access:
```sh
adb shell su -c "id" 2>/dev/null && echo "Rooted" || echo "Not rooted"
```

Check app signing:
```sh
adb shell dumpsys package com.example.app | grep -A 20 "PackageSignatures"
```

### Advanced Commands

Security vulnerability scan:
```sh
adb shell pm list packages | grep -E "root|super|su" | xargs -I {} adb shell dumpsys package {}
```

Check network security:
```sh
adb shell dumpsys connectivity | grep -E "vpn|proxy|dns"
```

Test data storage security:
```sh
adb shell find /data/data/com.example.app -type f -exec ls -la {} \;
```

Check SSL/TLS implementation:
```sh
adb shell getprop | grep -E "ssl|tls|cert"
```

Test authentication bypass:
```sh
adb shell am start -n com.example.app/.LoginActivity
adb shell input text "admin"
adb shell input keyevent KEYCODE_ENTER
```

Check for hardcoded secrets:
```sh
adb shell grep -r -i "password\|key\|secret" /data/data/com.example.app/
```

Test SQL injection:
```sh
adb shell content query --uri content://com.example.app.provider/data --where "name='admin'--'"
```

Check intent spoofing:
```sh
adb shell am broadcast -a com.example.SECURE_ACTION -e data "malicious_data"
```

Test file permission vulnerabilities:
```sh
adb shell find /data/data/com.example.app -perm /o+w
```

Check for debug enabled:
```sh
adb shell getprop ro.debuggable
adb shell dumpsys package com.example.app | grep -E "debuggable|debug"
```

Test certificate pinning:
```sh
adb shell am start -n com.example.app/.MainActivity
adb shell logcat | grep -E "certificate|SSL|TLS"
```

Check for insecure data storage:
```sh
adb shell find /sdcard -name "*example*" -type f
```

Test activity export vulnerability:
```sh
adb shell dumpsys package com.example.app | grep -A 5 "Activity Resolver Table"
```

### Examples

Basic security assessment:
```sh
echo "=== Security Assessment ==="
echo "Root Status: $(adb shell su -c "id" 2>/dev/null && echo "Rooted" || echo "Not rooted")"
echo "Encryption: $(adb shell getprop ro.crypto.state)"
echo "SELinux: $(adb shell getenforce)"
echo "Debuggable: $(adb shell getprop ro.debuggable)"
```

App permission analysis:
```sh
adb shell dumpsys package com.example.app | grep -A 20 "requested permissions"
adb shell dumpsys package com.example.app | grep -E "dangerous|permission"
```

File security check:
```sh
adb shell find /data/data/com.example.app -type f -exec ls -la {} \;
adb shell find /data/data/com.example.app -perm /o+w
```

Network security test:
```sh
adb shell dumpsys connectivity | grep -E "vpn|proxy|dns"
adb shell getprop | grep -E "ssl|tls|cert"
```

Authentication security test:
```sh
adb shell am start -n com.example.app/.LoginActivity
adb shell input text "admin' OR '1'='1"
adb shell input keyevent KEYCODE_ENTER
```

## Notes
- Security testing may require root access
- Some tests may affect app functionality
- Document all security findings
- Test on non-production environments first
- Security testing should be comprehensive
- Consider legal implications of security testing
- Use proper security testing methodologies
- Some security features vary by Android version
