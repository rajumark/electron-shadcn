# Device Maintenance - ADB Commands

## Description
Commands for device maintenance, system cleanup, and performance preservation.

### Basic Commands
System cleanup:
```sh
adb shell pm trim-caches
```

Clear system cache:
```sh
adb shell echo 3 > /proc/sys/vm/drop_caches
```

Optimize storage:
```sh
adb shell pm list packages -f | cut -d: -f2 | xargs -I {} adb shell pm clear {}
```

Check system health:
```sh
adb shell dumpsys activity | grep -E "ANR|crash|error"
```

### Advanced Commands
Comprehensive maintenance:
```sh
echo "=== Device Maintenance ==="
adb shell pm trim-caches
adb shell echo 3 > /proc/sys/vm/drop_caches
adb shell am kill-all
adb shell logcat -c
echo "Maintenance completed"
```

App maintenance:
```sh
for app in $(adb shell pm list packages -3 | cut -d: -f2); do
  adb shell pm clear $app 2>/dev/null
done
```

System optimization:
```sh
adb shell "am kill-all && am kill-background && am send-trim-memory all RUNNING_LOW"
```

Storage maintenance:
```sh
adb shell "find /sdcard -name '*.tmp' -delete && find /sdcard -name '.thumbnails' -exec rm -rf {} +"
```

Memory maintenance:
```sh
adb shell "echo 3 > /proc/sys/vm/drop_caches && am send-trim-memory all RUNNING_LOW"
```

Performance maintenance:
```sh
adb shell "pm trim-caches && am kill-all && am kill-background"
```

Log maintenance:
```sh
adb shell "logcat -c && dmesg -c"
```

Cache maintenance:
```sh
adb shell "find /data -name 'cache' -type d -exec rm -rf {}/* 2>/dev/null"
```

Service maintenance:
```sh
adb shell "am kill-all && for service in $(adb shell service list | awk '{print $1}'); do adb shell stop $service 2>/dev/null; done"
```

## Notes
- Maintenance may temporarily affect performance
- Schedule maintenance during device idle time
- Always backup before maintenance operations
- Monitor device after maintenance for issues
