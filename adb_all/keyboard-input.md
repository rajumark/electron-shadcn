# Keyboard Input - ADB Commands

## Description
Commands for simulating keyboard input, managing virtual keyboard, and text entry operations on Android devices.

### Basic Commands

Type text:
```sh
adb shell input text "Hello World"
```

Press Enter key:
```sh
adb shell input keyevent KEYCODE_ENTER
```

Press Back key:
```sh
adb shell input keyevent KEYCODE_BACK
```

Press Home key:
```sh
adb shell input keyevent KEYCODE_HOME
```

Press Menu key:
```sh
adb shell input keyevent KEYCODE_MENU
```

### Advanced Commands

Press specific key code:
```sh
adb shell input keyevent 61
```

Type with special characters:
```sh
adb shell input text "Hello@World.com"
```

Simulate keyboard shortcuts:
```sh
adb shell input keyevent KEYCODE_CTRL_LEFT KEYCODE_C
```

Press volume up:
```sh
adb shell input keyevent KEYCODE_VOLUME_UP
```

Press volume down:
```sh
adb shell input keyevent KEYCODE_VOLUME_DOWN
```

Press power button:
```sh
adb shell input keyevent KEYCODE_POWER
```

Type with spaces (URL encoded):
```sh
adb shell input text "Hello%20World"
```

Press Tab key:
```sh
adb shell input keyevent KEYCODE_TAB
```

Press Delete key:
```sh
adb shell input keyevent KEYCODE_DEL
```

### Examples

Type email address:
```sh
adb shell input text "user@example.com"
```

Navigate with arrow keys:
```sh
adb shell input keyevent KEYCODE_DPAD_LEFT
adb shell input keyevent KEYCODE_DPAD_RIGHT
```

Clear text field:
```sh
adb shell input keyevent KEYCODE_MOVE_HOME
for i in {1..50}; do adb shell input keyevent KEYCODE_DEL; done
```

Select all text:
```sh
adb shell input keyevent KEYCODE_CTRL_LEFT KEYCODE_A
```

Copy and paste:
```sh
adb shell input keyevent KEYCODE_CTRL_LEFT KEYCODE_C
adb shell input keyevent KEYCODE_CTRL_LEFT KEYCODE_V
```

## Notes
- Text input requires focus on an editable field
- Special characters may need URL encoding
- Some apps may prevent programmatic input
- Key codes are defined in Android KeyEvent class
- Use `adb shell input keyevent --help` for available keys
- Keyboard shortcuts may not work in all apps
- Some keys require system permissions
- Text input may be blocked on secure screens
