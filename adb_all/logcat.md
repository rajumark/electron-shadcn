# Logcat - ADB Commands

## Description
Commands for viewing, filtering, and managing Android system logs using logcat for debugging and monitoring.

### Basic Commands

View all logs:
```sh
adb logcat
```

Clear log buffer:
```sh
adb logcat -c
```

Save logs to file:
```sh
adb logcat > logs.txt
```

View logs with timestamps:
```sh
adb logcat -v time
```

Filter by log level:
```sh
adb logcat *:E
```

### Advanced Commands

Filter by specific tag:
```sh
adb logcat -s TagName
```

Filter by package name:
```sh
adb logcat --pid=$(adb shell pidof com.example.app)
```

View logs with priority:
```sh
adb logcat -v brief
```

Filter multiple tags:
```sh
adb logcat -s "TagName1" "TagName2"
```

View kernel logs:
```sh
adb logcat -b kernel
```

View system logs:
```sh
adb logcat -b system
```

Monitor logs in real-time:
```sh
adb logcat | grep "ERROR"
```

Get logs since last boot:
```sh
adb logcat -d
```

Filter by time range:
```sh
adb logcat -t "01-01 00:00:00.000"
```

View crash logs:
```sh
adb logcat -b crash
```

Get logs with thread info:
```sh
adb logcat -v thread
```

Monitor specific app logs:
```sh
adb logcat --pid=$(adb shell pidof com.example.app) -v time
```

### Examples

View all error logs:
```sh
adb logcat *:E
```

Monitor specific app:
```sh
adb logcat --pid=$(adb shell pidof com.example.app)
```

Save logs with timestamps:
```sh
adb logcat -v time > app_logs.txt
```

Clear and start fresh logging:
```sh
adb logcat -c
adb logcat
```

Filter by multiple tags:
```sh
adb logcat -s "ActivityManager" "PackageManager"
```

View recent kernel messages:
```sh
adb logcat -b kernel -d | tail -20
```

Monitor for crashes:
```sh
adb logcat -b crash -v time
```

Get logs since specific time:
```sh
adb logcat -t "12-25 10:00:00.000"
```

## Notes
- Logcat requires appropriate permissions for some logs
- Log buffer may be limited in size
- Some logs may be filtered by system
- Use `-c` to clear buffer before capturing specific logs
- Log levels: V=Verbose, D=Debug, I=Info, W=Warn, E=Error, F=Fatal
- Use `-s` for silent mode with specific tags
- Some logs may require root access
- Logcat output can be overwhelming without filtering
