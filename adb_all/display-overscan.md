# Display Overscan - ADB Commands

## Description
Commands for managing display overscan, screen margins, and TV display adjustments on Android devices.

### Basic Commands

Get overscan settings:
```sh
adb shell dumpsys display | grep -i overscan
```

Set overscan for all sides:
```sh
adb shell wm overscan 50,50,50,50
```

Reset overscan to default:
```sh
adb shell wm overscan reset
```

Check current overscan values:
```sh
adb shell getprop persist.sys.overscan
```

Set overscan for specific side:
```sh
adb shell wm overscan 0,0,0,50
```

### Advanced Commands

Get display overscan info:
```sh
adb shell dumpsys display | grep -E "overscan|margin"
```

Set overscan for TV display:
```sh
adb shell wm overscan 40,40,40,40
```

Check overscan compatibility:
```sh
adb shell dumpsys display | grep -E "compatible|overscan"
```

Set overscan with negative values:
```sh
adb shell wm overscan -20,-20,-20,-20
```

Monitor overscan changes:
```sh
adb shell dumpsys display | grep -E "overscan|margins"
```

Get overscan for specific display:
```sh
adb shell dumpsys display | grep -A 10 "DisplayInfo"
```

Set overscan persistently:
```sh
adb shell setprop persist.sys.overscan "50,50,50,50"
```

Check display cutout impact:
```sh
adb shell dumpsys display | grep -E "cutout|insets"
```

Reset overscan via settings:
```sh
adb shell settings delete global overscan
```

Get overscan from properties:
```sh
adb shell getprop | grep overscan
```

### Examples

Set 10% overscan for TV:
```sh
# Assuming 1080p display (1080 * 0.10 = 108)
adb shell wm overscan 108,108,108,108
```

Remove overscan completely:
```sh
adb shell wm overscan reset
```

Set overscan only for bottom:
```sh
adb shell wm overscan 0,0,0,100
```

Check current overscan settings:
```sh
adb shell dumpsys display | grep overscan
```

Set overscan for HDMI output:
```sh
adb shell wm overscan 30,30,30,30
```

## Notes
- Overscan format: left,top,right,bottom (in pixels)
- Use negative values to expand display beyond edges
- Overscan is mainly useful for TV displays
- Some devices may not support overscan adjustments
- Overscan settings may reset on reboot
- Use `wm overscan reset` to restore default display
- Overscan values are in pixels, not percentages
- Some Android TV devices have built-in overscan settings
