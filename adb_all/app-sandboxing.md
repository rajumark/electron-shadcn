# App Sandboxing - ADB Commands

## Description
Commands for managing Android app sandboxing, app isolation, and sandbox security verification.

### Basic Commands

Check app sandbox status:
```sh
adb shell dumpsys package com.example.app | grep -E "sandbox|isolated|secontext"
```

Check app UID/GID:
```sh
adb shell ps -A | grep com.example.app
```

Check app process isolation:
```sh
adb shell cat /proc/$(pidof com.example.app)/status
```

Monitor app sandbox violations:
```sh
adb shell logcat | grep -E "sandbox|violation|denied"
```

Check app permissions:
```sh
adb shell dumpsys package com.example.app | grep -E "permission|grant|revoke"
```

### Advanced Commands

App sandbox analysis:
```sh
#!/bin/bash
echo "=== App Sandbox Analysis ==="

# Check app UID/GID
app_uid=$(adb shell ps -A | grep com.example.app | awk '{print $2}')
echo "App UID: $app_uid"

# Check app SELinux context
echo "SELinux context:"
adb shell ps -Z | grep com.example.app

# Check app sandbox directory
echo "Sandbox directory:"
adb shell ls -la /data/data/com.example.app/
```

Sandbox security verification:
```sh
#!/bin/bash
echo "=== Sandbox Security Verification ==="

# Check app isolation
echo "App isolation:"
adb shell cat /proc/$(pidof com.example.app)/status | grep -E "Uid|Gid|Groups"

# Check file permissions in sandbox
echo "File permissions:"
adb shell find /data/data/com.example.app -type f -exec ls -la {} \; | head -10

# Check network isolation
echo "Network isolation:"
adb shell netstat -anp | grep com.example.app
```

Sandbox violation monitoring:
```sh
while true; do
  echo "=== Sandbox Violation Monitor $(date) ==="
  
  # Check for permission denials
  adb shell logcat -d | grep -E "Permission denied|Access denied" | tail -5
  
  # Check for sandbox breaches
  adb shell logcat -d | grep -E "sandbox|breach|violation" | tail -5
  
  # Check for SELinux denials
  adb shell logcat -d | grep -E "avc.*denied" | tail -5
  
  sleep 30
done
```

App process isolation testing:
```sh
#!/bin/bash
echo "=== App Process Isolation Testing ==="

# Test inter-process communication
echo "Testing IPC restrictions..."
adb shell am broadcast -a com.example.TEST_IPC -e data "test_data"

# Test file access restrictions
echo "Testing file access restrictions..."
adb shell run-as com.example.app ls /data/data/com.otherapp/

# Test network access restrictions
echo "Testing network access restrictions..."
adb shell run-as com.example.app ping -c 1 8.8.8.8
```

Sandbox configuration analysis:
```sh
#!/bin/bash
echo "=== Sandbox Configuration Analysis ==="

# Check app sandbox configuration
echo "Sandbox configuration:"
adb shell dumpsys package com.example.app | grep -A 10 "ApplicationInfo"

# Check app target SDK
echo "Target SDK:"
adb shell dumpsys package com.example.app | grep -E "targetSdkVersion|versionCode"

# Check app permissions
echo "App permissions:"
adb shell dumpsys package com.example.app | grep -A 20 "requested permissions"
```

Sandbox performance monitoring:
```sh
#!/bin/bash
echo "=== Sandbox Performance Monitoring ==="

# Monitor sandbox overhead
while true; do
  echo "=== Sandbox Performance $(date) ==="
  
  # Check app process CPU usage
  adb shell top -n 1 | grep com.example.app
  
  # Check sandbox memory usage
  adb shell dumpsys meminfo com.example.app | grep TOTAL
  
  # Check sandbox I/O
  adb shell iostat 1 1 | tail -3
  
  sleep 30
done
```

