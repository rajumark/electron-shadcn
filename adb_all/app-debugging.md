# App Debugging - ADB Commands

## Description
Commands specifically for debugging Android applications, including crash analysis, performance monitoring, and development tools.

### Basic Commands

Enable debug mode for app:
```sh
adb shell pm set-debug-app com.example.app
```

Clear debug app setting:
```sh
adb shell pm clear-debug-app
```

Attach debugger to app:
```sh
adb shell am start -D -n com.example.app/.MainActivity
```

View app crash logs:
```sh
adb logcat | grep "AndroidRuntime"
```

### Advanced Commands

Enable wait for debugger:
```sh
adb shell am set-debug-app -w com.example.app
```

Enable app profiling:
```sh
adb shell am profile start com.example.app
```

Stop app profiling:
```sh
adb shell am profile stop com.example.app
```

Generate bug report:
```sh
adb bugreport bugreport.zip
```

Enable strict mode:
```sh
adb shell setprop debug.strictmode 1
```

Disable strict mode:
```sh
adb shell setprop debug.strictmode 0
```

Enable GPU profiling:
```sh
adb shell setprop debug.hwui.profile true
```

Enable layout bounds:
```sh
adb shell setprop debug.layout true
```

Show overdraw areas:
```sh
adb shell setprop debug.hwui.overdraw show
```

Enable app debugging flags:
```sh
adb shell setprop log.tag.$PACKAGE VERBOSE
```

Get app memory info:
```sh
adb shell dumpsys meminfo com.example.app
```

Get app CPU info:
```sh
adb shell dumpsys cpuinfo | grep com.example.app
```

Monitor app ANR (Application Not Responding):
```sh
adb shell cat /data/anr/traces.txt
```

### Examples

Debug setup script:
```sh
#!/bin/bash
PACKAGE="com.example.app"

echo "=== Debug Setup for $PACKAGE ==="

# Enable debug mode
echo "Enabling debug mode..."
adb shell pm set-debug-app "$PACKAGE"

# Enable wait for debugger
echo "Enabling wait for debugger..."
adb shell am set-debug-app -w "$PACKAGE"

# Enable verbose logging
echo "Enabling verbose logging..."
adb shell setprop log.tag."$PACKAGE" VERBOSE

echo "Debug setup completed. App will wait for debugger on next start."
```

Crash analysis script:
```sh
#!/bin/bash
PACKAGE="com.example.app"

echo "=== Crash Analysis for $PACKAGE ==="

# Clear logcat
adb logcat -c

# Start app
echo "Starting app to reproduce crash..."
adb shell am start -n "$PACKAGE/.MainActivity"

# Monitor for crashes
echo "Monitoring for crashes (30 seconds)..."
timeout 30 adb logcat | grep -E "FATAL|AndroidRuntime|$PACKAGE" &
LOGCAT_PID=$!

wait $LOGCAT_PID

# Analyze crash logs
echo -e "\nCrash analysis:"
adb logcat -d | grep -A 10 "FATAL EXCEPTION"
```

Performance monitoring script:
```sh
#!/bin/bash
PACKAGE="com.example.app"

echo "=== Performance Monitoring for $PACKAGE ==="

# Start profiling
echo "Starting CPU profiling..."
adb shell am profile start "$PACKAGE"

# Monitor for 30 seconds
echo "Monitoring performance for 30 seconds..."
for i in {1..6}; do
    echo "Check $i/6:"
    echo "Memory: $(adb shell dumpsys meminfo "$PACKAGE" | grep TOTAL | head -1)"
    echo "CPU: $(adb shell top -n 1 | grep "$PACKAGE")"
    sleep 5
done

# Stop profiling
echo "Stopping profiling..."
adb shell am profile stop "$PACKAGE"

echo "Performance monitoring completed"
```

Bug report generation:
```sh
#!/bin/bash
PACKAGE="com.example.app"
REPORT_DIR="bug_reports"
DATE=$(date +%Y%m%d_%H%M%S)

echo "=== Bug Report Generation ==="
mkdir -p "$REPORT_DIR"

# Generate full bug report
echo "Generating full bug report..."
adb bugreport "$REPORT_DIR/bugreport_$DATE.zip"

# Generate app-specific report
echo "Generating app-specific information..."

# App info
adb shell dumpsys package "$PACKAGE" > "$REPORT_DIR/package_info_$DATE.txt"

# Memory info
adb shell dumpsys meminfo "$PACKAGE" > "$REPORT_DIR/memory_info_$DATE.txt"

# Activity info
adb shell dumpsys activity activities | grep "$PACKAGE" > "$REPORT_DIR/activity_info_$DATE.txt"

# Recent logs
adb logcat -d -t 1000 | grep "$PACKAGE" > "$REPORT_DIR/app_logs_$DATE.txt"

echo "Bug report generated in $REPORT_DIR"
```

Debug flags management:
```sh
#!/bin/bash
PACKAGE="com.example.app"

echo "=== Debug Flags Management ==="

# Enable common debug flags
echo "Enabling debug flags..."
adb shell setprop debug.strictmode 1
adb shell setprop debug.layout true
adb shell setprop debug.hwui.overdraw show
adb shell setprop debug.hwui.profile true

# Enable app-specific logging
adb shell setprop log.tag."$PACKAGE" VERBOSE

echo "Debug flags enabled. Restart app to see effects."

# Function to disable flags
disable_debug_flags() {
    echo "Disabling debug flags..."
    adb shell setprop debug.strictmode 0
    adb shell setprop debug.layout false
    adb shell setprop debug.hwui.overdraw false
    adb shell setprop debug.hwui.profile false
}

echo "Run disable_debug_flags function to turn off debugging."
```

ANR monitoring script:
```sh
#!/bin/bash
PACKAGE="com.example.app"

echo "=== ANR Monitoring for $PACKAGE ==="

# Clear ANR traces
echo "Clearing ANR traces..."
adb shell rm /data/anr/traces.txt 2>/dev/null

# Start app
echo "Starting app..."
adb shell am start -n "$PACKAGE/.MainActivity"

# Monitor for ANRs
echo "Monitoring for ANRs (60 seconds)..."
sleep 60

# Check for ANR traces
if adb shell test -f /data/anr/traces.txt; then
    echo "⚠ ANR detected!"
    echo "ANR traces:"
    adb shell cat /data/anr/traces.txt | grep -A 20 "$PACKAGE"
else
    echo "✓ No ANRs detected"
fi
```

## Notes
- Debug mode may affect app performance
- Some debug options require root access
- Wait for debugger requires Android Studio or similar IDE
- Bug reports can be large and take time to generate
- ANR traces require permission to access
- Debug flags reset after device reboot
- Always disable debug options in production
- Use specific log tags to filter relevant information
- Memory info may vary between Android versions
