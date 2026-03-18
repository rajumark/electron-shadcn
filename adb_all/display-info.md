# Display Information - ADB Commands

## Description
Commands for retrieving display information, screen resolution, density, and graphics configuration on Android devices.

### Basic Commands

Get display info:
```sh
adb shell dumpsys display
```

Get screen resolution:
```sh
adb shell wm size
```

Get screen density:
```sh
adb shell wm density
```

Get display metrics:
```sh
adb shell dumpsys window displays
```

Check display rotation:
```sh
adb shell dumpsys display | grep orientation
```

### Advanced Commands

Get physical display size:
```sh
adb shell dumpsys display | grep -E "mBaseDisplayInfo|mPhysicalDisplayInfo"
```

Get refresh rate:
```sh
adb shell dumpsys display | grep refresh
```

Get color mode:
```sh
adb shell dumpsys display | grep colorMode
```

Check HDR capabilities:
```sh
adb shell dumpsys display | grep hdr
```

Get display state:
```sh
adb shell dumpsys display | grep mState
```

Monitor display changes:
```sh
adb shell dumpsys display | grep -E "orientation|density"
```

Get supported modes:
```sh
adb shell dumpsys display | grep supportedModes
```

Check display cutout:
```sh
adb shell dumpsys display | grep cutout
```

Get display scaling:
```sh
adb shell wm density [dpi]
```

### Examples

Check current screen resolution:
```sh
adb shell wm size
# Output: Physical size: 1080x2400
```

Set screen density:
```sh
adb shell wm density 420
```

Reset to default density:
```sh
adb shell wm density reset
```

Get display refresh rate:
```sh
adb shell dumpsys display | grep refresh
```

Check if display supports HDR:
```sh
adb shell dumpsys display | grep -i hdr
```

## Notes
- Display density changes require system permission or root
- Some display settings may not be available on all devices
- Physical display info may not match logical resolution due to scaling
- Display cutout information varies by device
- Use `adb shell dumpsys SurfaceFlinger` for detailed graphics info
- Some commands may not work on older Android versions
