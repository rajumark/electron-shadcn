# Color Calibration - ADB Commands

## Description
Commands for managing display color settings, color modes, and screen calibration on Android devices.

### Basic Commands

Get color mode:
```sh
adb shell dumpsys display | grep colorMode
```

Get available color modes:
```sh
adb shell dumpsys display | grep supportedColorModes
```

Set natural color mode:
```sh
adb shell cmd display set-color-mode 0
```

Set saturated color mode:
```sh
adb shell cmd display set-color-mode 1
```

Set automatic color mode:
```sh
adb shell cmd display set-color-mode 2
```

### Advanced Commands

Get display color info:
```sh
adb shell dumpsys display | grep -E "color|Color"
```

Check HDR capabilities:
```sh
adb shell dumpsys display | grep -i hdr
```

Get color space info:
```sh
adb shell dumpsys display | grep -E "colorSpace|ColorSpace"
```

Set custom color temperature:
```sh
adb shell settings put system display_color_temperature 6500
```

Get color temperature:
```sh
adb shell settings get system display_color_temperature
```

Check night light status:
```sh
adb shell settings get secure night_display_activated
```

Enable night light:
```sh
adb shell settings put secure night_display_activated 1
```

Disable night light:
```sh
adb shell settings put secure night_display_activated 0
```

Set night light intensity:
```sh
adb shell settings put secure night_display_intensity 0
```

### Examples

Check current color mode:
```sh
adb shell dumpsys display | grep colorMode
# Output: mActiveColorModeId=0 (Natural)
```

List all supported color modes:
```sh
adb shell dumpsys display | grep supportedColorModes
```

Enable night light:
```sh
adb shell settings put secure night_display_activated 1
```

Set night light to 50% intensity:
```sh
adb shell settings put secure night_display_intensity 50
```

Reset color settings:
```sh
adb shell cmd display set-color-mode 0
adb shell settings delete secure night_display_activated
```

## Notes
- Color mode availability varies by device manufacturer
- Color modes: 0=Natural, 1=Saturated, 2=Automatic
- Night light requires Android 7.0+ (API 24+)
- Color temperature values are in Kelvin (typically 2700-6500)
- Some devices may have custom color calibration settings
- HDR content may override color mode settings
- Color calibration may require system permissions or root
- Night light intensity range: 0-100 (percentage)
