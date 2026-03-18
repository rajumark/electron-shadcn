# Device Cleanup - ADB Commands

## Description
Commands for cleaning up device storage, removing cache, and optimizing device performance.

### Basic Commands
Clear app cache:
```sh
adb shell pm clear com.example.app
```

Clear system cache:
```sh
adb shell rm -rf /cache/*
```

Clean temp files:
```sh
adb shell rm -rf /data/local/tmp/*
```

Check storage usage:
```sh
adb shell df -h
```

Clear app data:
```sh
adb shell pm clear com.example.app
```

### Advanced Commands
Clean all app caches:
```sh
for app in $(adb shell pm list packages | cut -d: -f2); do
  adb shell pm clear $app 2>/dev/null
done
```

Clean system logs:
```sh
adb shell logcat -c
```

Remove thumbnail cache:
```sh
adb shell rm -rf /sdcard/DCIM/.thumbnails/*
```

Clean download folder:
```sh
adb shell rm -rf /sdcard/Download/*
```

Clear browser data:
```sh
adb shell pm clear com.android.browser
```

Clean package cache:
```sh
adb shell rm -rf /data/app/*/cache/*
```

Remove orphaned files:
```sh
adb shell find /data -name "*.tmp" -delete
```

Clean dalvik cache:
```sh
adb shell rm -rf /data/dalvik-cache/*
```

Clear clipboard data:
```sh
adb shell service call clipboard 3
```

Clean app leftovers:
```sh
adb shell find /data/data -maxdepth 1 -type d -empty -delete
```

## Notes
- Cache clearing may affect app performance temporarily
- Some system directories require root access
- Always backup important data before cleanup
- Use caution when deleting system files
