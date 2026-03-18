# Profiling - ADB Commands

## Description
Commands for performance profiling, system analysis, and collecting performance metrics from Android applications.

### Basic Commands

Start method profiling:
```sh
adb shell am start --start-profiler com.example.app/.MainActivity
```

Stop method profiling:
```sh
adb shell am profile stop com.example.app
```

Generate trace file:
```sh
adb pull /data/local/tmp/trace.trace
```

Start GPU profiling:
```sh
adb shell dumpsys gfxinfo com.example.app framestats
```

Check app performance:
```sh
adb shell dumpsys activity top | grep -E "TASK|ACTIVITY"
```

### Advanced Commands

Profile app startup:
```sh
adb shell am start -W -n com.example.app/.MainActivity
```

Generate CPU profile:
```sh
adb shell am profile start com.example.app /data/local/tmp/cpu_profile.trace
```

Profile memory usage:
```sh
adb shell dumpsys meminfo com.example.app
```

Profile network performance:
```sh
adb shell dumpsys netstats | grep com.example.app
```

Profile battery usage:
```sh
adb shell dumpsys batterystats | grep com.example.app
```

Profile graphics performance:
```sh
adb shell dumpsys gfxinfo com.example.app
```

Profile disk I/O:
```sh
adb shell dumpsys diskstats | grep com.example.app
```

Profile app startup time:
```sh
adb shell am start -S -W com.example.app/.MainActivity
```

Profile method calls:
```sh
adb shell am start --start-profiler com.example.app/.MainActivity
```

Profile system performance:
```sh
adb shell dumpsys cpuinfo
adb shell top -n 1
```

Profile app responsiveness:
```sh
adb shell dumpsys activity | grep -E "ANR|stopped"
```

Profile frame rendering:
```sh
adb shell dumpsys gfxinfo com.example.app framestats
```

### Examples

Profile app startup performance:
```sh
adb shell am start -W -n com.example.app/.MainActivity
```

Generate method trace:
```sh
adb shell am profile start com.example.app /data/local/tmp/app.trace
# Perform app actions
adb shell am profile stop com.example.app
adb pull /data/local/tmp/app.trace
```

Profile graphics performance:
```sh
adb shell dumpsys gfxinfo com.example.app
```

Profile memory usage:
```sh
adb shell dumpsys meminfo com.example.app > memory_profile.txt
```

Profile CPU usage:
```sh
adb shell top -n 1 | grep com.example.app
```

Profile network usage:
```sh
adb shell dumpsys netstats | grep com.example.app
```

## Notes
- Profiling requires appropriate permissions
- Method profiling may impact app performance
- Trace files can be analyzed with Android Studio
- Some profiling features require debug builds
- Use profiling for optimization, not production monitoring
- Profiling data may contain sensitive information
- GPU profiling requires Android 4.1+ (API 16+)
- Method profiling requires Android 4.4+ (API 19+)
