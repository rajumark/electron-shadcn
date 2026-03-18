# Device Automation - ADB Commands

## Description
Commands for device automation, scripted operations, and automated device management.

### Basic Commands
Automated device reboot:
```sh
adb reboot && adb wait-for-device
```

Automated app installation:
```sh
for apk in *.apk; do adb install "$apk"; done
```

Automated screenshot capture:
```sh
for i in {1..5}; do adb shell screencap /sdcard/screen$i.png; sleep 2; done
```

### Advanced Commands
Device setup automation:
```sh
#!/bin/bash
echo "Setting up device..."
adb shell settings put global airplane_mode_on 0
adb shell settings put system screen_off_timeout 30000
adb shell settings put secure accessibility_enabled 0
echo "Device setup complete"
```

Automated testing workflow:
```sh
for app in $(adb shell pm list packages -3 | cut -d: -f2); do
  echo "Testing $app..."
  adb shell am start -n $app/.MainActivity
  sleep 5
  adb shell screencap /sdcard/${app}_test.png
  adb shell am force-stop $app
done
```

Performance monitoring automation:
```sh
while true; do
  echo "$(date): $(adb shell dumpsys cpuinfo | head -5)"
  sleep 60
done
```

Device health automation:
```sh
adb shell "dumpsys battery > /sdcard/battery_$(date +%Y%m%d).txt"
adb shell "df -h > /sdcard/storage_$(date +%Y%m%d).txt"
adb shell "free -m > /sdcard/memory_$(date +%Y%m%d).txt"
```

Multi-device automation:
```sh
for device in $(adb devices | grep -v "List" | awk '{print $1}'); do
  echo "Processing $device..."
  adb -s $device shell getprop ro.product.model
  adb -s $device shell dumpsys battery
done
```

Automated backup workflow:
```sh
DATE=$(date +%Y%m%d_%H%M%S)
adb backup -apk -shared -all -f /backups/backup_$DATE.ab
adb pull /sdcard/DCIM /backups/photos_$DATE
```

Automated cleanup:
```sh
adb shell "pm trim-caches && logcat -c && am kill-all"
adb shell "find /sdcard -name '*.tmp' -delete"
```

## Notes
- Automation scripts require proper error handling
- Test automation on non-production devices first
- Use appropriate delays for device operations
- Document automation procedures for team use
