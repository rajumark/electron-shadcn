# Emulator Control - ADB Commands

## Description
Commands for controlling Android emulators, managing virtual devices, and emulator-specific operations.

### Basic Commands
List running emulators:
```sh
adb devices | grep emulator
```

Start emulator:
```sh
emulator -avd avd_name
```

Stop emulator:
```sh
adb -s emulator-5554 emu kill
```

Check emulator status:
```sh
adb -s emulator-5554 shell getprop ro.kernel.qemu
```

### Advanced Commands
Control emulator network:
```sh
adb -s emulator-5554 emu network status
adb -s emulator-5554 emu network delay 100ms
```

Emulator GPS simulation:
```sh
adb -s emulator-5554 emu geo fix 37.7749 -122.4194
```

Control emulator speed:
```sh
adb -s emulator-5554 emu window scale 0.5
```

Emulator screenshot:
```sh
adb -s emulator-5554 emu screenrecord screenshot.png
```

Emulator file transfer:
```sh
adb -s emulator-5554 push file.txt /sdcard/
```

Emulator performance monitoring:
```sh
adb -s emulator-5554 shell top -n 1
```

## Notes
- Emulator commands require running emulator instance
- Use emulator-5554, emulator-5556, etc. for specific instances
- Some emulator features may not work on all versions
- Emulator control helps with automated testing
