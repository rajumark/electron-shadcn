# Accessibility - ADB Commands

## Description
Commands for managing accessibility features, screen readers, and accessibility services on Android devices.

### Basic Commands

Enable accessibility service:
```sh
adb shell settings put secure enabled_accessibility_services com.android.talkback/com.google.android.marvin.talkback.TalkBackService
```

Disable accessibility services:
```sh
adb shell settings put secure enabled_accessibility_services ""
```

Check accessibility status:
```sh
adb shell settings get secure enabled_accessibility_services
```

Enable TalkBack:
```sh
adb shell settings put secure enabled_accessibility_services com.android.talkback/com.google.android.marvin.talkback.TalkBackService
```

Disable TalkBack:
```sh
adb shell settings put secure enabled_accessibility_services ""
```

### Advanced Commands

List accessibility services:
```sh
adb shell dumpsys accessibility
```

Check accessibility settings:
```sh
adb shell settings list secure | grep accessibility
```

Enable high contrast:
```sh
adb shell settings put system high_contrast_enabled 1
```

Disable high contrast:
```sh
adb shell settings put system high_contrast_enabled 0
```

Enable color inversion:
```sh
adb shell settings put system accessibililty_display_inversion_enabled 1
```

Disable color inversion:
```sh
adb shell settings put system accessibililty_display_inversion_enabled 0
```

Check accessibility shortcuts:
```sh
adb shell settings get secure accessibility_shortcut_target_service
```

Enable large text:
```sh
adb shell settings put system font_scale 1.5
```

Reset font scale:
```sh
adb shell settings put system font_scale 1.0
```

Check touch exploration:
```sh
adb shell settings get secure touch_exploration_enabled
```

Enable touch exploration:
```sh
adb shell settings put secure touch_exploration_enabled 1
```

### Examples

Enable TalkBack for testing:
```sh
adb shell settings put secure enabled_accessibility_services com.android.talkback/com.google.android.marvin.talkback.TalkBackService
```

Increase font size for accessibility:
```sh
adb shell settings put system font_scale 2.0
```

Enable high contrast mode:
```sh
adb shell settings put system high_contrast_enabled 1
```

Check all accessibility services:
```sh
adb shell dumpsys accessibility | grep -E "Service|ComponentName"
```

Reset all accessibility settings:
```sh
adb shell settings delete secure enabled_accessibility_services
adb shell settings put system font_scale 1.0
adb shell settings put system high_contrast_enabled 0
```

## Notes
- Accessibility changes require system permissions
- Some features may not be available on all Android versions
- TalkBack package name may vary by device manufacturer
- Accessibility services may interfere with automation testing
- Use `dumpsys accessibility` for comprehensive accessibility info
- Some accessibility settings reset on device reboot
- Accessibility features may impact app performance
- Screen readers may affect programmatic input
