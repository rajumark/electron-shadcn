# Input Devices - ADB Commands

## Description
Commands for managing input devices, listing connected peripherals, and monitoring input hardware on Android devices.

### Basic Commands

List all input devices:
```sh
adb shell getevent -p
```

List input devices by name:
```sh
adb shell cat /proc/bus/input/devices
```

Get touch screen info:
```sh
adb shell dumpsys input | grep -A 10 "TouchScreen"
```

Check keyboard devices:
```sh
adb shell dumpsys input | grep -A 5 "Keyboard"
```

List connected USB devices:
```sh
adb shell lsusb
```

### Advanced Commands

Get detailed input device info:
```sh
adb shell dumpsys input
```

Monitor specific input device:
```sh
adb shell getevent -l /dev/input/event0
```

Check input device capabilities:
```sh
adb shell getevent -i /dev/input/event0
```

Get device driver info:
```sh
adb shell cat /sys/class/input/input*/device/name
```

Monitor all input events:
```sh
adb shell getevent -l
```

Check Bluetooth input devices:
```sh
adb shell settings get global bluetooth_input_devices
```

Get input device configuration:
```sh
adb shell dumpsys input | grep -E "Device|Configuration"
```

Check input device mappings:
```sh
adb shell dumpsys input | grep -E "KeyMap|Layout"
```

Monitor input device connections:
```sh
adb shell logcat | grep -i input
```

Get touch device resolution:
```sh
adb shell cat /sys/class/input/input*/capabilities/abs
```

### Examples

List all input devices with details:
```sh
adb shell cat /proc/bus/input/devices | grep -E "Name|Phys|Handlers"
```

Monitor touch screen events:
```sh
adb shell getevent -l | grep -E "ABS_MT|BTN_TOUCH"
```

Check if mouse is connected:
```sh
adb shell cat /proc/bus/input/devices | grep -i mouse
```

Get keyboard layout info:
```sh
adb shell dumpsys input | grep -A 10 -B 5 "Keyboard"
```

Monitor input device hotplug:
```sh
adb shell logcat | grep -E "input.*connect|input.*disconnect"
```

Check input device permissions:
```sh
adb shell ls -la /dev/input/
```

## Notes
- Input device paths may vary between devices
- Some input devices require root access to monitor
- USB device listing may not work on all Android versions
- Input device monitoring may require specific permissions
- Use `dumpsys input` for comprehensive input system info
- Some input events may be filtered by the system
- Input device capabilities vary by manufacturer
- Not all input devices are accessible via ADB
