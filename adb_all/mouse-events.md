# Mouse Events - ADB Commands

## Description
Commands for simulating mouse input, managing pointer events, and mouse-like interactions on Android devices.

### Basic Commands

Simulate mouse click:
```sh
adb shell input mouse tap 500 1000
```

Simulate mouse move:
```sh
adb shell input mouse move 500 1000
```

Simulate right click:
```sh
adb shell input mouse tap 500 1000 2
```

Simulate mouse scroll:
```sh
adb shell input mouse scroll 500 1000 5
```

Get mouse position:
```sh
adb shell dumpsys input | grep -i pointer
```

### Advanced Commands

Simulate mouse drag:
```sh
adb shell input mouse swipe 100 100 500 1000
```

Simulate mouse double click:
```sh
adb shell input mouse tap 500 1000 && sleep 0.1 && adb shell input mouse tap 500 1000
```

Simulate mouse hover:
```sh
adb shell input mouse move 500 1000
```

Check mouse device status:
```sh
adb shell getevent -p | grep -i mouse
```

Monitor mouse events:
```sh
adb shell getevent -l /dev/input/event0 | grep -E "MOUSE|ABS_X|ABS_Y"
```

Simulate middle click:
```sh
adb shell input mouse tap 500 1000 3
```

Simulate mouse wheel down:
```sh
adb shell input mouse scroll 500 1000 -5
```

Get pointer display info:
```sh
adb shell dumpsys display | grep -i pointer
```

Check touchpad status:
```sh
adb shell dumpsys input | grep -i touchpad
```

Simulate mouse with pressure:
```sh
adb shell input mouse tap 500 1000 1 50
```

### Examples

Click at center of screen:
```sh
adb shell input mouse tap 540 960
```

Draw line with mouse:
```sh
for x in {100..500..20}; do adb shell input mouse move $x 500; sleep 0.1; done
```

Scroll down with mouse:
```sh
adb shell input mouse scroll 540 960 10
```

Right-click menu:
```sh
adb shell input mouse tap 300 400 2
```

Mouse drag and drop:
```sh
adb shell input mouse swipe 200 200 600 600
```

Monitor mouse movement:
```sh
adb shell getevent -l /dev/input/event3 | grep -E "ABS_X|ABS_Y"
```

## Notes
- Mouse support depends on device and Android version
- Coordinates are in pixels from top-left corner
- Some devices may not support all mouse events
- Mouse events may be converted to touch events
- Use `getevent` to monitor actual mouse hardware
- Not all apps handle mouse input properly
- Mouse simulation may require USB OTG or Bluetooth mouse
- Some Android versions have limited mouse support
