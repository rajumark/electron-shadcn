# App Services - ADB Commands

## Description
Commands for managing Android application services, including starting, stopping, monitoring, and debugging services.

### Basic Commands

List all running services:
```sh
adb shell service list
```

List app-specific services:
```sh
adb shell dumpsys activity services | grep com.example.app
```

Start a service:
```sh
adb shell am startservice com.example.app/.MyService
```

Stop a service:
```sh
adb shell stopservice com.example.app/.MyService
```

### Advanced Commands

Start service with intent:
```sh
adb shell am startservice -n com.example.app/.MyService -e key value
```

Start foreground service:
```sh
adb shell am start-foreground-service com.example.app/.MyService
```

Stop app services:
```sh
adb shell am stopservice com.example.app/.MyService
```

Force stop app (stops all services):
```sh
adb shell am force-stop com.example.app
```

Get service details:
```sh
adb shell dumpsys activity services com.example.app
```

Check service status:
```sh
adb shell dumpsys activity services | grep -A 10 "ServiceRecord"
```

List system services:
```sh
adb shell service list
```

Interact with system service:
```sh
adb shell service call activity 42
```

Get service manager info:
```sh
adb shell dumpsys service
```

Start service with specific action:
```sh
adb shell am startservice -a com.example.app.ACTION_CUSTOM
```

Bind to service:
```sh
adb shell am bindservice com.example.app/.MyService
```

Get service process info:
```sh
adb shell ps | grep com.example.app
```

Monitor service lifecycle:
```sh
adb logcat | grep "Service"
```

### Examples

Service management script:
```sh
#!/bin/bash
PACKAGE="com.example.app"

echo "=== Service Management for $PACKAGE ==="

# List current services
echo "Current services:"
adb shell dumpsys activity services | grep "$PACKAGE" | grep "ServiceRecord"

# Start specific service
echo "Starting service..."
adb shell am startservice "$PACKAGE/.MyService"

# Check if service started
sleep 2
echo "Service status after start:"
adb shell dumpsys activity services | grep "$PACKAGE" | grep "ServiceRecord"
```

Service monitoring script:
```sh
#!/bin/bash
PACKAGE="com.example.app"

echo "=== Monitoring Services for $PACKAGE ==="
echo "Press Ctrl+C to stop monitoring"

while true; do
    clear
    echo "=== Service Status at $(date) ==="
    adb shell dumpsys activity services | grep -A 5 "$PACKAGE"
    echo ""
    echo "=== Memory Usage ==="
    adb shell dumpsys meminfo "$PACKAGE" | grep -E "TOTAL|Native|Dalvik"
    sleep 5
done
```

Complete service control:
```sh
#!/bin/bash
PACKAGE="com.example.app"
SERVICE="MyService"

echo "=== Complete Service Control ==="

# Stop app first
echo "Stopping app..."
adb shell am force-stop "$PACKAGE"

# Clear app data
echo "Clearing app data..."
adb shell pm clear "$PACKAGE"

# Start app
echo "Starting app..."
adb shell monkey -p "$PACKAGE" -c android.intent.category.LAUNCHER 1

# Wait for app to start
sleep 3

# Start service
echo "Starting service..."
adb shell am startservice "$PACKAGE/.$SERVICE"

# Monitor service
echo "Monitoring service..."
adb logcat -s "MyService" &
LOGCAT_PID=$!

sleep 10

# Stop monitoring
kill $LOGCAT_PID

# Stop service
echo "Stopping service..."
adb shell stopservice "$PACKAGE/.$SERVICE"
```

Service debugging:
```sh
#!/bin/bash
PACKAGE="com.example.app"

echo "=== Service Debugging ==="

# Get detailed service info
echo "Service details:"
adb shell dumpsys activity services "$PACKAGE" | grep -A 20 "ServiceRecord"

# Check process info
echo "Process info:"
adb shell ps | grep "$PACKAGE"

# Check memory usage
echo "Memory usage:"
adb shell dumpsys meminfo "$PACKAGE"

# Check for service-related errors
echo "Recent service errors:"
adb logcat -d -v time | grep -i "$PACKAGE" | grep -i "service" | tail -10
```

## Notes
- Services run in the background even when app is not visible
- Use `force-stop` to stop all services of an app
- Some services may restart automatically
- Foreground services require notification on Android 8.0+
- System services can be accessed via `service call`
- Service names are case-sensitive
- Use `dumpsys activity services` for comprehensive service information
- Some services may require special permissions to control
