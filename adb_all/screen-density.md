# Screen Density - ADB Commands

## Description
Commands for managing screen density (DPI), display scaling, and pixel density settings on Android devices.

### Basic Commands

Get current density:
```sh
adb shell wm density
```

Get display density info:
```sh
adb shell dumpsys display | grep density
```

Check default density:
```sh
adb shell wm density
# Output: Physical density: 420
```

Get density buckets:
```sh
adb shell dumpsys display | grep -E "densityDpi|defaultDensity"
```

### Advanced Commands

Set custom density:
```sh
adb shell wm density 480
```

Reset to default density:
```sh
adb shell wm density reset
```

Get all density values:
```sh
adb shell dumpsys display | grep -i density
```

Check density compatibility:
```sh
adb shell dumpsys display | grep -E "smallestWidth|compatibleWidth"
```

Monitor density changes:
```sh
adb shell dumpsys display | grep -E "density|scaling"
```

Get logical density:
```sh
adb shell wm density
```

Check density override status:
```sh
adb shell getprop persist.sys.display.density
```

Set density for specific display:
```sh
adb shell wm density 480 0
```

Check density scaling factor:
```sh
adb shell dumpsys display | grep -E "scale|factor"
```

### Examples

Check current screen density:
```sh
adb shell wm density
# Output: Physical density: 420
```

Set higher density for smaller UI:
```sh
adb shell wm density 560
```

Set lower density for larger UI:
```sh
adb shell wm density 320
```

Restore default density:
```sh
adb shell wm density reset
```

Check density override persistence:
```sh
adb shell getprop | grep density
```

Get density and resolution together:
```sh
adb shell wm size && adb shell wm density
```

## Notes
- Density changes require system permission or root
- Common density values: 120 (ldpi), 160 (mdpi), 240 (hdpi), 320 (xhdpi), 480 (xxhdpi), 640 (xxxhdpi)
- Density changes affect app layout and text size
- Some apps may not render correctly at non-standard densities
- Density changes reset on device reboot unless persistently set
- Use `adb shell dumpsys display` for comprehensive display information
- Density changes may impact app compatibility and performance
