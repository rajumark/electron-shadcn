# Brightness Control - ADB Commands

## Description
Commands for controlling screen brightness, managing display brightness settings, and auto-brightness configuration on Android devices.

### Basic Commands

Set brightness level:
```sh
adb shell settings put system screen_brightness 128
```

Get current brightness:
```sh
adb shell settings get system screen_brightness
```

Set maximum brightness:
```sh
adb shell settings put system screen_brightness 255
```

Set minimum brightness:
```sh
adb shell settings put system screen_brightness 1
```

Enable auto-brightness:
```sh
adb shell settings put system screen_brightness_mode 1
```

### Advanced Commands

Disable auto-brightness:
```sh
adb shell settings put system screen_brightness_mode 0
```

Check auto-brightness status:
```sh
adb shell settings get system screen_brightness_mode
```

Set brightness with percentage:
```sh
adb shell settings put system screen_brightness $((255 * 50 / 100))
```

Get brightness mode:
```sh
adb shell settings get system screen_brightness_mode
```

Monitor brightness changes:
```sh
adb shell watch -n 1 "settings get system screen_brightness"
```

Set adaptive brightness:
```sh
adb shell settings put system screen_brightness_mode 1
```

Get display brightness info:
```sh
adb shell dumpsys display | grep -i brightness
```

Set brightness for specific display:
```sh
adb shell content insert --uri content://settings/system --bind name:s:screen_brightness --bind value:i:200
```

Reset brightness settings:
```sh
adb shell settings delete system screen_brightness
```

Check brightness range:
```sh
adb shell dumpsys display | grep -E "brightness|range"
```

### Examples

Set 50% brightness:
```sh
adb shell settings put system screen_brightness 128
```

Enable auto-brightness:
```sh
adb shell settings put system screen_brightness_mode 1
```

Set 75% brightness and disable auto:
```sh
adb shell settings put system screen_brightness_mode 0
adb shell settings put system screen_brightness 191
```

Check current brightness level:
```sh
adb shell settings get system screen_brightness
# Output: 128 (0-255 range)
```

Set brightness by percentage:
```sh
# Set to 30%
PERCENT=30
BRIGHTNESS=$((255 * PERCENT / 100))
adb shell settings put system screen_brightness $BRIGHTNESS
```

## Notes
- Brightness range: 1-255 (0 = screen off)
- Auto-brightness mode: 0=manual, 1=automatic
- Some devices may have different brightness ranges
- Brightness changes may require system permissions
- Auto-brightness depends on ambient light sensor
- Some apps may override brightness settings
- Use `dumpsys display` for detailed brightness information
- Brightness settings persist across reboots
