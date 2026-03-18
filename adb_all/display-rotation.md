# Display Rotation - ADB Commands

## Description
Commands for controlling screen orientation, display rotation, and landscape/portrait mode settings on Android devices.

### Basic Commands

Set landscape mode:
```sh
adb shell settings put system user_rotation 1
```

Set portrait mode:
```sh
adb shell settings put system user_rotation 0
```

Set reverse landscape:
```sh
adb shell settings put system user_rotation 3
```

Set reverse portrait:
```sh
adb shell settings put system user_rotation 2
```

Get current rotation:
```sh
adb shell settings get system user_rotation
```

### Advanced Commands

Enable auto-rotation:
```sh
adb shell settings put system accelerometer_rotation 1
```

Disable auto-rotation:
```sh
adb shell settings put system accelerometer_rotation 0
```

Check auto-rotation status:
```sh
adb shell settings get system accelerometer_rotation
```

Force rotation via surface:
```sh
adb shell service call activity 42 i32 1
```

Get display orientation:
```sh
adb shell dumpsys display | grep -E "orientation|rotation"
```

Monitor rotation changes:
```sh
adb shell dumpsys display | grep -E "mOrientation|mRotation"
```

Set rotation for specific display:
```sh
adb shell content insert --uri content://settings/system --bind name:s:user_rotation --bind value:i:1
```

Reset rotation settings:
```sh
adb shell settings delete system user_rotation
```

Check natural orientation:
```sh
adb shell dumpsys display | grep naturalOrientation
```

Force rotation via window manager:
```sh
adb shell wm rotation 1
```

### Examples

Force landscape mode:
```sh
adb shell settings put system user_rotation 1
```

Enable auto-rotate:
```sh
adb shell settings put system accelerometer_rotation 1
```

Disable auto-rotate and force portrait:
```sh
adb shell settings put system accelerometer_rotation 0
adb shell settings put system user_rotation 0
```

Check current orientation:
```sh
adb shell dumpsys display | grep orientation
```

Reset to default rotation:
```sh
adb shell settings delete system user_rotation
adb shell settings put system accelerometer_rotation 1
```

## Notes
- Rotation values: 0=portrait, 1=landscape, 2=reverse portrait, 3=reverse landscape
- Auto-rotation must be disabled for manual rotation to work
- Some apps may override system rotation settings
- Rotation changes may not work on all Android versions
- Use `settings put` for persistent rotation changes
- Some commands require system permissions or root
- Rotation settings reset on device reboot in some cases
