# Screenshot - ADB Commands

## Description
Commands for capturing screenshots, managing screen captures, and screenshot operations on Android devices.

### Basic Commands

Take screenshot:
```sh
adb shell screencap /sdcard/screenshot.png
```

Pull screenshot to computer:
```sh
adb pull /sdcard/screenshot.png
```

Take screenshot with custom name:
```sh
adb shell screencap /sdcard/my_screenshot.png
```

Take screenshot to stdout:
```sh
adb shell screencap -p > screenshot.png
```

Take screenshot with compression:
```sh
adb shell screencap -p /sdcard/compressed.png
```

### Advanced Commands

Take screenshot with specific format:
```sh
adb shell screencap -p /sdcard/screenshot.png
```

Take screenshot to computer directly:
```sh
adb exec-out screencap -p > screenshot.png
```

Take screenshot with timestamp:
```sh
adb shell screencap /sdcard/screenshot_$(date +%Y%m%d_%H%M%S).png
```

Take screenshot of specific window:
```sh
adb shell screencap -w window_id /sdcard/window_screenshot.png
```

Take screenshot with custom display:
```sh
adb shell screencap -d display_id /sdcard/display_screenshot.png
```

Batch screenshot capture:
```sh
for i in {1..5}; do adb shell screencap /sdcard/screenshot_$i.png; sleep 2; done
```

Take screenshot and share:
```sh
adb shell screencap /sdcard/screenshot.png && adb shell am share -a android.intent.action.SEND --type image/png --eu android.intent.extra.STREAM file:///sdcard/screenshot.png
```

Monitor screenshot directory:
```sh
adb shell watch -n 1 "ls -la /sdcard/*.png"
```

Take screenshot with low quality:
```sh
adb shell screencap /sdcard/low_quality.png
```

### Examples

Quick screenshot to desktop:
```sh
adb exec-out screencap -p > ~/Desktop/screenshot.png
```

Automated screenshot series:
```sh
for i in {1..10}; do adb shell screencap /sdcard/auto_$i.png; sleep 5; done
```

Screenshot with timestamp:
```sh
adb shell screencap "/sdcard/screen_$(date +%H%M%S).png"
```

Take screenshot and view immediately:
```sh
adb exec-out screencap -p | open -f -a /Applications/Preview.app
```

## Notes
- Screenshots saved to /sdcard by default
- Use `adb exec-out` for faster direct transfer
- PNG format is default and recommended
- Some devices may require storage permissions
- Screen recording may be interrupted during screenshot
- Large screenshots may take time to transfer
- Use `-p` flag for PNG format output
