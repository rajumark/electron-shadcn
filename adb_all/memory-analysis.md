# Memory Analysis - ADB Commands

## Description
Commands for analyzing memory usage, debugging memory leaks, and monitoring memory performance on Android devices.

### Basic Commands

Get app memory info:
```sh
adb shell dumpsys meminfo com.example.app
```

Check system memory:
```sh
adb shell cat /proc/meminfo
```

Monitor memory usage:
```sh
adb shell top -n 1 | grep -E "memory|MEM"
```

Get memory summary:
```sh
adb shell dumpsys meminfo
```

Check available memory:
```sh
adb shell cat /proc/meminfo | grep -E "MemAvailable|MemFree"
```

### Advanced Commands

Analyze app memory details:
```sh
adb shell dumpsys meminfo com.example.app -d
```

Monitor memory leaks:
```sh
adb shell dumpsys meminfo com.example.app | watch -n 5
```

Get heap info:
```sh
adb shell dumpsys meminfo com.example.app | grep -E "Heap|PSS"
```

Check native memory:
```sh
adb shell dumpsys meminfo com.example.app | grep -E "Native|Heap"
```

Monitor memory pressure:
```sh
adb shell cat /proc/pressure/memory
```

Analyze memory by category:
```sh
adb shell dumpsys meminfo com.example.app | grep -E "Graphics|GL|Audio"
```

Check memory maps:
```sh
adb shell cat /proc/$(adb shell pidof com.example.app)/maps
```

Monitor memory usage over time:
```sh
for i in {1..10}; do
  echo "=== Check $i ==="
  adb shell dumpsys meminfo com.example.app | grep TOTAL
  sleep 30
done
```

Analyze memory fragmentation:
```sh
adb shell dumpsys meminfo | grep -E "fragmentation|unstable"
```

Check memory thresholds:
```sh
adb shell dumpsys activity | grep -E "memory|trim"
```

Monitor GC activity:
```sh
adb shell logcat | grep -E "GC|garbage"
```

Get memory of all apps:
```sh
adb shell dumpsys meminfo | grep -E "PROCESS|TOTAL"
```

### Examples

Analyze app memory usage:
```sh
adb shell dumpsys meminfo com.example.app
```

Monitor memory for leaks:
```sh
while true; do
  adb shell dumpsys meminfo com.example.app | grep TOTAL
  sleep 60
done
```

Check system memory status:
```sh
adb shell cat /proc/meminfo | head -10
```

Monitor memory pressure:
```sh
adb shell cat /proc/pressure/memory
```

Analyze heap usage:
```sh
adb shell dumpsys meminfo com.example.app | grep -A 10 "Heap"
```

Check native memory:
```sh
adb shell dumpsys meminfo com.example.app | grep -E "Native|JNI"
```

Monitor GC activity:
```sh
adb shell logcat | grep -E "GC|garbage" | tail -20
```

## Notes
- Memory analysis requires appropriate permissions
- Some memory info may be restricted for security
- Memory values are typically in KB
- Use `dumpsys meminfo` for comprehensive memory info
- Memory analysis may impact device performance
- Some memory details require debug builds
- Native memory analysis requires root access
- Monitor memory over time to detect leaks
