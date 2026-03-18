# Device Monitoring - ADB Commands

## Description
Commands for real-time device monitoring, system health checks, and performance tracking.

### Basic Commands
Monitor device status:
```sh
adb shell dumpsys deviceidle | grep -E "mState|Idle"
```

Check device temperature:
```sh
adb shell cat /sys/class/thermal/thermal_zone*/temp
```

Monitor battery health:
```sh
adb shell dumpsys battery | grep -E "health|temperature|voltage"
```

Check system load:
```sh
adb shell cat /proc/loadavg
```

Monitor storage usage:
```sh
adb shell df -h
```

### Advanced Commands
Real-time system monitoring:
```sh
adb shell "while true; do clear; date; top -n 1 | head -10; free -m; sleep 2; done"
```

Monitor app performance:
```sh
adb shell dumpsys activity top | grep -E "TASK|ACTIVITY"
```

Check network connectivity:
```sh
adb shell ping -c 4 8.8.8.8
```

Monitor memory pressure:
```sh
adb shell cat /proc/pressure/memory
```

Track CPU temperature:
```sh
adb shell watch -n 1 "cat /sys/class/thermal/thermal_zone*/temp"
```

Monitor disk I/O:
```sh
adb shell iostat 1 5
```

Check system services:
```sh
adb shell getprop | grep init.svc
```

Monitor app crashes:
```sh
adb shell logcat | grep -E "FATAL|CRASH"
```

Track network latency:
```sh
adb shell ping -i 1 8.8.8.8
```

Monitor GPU usage:
```sh
adb shell dumpsys gfxinfo | grep -E "frames|jank"
```

## Notes
- Continuous monitoring may impact device performance
- Some monitoring commands require root access
- Use appropriate intervals for real-time monitoring
- Monitor logcat for detailed system events
