# Touch Events - ADB Commands

## Description
Commands for simulating touch screen events, managing touch input, and touch gesture operations on Android devices.

### Basic Commands

Simulate single tap:
```sh
adb shell input tap 500 1000
```

Simulate swipe:
```sh
adb shell input swipe 100 100 500 1000
```

Simulate long press:
```sh
adb shell input swipe 500 1000 500 1000 1000
```

Get touch screen info:
```sh
adb shell getevent -l
```

List input devices:
```sh
adb shell getevent -p
```

### Advanced Commands

Simulate multi-touch:
```sh
adb shell input multitouch 0:500:1000:50 1:600:1100:50
```

Simulate pinch gesture:
```sh
adb shell input pinch 500 1000 200
```

Simulate drag and drop:
```sh
adb shell input draganddrop 100 100 500 1000 1000
```

Monitor touch events:
```sh
adb shell getevent /dev/input/event0 | grep -E "ABS_MT|BTN_TOUCH"
```

Simulate touch with pressure:
```sh
adb shell input tap --pressure 50 500 1000
```

Get touch device details:
```sh
adb shell cat /proc/bus/input/devices | grep -i touch
```

Simulate double tap:
```sh
adb shell input tap 500 1000 && sleep 0.1 && adb shell input tap 500 1000
```

Create touch pattern:
```sh
for x in {100..500..100}; do adb shell input tap $x 1000; sleep 0.2; done
```

Simulate touch with duration:
```sh
adb shell input touchscreen tap 500 1000 500
```

### Examples

Tap center of screen:
```sh
adb shell input tap 540 960
```

Swipe from bottom to top (unlock gesture):
```sh
adb shell input swipe 540 1800 540 400
```

Draw a circle with touches:
```sh
for angle in {0..360..30}; do
  x=$((540 + 200 * $(echo "s($angle * 3.14159 / 180)" | bc -l)))
  y=$((960 + 200 * $(echo "c($angle * 3.14159 / 180)" | bc -l)))
  adb shell input tap $x $y
  sleep 0.1
done
```

Monitor real touch events:
```sh
adb shell getevent -l /dev/input/event1
```

Simulate typing with touch:
```sh
adb shell input text "Hello World"
```

## Notes
- Coordinates are in pixels from top-left (0,0)
- Use `adb shell wm size` to get screen resolution
- Touch simulation may not work on secured screens
- Some apps may detect simulated touches
- Multi-touch commands vary by Android version
- Use `getevent` to monitor actual touch hardware events
- Touch events require appropriate permissions
- Some devices may have different input device paths
