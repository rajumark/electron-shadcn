# Gesture Simulation - ADB Commands

## Description
Commands for simulating complex gestures, multi-touch patterns, and advanced touch interactions on Android devices.

### Basic Commands

Simulate swipe gesture:
```sh
adb shell input swipe 100 100 500 1000
```

Simulate pinch zoom in:
```sh
adb shell input pinch 500 1000 200
```

Simulate pinch zoom out:
```sh
adb shell input pinch 500 1000 -200
```

Simulate drag gesture:
```sh
adb shell input draganddrop 100 100 500 1000 1000
```

Simulate fling gesture:
```sh
adb shell input swipe 100 100 800 100 100
```

### Advanced Commands

Simulate complex swipe pattern:
```sh
adb shell input swipe 100 100 300 300 500 100 700 300
```

Simulate circular gesture:
```sh
adb shell input touchscreen swipe 540 960 540 960 360 100
```

Simulate multi-finger gesture:
```sh
adb shell input multitouch 0:400:800:50 1:600:800:50
```

Simulate scroll gesture:
```sh
adb shell input swipe 540 1800 540 400 500
```

Simulate double tap:
```sh
adb shell input tap 500 1000 && sleep 0.1 && adb shell input tap 500 1000
```

Simulate long press with drag:
```sh
adb shell input swipe 500 1000 700 1200 1000
```

Simulate Z-shaped gesture:
```sh
adb shell input swipe 100 100 500 100 500 500 100 500
```

Simulate spiral gesture:
```sh
for i in {1..10}; do
  angle=$((i * 36))
  radius=$((i * 20))
  x=$((540 + radius))
  y=$((960 + radius))
  adb shell input tap $x $y
  sleep 0.1
done
```

Simulate heart shape pattern:
```sh
adb shell input swipe 540 960 400 800 300 900 540 1200 780 900 680 800 540 960
```

### Examples

Unlock pattern simulation:
```sh
# Simulate common unlock pattern (L shape)
adb shell input swipe 300 800 300 1200 600 1200
```

Scroll down gesture:
```sh
adb shell input swipe 540 1000 540 200 300
```

Zoom in gesture:
```sh
adb shell input pinch 540 960 100
```

Draw a square:
```sh
adb shell input swipe 200 200 800 200 800 800 200 800 200 200
```

Complex navigation gesture:
```sh
# Swipe from bottom, pause, then swipe right
adb shell input swipe 540 1800 540 900 500 && sleep 0.5 && adb shell input swipe 540 900 800 900 300
```

## Notes
- Gesture coordinates are in pixels from top-left
- Timing between commands affects gesture realism
- Complex gestures may be detected by some apps
- Multi-touch support varies by Android version
- Use `wm size` to get screen resolution
- Some gestures may not work on secured screens
- Gesture timing may need adjustment per device
- Complex gestures may require root on some devices
