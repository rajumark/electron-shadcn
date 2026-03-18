# App Crash Analysis - ADB Commands

## Description
Commands for analyzing app crashes, debugging crashes, and crash reporting.

### Basic Commands
Monitor crashes:
```sh
adb logcat | grep -E "FATAL|CRASH|AndroidRuntime"
```

Get crash logs:
```sh
adb logcat -d | grep -E "FATAL|CRASH" | tail -50
```

Check ANR logs:
```sh
adb logcat -d | grep -E "ANR|Application Not Responding"
```

Monitor specific app crashes:
```sh
adb logcat | grep com.example.app
```

### Advanced Commands
Crash monitoring script:
```sh
adb shell "logcat -c && logcat | grep -E 'FATAL|CRASH' --line-buffered"
```

ANR analysis:
```sh
adb shell cat /data/anr/traces.txt
```

Tombstone analysis:
```sh
adb shell cat /data/tombstones/tombstone_*
```

Native crash analysis:
```sh
adb shell debuggerd -b <pid>
```

Java crash analysis:
```sh
adb shell logcat -d | grep -A 20 "FATAL EXCEPTION"
```

Crash report generation:
```sh
adb bugreport crash_report.zip
```

Stack trace extraction:
```sh
adb shell logcat -d | grep -E "at.*\(" | tail -20
```

Memory leak detection:
```sh
adb shell dumpsys meminfo com.example.app | grep -E "Native|Heap"
```

Crash frequency analysis:
```sh
adb shell logcat -d | grep -c "FATAL.*com.example.app"
```

## Notes
- Some crash logs require root access
- ANR files may be in different locations
- Use debuggerd for native crashes
- Monitor logcat continuously for real-time analysis
