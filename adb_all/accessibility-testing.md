# Accessibility Testing - ADB Commands

## Description
Commands for accessibility testing Android applications, ensuring app compliance with accessibility standards, and testing inclusive design features.

### Basic Commands

Enable accessibility services:
```sh
adb shell settings put secure enabled_accessibility_services com.example.accessibility/.Service
```

Check accessibility settings:
```sh
adb shell settings get secure accessibility_enabled
```

Enable TalkBack:
```sh
adb shell settings put secure talkback_enabled 1
```

Check screen reader status:
```sh
adb shell settings get secure talkback_enabled
```

Test with high contrast:
```sh
adb shell settings put system high_contrast_mode 1
```

### Advanced Commands

Complete accessibility test setup:
```sh
adb shell settings put secure accessibility_enabled 1
adb shell settings put secure enabled_accessibility_services com.android.talkback/com.android.talkback.TalkBackService
adb shell settings put secure talkback_enabled 1
```

Test content descriptions:
```sh
adb shell uiautomator dump && adb shell grep -i "content-desc" /sdcard/window_dump.xml
```

Check focus order:
```sh
adb shell uiautomator dump && adb shell grep -E "focused=\"true\"" /sdcard/window_dump.xml
```

Test with large text:
```sh
adb shell settings put system font_scale 1.5
adb shell am start -n com.example.app/.MainActivity
```

Test with high contrast:
```sh
adb shell settings put system high_contrast_mode 1
adb shell am start -n com.example.app/.MainActivity
```

Test color blind simulation:
```sh
adb shell settings put system display_color_mode 0
adb shell am start -n com.example.app/.MainActivity
```

Test with reduced motion:
```sh
adb shell settings put system reduced_motion 1
adb shell am start -n com.example.app/.MainActivity
```

Check accessibility hierarchy:
```sh
adb shell uiautomator dump && adb shell cat /sdcard/window_dump.xml | grep -E "clickable|focusable|enabled"
```

Test navigation with keyboard:
```sh
adb shell input keyevent KEYCODE_TAB
adb shell input keyevent KEYCODE_ENTER
```

Test with screen magnification:
```sh
adb shell settings put secure accessibility_display_magnification_enabled 1
adb shell am start -n com.example.app/.MainActivity
```

Check accessibility labels:
```sh
adb shell uiautomator dump && adb shell grep -E "text=\"|content-desc=\"" /sdcard/window_dump.xml
```

Test with different color schemes:
```sh
for mode in 0 1 2; do
  echo "=== Color mode: $mode ==="
  adb shell settings put system display_color_mode $mode
  adb shell am start -n com.example.app/.MainActivity
  sleep 3
done
```

Test accessibility automation:
```sh
adb shell am instrument -w -e accessibilityTests true com.example.app.accessibility.test/androidx.test.runner.AndroidJUnitRunner
```

### Examples

Enable TalkBack for testing:
```sh
adb shell settings put secure accessibility_enabled 1
adb shell settings put secure talkback_enabled 1
adb shell am start -n com.example.app/.MainActivity
```

Test content descriptions:
```sh
adb shell uiautomator dump
adb shell grep -i "content-desc" /sdcard/window_dump.xml
```

Test with large text:
```sh
adb shell settings put system font_scale 2.0
adb shell am start -n com.example.app/.MainActivity
sleep 5
adb shell settings put system font_scale 1.0
```

Check focus navigation:
```sh
adb shell uiautomator dump
adb shell grep -E "focused=\"true\"" /sdcard/window_dump.xml
```

Complete accessibility test:
```sh
#!/bin/bash
echo "=== Accessibility Testing ==="

# Enable accessibility
adb shell settings put secure accessibility_enabled 1
adb shell settings put secure talkback_enabled 1

# Test with large text
adb shell settings put system font_scale 1.5
adb shell am start -n com.example.app/.MainActivity
sleep 3

# Test high contrast
adb shell settings put system high_contrast_mode 1
sleep 3

# Reset settings
adb shell settings put system font_scale 1.0
adb shell settings put system high_contrast_mode 0

echo "Accessibility test completed"
```

## Notes
- Accessibility testing requires enabling accessibility services
- Test with various accessibility tools enabled
- Content descriptions are crucial for screen readers
- Focus order should be logical and predictable
- Test with different font sizes and color schemes
- Consider motor impairments in testing
- Accessibility features vary by Android version
- Document accessibility issues for remediation
