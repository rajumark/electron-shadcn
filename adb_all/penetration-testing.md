# Penetration Testing - ADB Commands

## Description
Commands for penetration testing Android devices, security vulnerability assessment, and security testing methodologies.

### Basic Commands

Check system vulnerabilities:
```sh
adb shell getprop ro.build.version.security_patch
```

Check for root access:
```sh
adb shell su -c "id" 2>/dev/null && echo "Rooted" || echo "Not rooted"
```

Check app permissions:
```sh
adb shell pm list permissions -d com.example.app
```

Check network services:
```sh
adb shell netstat -anp | grep LISTEN
```

Check system integrity:
```sh
adb shell getprop ro.build.tags
```

### Advanced Commands

Vulnerability scanning:
```sh
#!/bin/bash
echo "=== Vulnerability Scanning ==="

# Check for known vulnerabilities
echo "Known vulnerabilities:"
adb shell getprop ro.build.version.security_patch
adb shell getprop ro.build.version.release

# Check for insecure settings
echo "Insecure settings:"
adb shell settings get secure install_non_market_apps
adb shell settings get global adb_enabled

# Check for suspicious apps
echo "Suspicious apps:"
adb shell pm list packages | grep -E "root|hack|crack|mod"
```

Port scanning and service enumeration:
```sh
#!/bin/bash
echo "=== Port Scanning and Service Enumeration ==="

# Scan open ports
echo "Open ports:"
adb shell netstat -anp | grep LISTEN

# Check running services
echo "Running services:"
adb shell service list | head -20

# Check for suspicious services
echo "Suspicious services:"
adb shell service list | grep -E "root|shell|debug"
```

Permission escalation testing:
```sh
#!/bin/bash
echo "=== Permission Escalation Testing ==="

# Test for root access
echo "Root access test:"
adb shell su -c "whoami" 2>/dev/null || echo "No root access"

# Test for shell access
echo "Shell access test:"
adb shell run-as com.example.app whoami 2>/dev/null || echo "No shell access"

# Test for privilege escalation
echo "Privilege escalation test:"
adb shell run-as com.example.app su -c "id" 2>/dev/null || echo "No privilege escalation"
```

Application security testing:
```sh
#!/bin/bash
echo "=== Application Security Testing ==="

# Test app permissions
target_app="com.example.app"
echo "Testing $target_app permissions:"
adb shell dumpsys package $target_app | grep -A 20 "requested permissions"

# Test exported components
echo "Exported components:"
adb shell dumpsys package $target_app | grep -A 5 "exported"

# Test content providers
echo "Content providers:"
adb shell dumpsys package $target_app | grep -A 5 "ContentProvider"
```

Network security testing:
```sh
#!/bin/bash
echo "=== Network Security Testing ==="

# Test SSL/TLS configuration
echo "SSL/TLS test:"
adb shell curl -v https://google.com 2>&1 | grep -E "certificate|cipher|version"

# Test cleartext traffic
echo "Cleartext traffic test:"
adb shell curl -v http://httpbin.org/get 2>&1 | grep -E "HTTP|GET"

# Test network services
echo "Network services:"
adb shell netstat -anp | grep -E "LISTEN|ESTABLISHED"
```

Data protection testing:
```sh
#!/bin/bash
echo "=== Data Protection Testing ==="

# Test encryption status
echo "Encryption test:"
adb shell getprop ro.crypto.state

# Test app data protection
echo "App data protection:"
adb shell ls -la /data/data/com.example.app/ | head -10

# Test backup protection
echo "Backup protection:"
adb shell settings get secure backup_enabled
```

Authentication bypass testing:
```sh
#!/bin/bash
echo "=== Authentication Bypass Testing ==="

# Test biometric bypass
echo "Biometric bypass test:"
adb shell am start -n com.example.app/.LoginActivity
adb shell input keyevent KEYCODE_HOME  # Try to bypass biometric

# Test password bypass
echo "Password bypass test:"
adb shell input text "admin"
adb shell input keyevent KEYCODE_ENTER

# Test session hijacking
echo "Session hijacking test:"
adb shell dumpsys activity | grep -E "session|token|auth"
```

SQL injection testing:
```sh
#!/bin/bash
echo "=== SQL Injection Testing ==="

# Test content provider injection
echo "Content provider injection test:"
adb shell content query --uri content://com.example.provider/data --where "name='admin'--'"

# Test database access
echo "Database access test:"
adb shell run-as com.example.app sqlite3 /data/data/com.example.app/databases/db.db ".tables"

# Test parameter injection
echo "Parameter injection test:"
adb shell am start -n com.example.app/.MainActivity -e param "test' OR '1'='1"
```

Cross-site scripting testing:
```sh
#!/bin/bash
echo "=== Cross-Site Scripting Testing ==="

# Test WebView XSS
echo "WebView XSS test:"
adb shell am start -n com.example.app/.WebViewActivity -e url "javascript:alert('XSS')"

# Test input validation
echo "Input validation test:"
adb shell input text "<script>alert('XSS')</script>"
adb shell input keyevent KEYCODE_ENTER
```

Buffer overflow testing:
```sh
#!/bin/bash
echo "=== Buffer Overflow Testing ==="

# Test input buffer overflow
echo "Input buffer overflow test:"
long_string=$(python3 -c "print('A' * 10000)")
adb shell input text "$long_string"

# Test file path overflow
echo "File path overflow test:"
adb shell run-as com.example.app ls /$(python3 -c "print('A' * 1000)")
```

Security configuration testing:
```sh
#!/bin/bash
echo "=== Security Configuration Testing ==="

# Test secure settings
echo "Secure settings:"
adb shell settings get secure
adb shell settings get global | grep -E "security|debug|adb"

# Test developer options
echo "Developer options:"
adb shell settings get global development_settings_enabled
adb shell settings get global adb_enabled
```

### Examples

Basic vulnerability scan:
```sh
adb shell getprop ro.build.version.security_patch
adb shell su -c "id" 2>/dev/null || echo "No root"
adb shell netstat -anp | grep LISTEN
```

Application security test:
```sh
adb shell dumpsys package com.example.app | grep -A 20 "requested permissions"
adb shell dumpsys package com.example.app | grep -A 5 "exported"
```

Network security test:
```sh
adb shell curl -v https://google.com 2>&1 | grep -E "certificate|cipher"
adb shell netstat -anp | grep LISTEN
```

Complete penetration test:
```sh
#!/bin/bash
echo "=== Complete Penetration Test ==="

# System vulnerabilities
echo "System vulnerabilities:"
adb shell getprop ro.build.version.security_patch
adb shell getprop ro.build.tags

# Root access test
echo "Root access:"
adb shell su -c "id" 2>/dev/null || echo "No root"

# Network services
echo "Network services:"
adb shell netstat -anp | grep LISTEN

# App permissions
echo "App permissions:"
adb shell pm list permissions -d com.example.app | head -10

echo "Penetration test completed"
```

## Notes
- Penetration testing requires appropriate permissions
- Some tests may affect device stability
- Test on non-production devices when possible
- Document all findings and vulnerabilities
- Consider legal implications of penetration testing
- Use systematic approach for comprehensive testing
- Some tests may require specific Android versions
- Follow responsible disclosure practices
