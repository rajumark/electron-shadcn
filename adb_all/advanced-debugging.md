# Advanced Debugging - ADB Commands

## Description
Advanced debugging techniques, deep system analysis, and expert-level troubleshooting.

### Basic Commands
System debugging:
```sh
adb shell dumpsys --all
```

Kernel debugging:
```sh
adb shell dmesg
```

Process debugging:
```sh
adb shell ps -A -Z
```

Network debugging:
```sh
adb shell netstat -an
```

Memory debugging:
```sh
adb shell cat /proc/meminfo
```

### Advanced Commands
Deep system analysis:
```sh
adb shell "dumpsys activity && dumpsys cpuinfo && dumpsys meminfo && dumpsys battery"
```

Kernel module debugging:
```sh
adb shell ls -la /sys/module/
```

System call tracing:
```sh
adb shell strace -p $(adb shell pidof com.example.app)
```

Memory leak detection:
```sh
adb shell "watch -n 5 'dumpsys meminfo com.example.app | grep TOTAL'"
```

Performance debugging:
```sh
adb shell "top -n 1 && free -m && df -h && iostat 1 1"
```

Graphics debugging:
```sh
adb shell "dumpsys SurfaceFlinger && dumpsys gfxinfo"
```

Security debugging:
```sh
adb shell "getenforce && getprop ro.crypto.state && dmesg | grep -i security"
```

Boot debugging:
```sh
adb shell "getprop | grep boot && cat /proc/cmdline"
```

Hardware debugging:
```sh
adb shell "cat /proc/cpuinfo && cat /proc/meminfo && ls -la /sys/class/"
```

App debugging:
```sh
adb shell "dumpsys package com.example.app && dumpsys activity top | grep com.example.app"
```

Network debugging:
```sh
adb shell "netstat -an && ip route && ping -c 4 8.8.8.8"
```

## Notes
- Advanced debugging may require root access
- Some debugging tools may not be available on all devices
- Use debugging information carefully for security
- Document findings for troubleshooting reference
