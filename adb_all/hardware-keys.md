# Hardware Keys - ADB Commands

## Description
Commands for simulating hardware button presses, managing physical keys, and hardware key events on Android devices.

### Basic Commands

Press Power button:
```sh
adb shell input keyevent KEYCODE_POWER
```

Press Volume Up:
```sh
adb shell input keyevent KEYCODE_VOLUME_UP
```

Press Volume Down:
```sh
adb shell input keyevent KEYCODE_VOLUME_DOWN
```

Press Home button:
```sh
adb shell input keyevent KEYCODE_HOME
```

Press Back button:
```sh
adb shell input keyevent KEYCODE_BACK
```

### Advanced Commands

Press Menu button:
```sh
adb shell input keyevent KEYCODE_MENU
```

Press Search button:
```sh
adb shell input keyevent KEYCODE_SEARCH
```

Press Camera button:
```sh
adb shell input keyevent KEYCODE_CAMERA
```

Long press Power button:
```sh
adb shell input keyevent --longpress KEYCODE_POWER
```

Press App Switch button:
```sh
adb shell input keyevent KEYCODE_APP_SWITCH
```

Press Assistant button:
```sh
adb shell input keyevent KEYCODE_VOICE_ASSIST
```

Press Mute button:
```sh
adb shell input keyevent KEYCODE_MUTE
```

Press Headset hook:
```sh
adb shell input keyevent KEYCODE_HEADSETHOOK
```

Press Play/Pause:
```sh
adb shell input keyevent KEYCODE_MEDIA_PLAY_PAUSE
```

### Examples

Turn screen on/off:
```sh
adb shell input keyevent KEYCODE_POWER
```

Volume up sequence:
```sh
for i in {1..5}; do adb shell input keyevent KEYCODE_VOLUME_UP; sleep 0.2; done
```

Long press to power menu:
```sh
adb shell input keyevent --longpress KEYCODE_POWER
```

Simulate camera launch:
```sh
adb shell input keyevent KEYCODE_CAMERA
```

Press recent apps:
```sh
adb shell input keyevent KEYCODE_APP_SWITCH
```

Mute and unmute:
```sh
adb shell input keyevent KEYCODE_MUTE
sleep 2
adb shell input keyevent KEYCODE_MUTE
```

## Notes
- Hardware key simulation may not work on all devices
- Some keys require specific hardware to exist
- Long press support varies by Android version
- Some apps may override hardware key behavior
- Use `adb shell input keyevent --help` for available key codes
- Emergency calls may override key simulations
- Some devices have custom hardware key mappings
- Hardware keys may be disabled in certain modes