Sandbox security audit:
```sh
#!/bin/bash
echo "=== Sandbox Security Audit ==="

# Check app isolation strength
echo "Isolation strength:"
adb shell ps -Z | grep com.example.app

# Check file system isolation
echo "File system isolation:"
adb shell find /data/data/com.example.app -type f -perm /o+r 2>/dev/null

# Check network isolation
echo "Network isolation:"
adb shell netstat -anp | grep com.example.app | grep -E "LISTEN|ESTABLISHED"
```

Sandbox debugging:
```sh
#!/bin/bash
echo "=== Sandbox Debugging ==="

# Enable sandbox debugging
adb shell setprop log.tag.PackageManager VERBOSE
adb shell setprop log.tag.ActivityManager VERBOSE

# Monitor sandbox events
adb shell logcat | grep -E "sandbox|isolation|permission" | tail -20

# Check sandbox errors
adb shell logcat -d | grep -E "sandbox.*error|isolation.*error" | tail -10
```

Multi-app sandbox comparison:
```sh
#!/bin/bash
echo "=== Multi-App Sandbox Comparison ==="

apps=("com.example.app1" "com.example.app2" "com.example.app3")

for app in "${apps[@]}"; do
  if adb shell pm list packages | grep -q $app; then
    echo "=== $app ==="
    
    # Check UID/GID
    adb shell ps -A | grep $app | awk '{print "PID:",$1,"UID:",$2}'
    
    # Check SELinux context
    adb shell ps -Z | grep $app | awk '{print "SELinux:",$1}'
    
    # Check sandbox directory
    adb shell ls -la /data/data/$app/ | wc -l
  fi
done
```

Sandbox breach detection:
```sh
#!/bin/bash
echo "=== Sandbox Breach Detection ==="

# Check for unusual file access
echo "Unusual file access:"
adb shell find /data/data -user $(adb shell ps -A | grep com.example.app | awk '{print $2}') 2>/dev/null

# Check for unusual network connections
echo "Unusual network connections:"
adb shell netstat -anp | grep $(pidof com.example.app) | grep -E "LISTEN|:0"

# Check for privilege escalation
echo "Privilege escalation checks:"
adb shell cat /proc/$(pidof com.example.app)/status | grep -E "Uid|Gid|Groups"
```

Sandbox optimization:
```sh
#!/bin/bash
echo "=== Sandbox Optimization ==="

# Optimize app sandbox permissions
echo "Optimizing sandbox permissions..."
adb shell pm revoke com.example.app android.permission.READ_EXTERNAL_STORAGE
adb shell pm revoke com.example.app android.permission.WRITE_EXTERNAL_STORAGE

# Optimize sandbox storage
echo "Optimizing sandbox storage..."
adb shell pm trim-caches com.example.app

# Verify optimization
echo "Optimization verification:"
adb shell dumpsys package com.example.app | grep -E "permission|storage"
```

### Examples

Basic sandbox check:
```sh
adb shell dumpsys package com.example.app | grep -E "sandbox|isolated"
adb shell ps -Z | grep com.example.app
```

Sandbox security verification:
```sh
echo "App isolation:"
adb shell cat /proc/$(pidof com.example.app)/status | grep -E "Uid|Gid"

echo "File permissions:"
adb shell ls -la /data/data/com.example.app/
```

Sandbox violation monitoring:
```sh
while true; do
  echo "Sandbox violations:"
  adb shell logcat -d | grep -E "Permission denied|avc.*denied" | tail -3
  sleep 30
done
```

Complete sandbox analysis:
```sh
#!/bin/bash
echo "=== Complete Sandbox Analysis ==="

# App isolation
echo "App isolation:"
adb shell ps -Z | grep com.example.app

# Sandbox directory
echo "Sandbox directory:"
adb shell ls -la /data/data/com.example.app/

# Security context
echo "Security context:"
adb shell dumpsys package com.example.app | grep -A 5 "ApplicationInfo"

echo "Sandbox analysis completed"
```

## Notes
- App sandboxing is a core Android security feature
- Sandbox isolation varies by Android version
- Some apps may have special sandbox permissions
- Monitor sandbox violations for security issues
- Test sandbox isolation for security validation
- Sandbox performance overhead is usually minimal
- Consider compatibility when modifying sandbox settings
- Document sandbox policies and procedures
