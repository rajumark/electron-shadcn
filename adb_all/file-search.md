# File Search - ADB Commands

## Description
Commands for searching and locating files and directories on Android devices using ADB shell operations.

### Basic Commands

Search for files by name:
```sh
adb shell find / -name "filename"
```

Search in specific directory:
```sh
adb shell find /sdcard -name "*.apk"
```

Case-insensitive search:
```sh
adb shell find / -iname "filename"
```

Search by file extension:
```sh
adb shell find /system -name "*.so"
```

Search directories only:
```sh
adb shell find / -type d -name "android"
```

### Advanced Commands

Search by file size:
```sh
adb shell find / -size +10M
```

Search by modification time:
```sh
adb shell find / -mtime -7
```

Search with multiple patterns:
```sh
adb shell find / -name "*.mp3" -o -name "*.mp4"
```

Search and execute command:
```sh
adb shell find /sdcard -name "*.log" -exec rm {} \;
```

Search by permissions:
```sh
adb shell find / -perm 777
```

Search by user/group:
```sh
adb shell find / -user system
```

Recursive grep in files:
```sh
adb shell grep -r "text" /sdcard/
```

### Examples

Find all APK files:
```sh
adb shell find / -name "*.apk" 2>/dev/null
```

Search for large files (>100MB):
```sh
adb shell find / -size +100M -exec ls -lh {} \;
```

Find recently modified files (last 24 hours):
```sh
adb shell find /sdcard -mtime -1 -type f
```

Search for configuration files:
```sh
adb shell find /system -name "*.conf" -o -name "*.xml"
```

## Notes
- Use `2>/dev/null` to suppress permission errors
- Root access may be required for system directory searches
- Large searches can impact device performance
- Consider using `locate` command if available: `adb shell locate filename`
- For faster searches, limit scope to specific directories
