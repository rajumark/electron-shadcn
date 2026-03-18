# Screen Resolution - ADB Commands

## Description
Commands for managing screen resolution, display size, and resolution settings on Android devices.

### Basic Commands

Get current resolution:
```sh
adb shell wm size
```

Get physical display size:
```sh
adb shell dumpsys display | grep -E "mBaseDisplayInfo|Physical"
```

Check supported resolutions:
```sh
adb shell dumpsys display | grep supportedModes
```

Get display configuration:
```sh
adb shell dumpsys display | grep -E "width|height"
```

Check current mode:
```sh
adb shell dumpsys display | grep -A 5 "mActiveMode"
```

### Advanced Commands

Override screen resolution:
```sh
adb shell wm size 720x1280
```

Reset to default resolution:
```sh
adb shell wm size reset
```

Get display density and resolution:
```sh
adb shell dumpsys display | grep -E "density|width|height"
```

Check display cutout impact:
```sh
adb shell dumpsys display | grep -E "cutout|insets"
```

Monitor resolution changes:
```sh
adb shell dumpsys display | grep -E "resolution|mode"
```

Get virtual display resolution:
```sh
adb shell dumpsys display | grep -E "virtual|overlay"
```

Check display scaling:
```sh
adb shell dumpsys display | grep -E "scaling|smallestWidth"
```

Get display refresh rate and resolution:
```sh
adb shell dumpsys display | grep -E "refresh|fps|width|height"
```

Set custom resolution (root):
```sh
adb shell wm size 1080x1920
```

Check display configuration changes:
```sh
adb shell dumpsys activity displays | grep -E "width|height"
```

### Examples

Check current screen resolution:
```sh
adb shell wm size
# Output: Physical size: 1080x2400
```

Set lower resolution for performance:
```sh
adb shell wm size 720x1280
```

Restore original resolution:
```sh
adb shell wm size reset
```

Get detailed display info:
```sh
adb shell dumpsys display | grep -E "width|height|density"
```

Check if resolution override is active:
```sh
adb shell dumpsys display | grep -E "override|forced"
```

## Notes
- Resolution changes require system permission or root
- Some devices may not support all resolutions
- Resolution changes may affect app compatibility
- Display cutout affects usable screen area
- Use `wm` commands for window manager operations
- Resolution resets on device reboot unless persistently set
