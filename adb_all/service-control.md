# Service Control - ADB Commands

## Description
Commands for managing Android services, controlling system services, and service lifecycle operations.

### Basic Commands

List running services:
```sh
adb shell service list
```

Start specific service:
```sh
adb shell start service_name
```

Stop specific service:
```sh
adb shell stop service_name
```

Check service status:
```sh
adb shell getprop init.svc.service_name
```

Restart service:
```sh
adb shell restart service_name
```

### Advanced Commands

List all system services:
```sh
adb shell dumpsys activity services
```

Check specific service info:
```sh
adb shell dumpsys activity services | grep service_name
```

Start activity manager service:
```sh
adb shell start activity_manager
```

Stop activity manager service:
```sh
adb shell stop activity_manager
```

Check service dependencies:
```sh
adb shell dumpsys activity services | grep -E "Connection|Binding"
```

Monitor service lifecycle:
```sh
adb shell logcat | grep -E "Service.*start|Service.*stop"
```

Force stop service:
```sh
adb shell am stop-service service_name
```

Check service memory usage:
```sh
adb shell dumpsys meminfo service_name
```

List services with PIDs:
```sh
adb shell ps -A | grep -E "service|android"
```

Restart all services:
```sh
adb shell stop && adb shell start
```

Check service permissions:
```sh
adb shell dumpsys package service_name | grep permission
```

Get service configuration:
```sh
adb shell getprop | grep service
```

### Examples

Check all running services:
```sh
adb shell service list
```

Restart activity manager:
```sh
adb shell stop activity_manager
adb shell start activity_manager
```

Monitor service crashes:
```sh
adb shell logcat | grep -E "Service.*crash|Service.*died"
```

Check specific app services:
```sh
adb shell dumpsys activity services com.example.app
```

Force stop problematic service:
```sh
adb shell am force-stop com.example.app
```

List system services with status:
```sh
adb shell getprop | grep init.svc
```

## Notes
- Service control requires system permissions
- Stopping critical services may cause device instability
- Some services restart automatically
- Use `dumpsys` for detailed service information
- Service names may vary between Android versions
- Some services cannot be stopped via ADB
- Service operations may affect device functionality
- Use caution when modifying system services
