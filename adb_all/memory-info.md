# Memory Information - ADB Commands

## Description
Commands for monitoring memory usage, RAM statistics, and memory management on Android devices.

### Basic Commands

Get memory info:
```sh
adb shell cat /proc/meminfo
```

Get total memory:
```sh
adb shell cat /proc/meminfo | grep MemTotal
```

Get available memory:
```sh
adb shell cat /proc/meminfo | grep MemAvailable
```

Get free memory:
```sh
adb shell cat /proc/meminfo | grep MemFree
```

Check memory usage summary:
```sh
adb shell dumpsys meminfo
```

### Advanced Commands

Get memory usage by app:
```sh
adb shell dumpsys meminfo com.example.app
```

Get system memory summary:
```sh
adb shell dumpsys meminfo system
```

Monitor memory in real-time:
```sh
adb shell watch -n 2 "cat /proc/meminfo | head -10"
```

Get memory pressure:
```sh
adb shell cat /proc/pressure/memory
```

Check swap usage:
```sh
adb shell cat /proc/swaps
```

Get memory map of process:
```sh
adb shell cat /proc/[pid]/maps
```

Get process memory stats:
```sh
adb shell cat /proc/[pid]/statm
```

Check low memory killer:
```sh
adb shell cat /sys/module/lowmemorykiller/parameters/minfree
```

Get memory cgroups:
```sh
adb shell cat /proc/cgroups | grep memory
```

### Examples

Monitor memory usage:
```sh
adb shell dumpsys meminfo | grep -E "Total|Free|RAM"
```

Check specific app memory:
```sh
adb shell dumpsys meminfo com.android.systemui
```

Get memory usage in MB:
```sh
adb shell free -m
```

Monitor memory pressure:
```sh
adb shell cat /sys/devices/virtual/meminfo/meminfo
```

Check ZRAM usage:
```sh
adb shell cat /proc/meminfo | grep -E "SwapTotal|SwapFree"
```

## Notes
- Memory values are typically in KB unless specified
- Some memory information requires root access
- Use PID to get specific process memory information
- Memory pressure monitoring available on newer Android versions
- ZRAM may not be available on all devices
- Use `adb shell procrank` for process ranking by memory usage
