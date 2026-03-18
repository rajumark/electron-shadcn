# Compatibility Testing - ADB Commands

## Description
Commands for compatibility testing Android applications across different Android versions, devices, and configurations.

### Basic Commands

Check Android version:
```sh
adb shell getprop ro.build.version.release
```

Check API level:
```sh
adb shell getprop ro.build.version.sdk
```

Check device model:
```sh
adb shell getprop ro.product.model
```

Check screen density:
```sh
adb shell wm density
```

Check screen resolution:
```sh
adb shell wm size
```

### Advanced Commands

Test app compatibility across versions:
```sh
adb shell am start -n com.example.app/.MainActivity
adb shell dumpsys package com.example.app | grep -E "targetSdk|versionCode"
```

Check runtime permissions compatibility:
```sh
adb shell pm list permissions | grep dangerous
adb shell dumpsys package com.example.app | grep -E "permission|uses-permission"
```

Test on different screen sizes:
```sh
for size in "480x800" "720x1280" "1080x1920" "1440x2560"; do
  adb shell wm size $size
  adb shell am start -n com.example.app/.MainActivity
  sleep 5
done
```

Check locale compatibility:
```sh
for locale in "en-US" "es-ES" "fr-FR" "zh-CN" "ja-JP"; do
  adb shell setprop persist.sys.locale $locale
  adb shell am start -n com.example.app/.MainActivity
  sleep 3
done
```

Test different Android versions:
```sh
for device in $(adb devices | grep -v "List" | awk '{print $1}'); do
  echo "=== Device: $device ==="
  adb -s $device shell getprop ro.build.version.release
  adb -s $device shell am start -n com.example.app/.MainActivity
done
```

Check hardware compatibility:
```sh
adb shell pm list features | grep -E "camera|gps|nfc|bluetooth"
adb shell dumpsys package com.example.app | grep -E "uses-feature"
```

Test storage compatibility:
```sh
adb shell df -h /data
adb shell pm get-install-location com.example.app
```

Check network compatibility:
```sh
adb shell getprop ro.telephony.default_network
adb shell dumpsys connectivity | grep -E "NetworkAgentInfo"
```

Test accessibility compatibility:
```sh
adb shell settings put secure enabled_accessibility_services com.example.accessibility/.Service
adb shell am start -n com.example.app/.MainActivity
```

Check permission compatibility:
```sh
adb shell dumpsys package com.example.app | grep -A 20 "requested permissions"
adb shell pm grant com.example.app android.permission.CAMERA
```

Test different configurations:
```sh
adb shell settings put global font_scale 1.2
adb shell am start -n com.example.app/.MainActivity
adb shell settings put global font_scale 1.0
```

### Examples

Multi-device compatibility test:
```sh
for device in $(adb devices | grep -v "List" | awk '{print $1}'); do
  echo "=== Testing on $device ==="
  adb -s $device shell getprop ro.build.version.release
  adb -s $device shell getprop ro.product.model
  adb -s $device shell am start -n com.example.app/.MainActivity
  sleep 5
done
```

Screen size compatibility test:
```sh
for size in "480x800" "720x1280" "1080x1920"; do
  echo "=== Testing size: $size ==="
  adb shell wm size $size
  adb shell am start -n com.example.app/.MainActivity
  sleep 3
done
adb shell wm size reset
```

Locale compatibility test:
```sh
for locale in "en-US" "es-ES" "fr-FR"; do
  echo "=== Testing locale: $locale ==="
  adb shell setprop persist.sys.locale $locale
  adb shell am start -n com.example.app/.MainActivity
  sleep 3
done
```

## Notes
- Compatibility testing requires multiple devices/emulators
- Test on minimum supported API level and latest version
- Screen size affects UI layout and performance
- Locale testing requires proper localization
- Hardware features may not be available on all devices
- Document compatibility issues for each configuration
- Use systematic approach for comprehensive testing
- Consider carrier-specific variations in testing
