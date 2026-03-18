# Text Input - ADB Commands

## Description
Commands for text entry, keyboard simulation, and managing text input operations on Android devices.

### Basic Commands

Type text:
```sh
adb shell input text "Hello World"
```

Type with spaces:
```sh
adb shell input text "Hello%20World"
```

Type email address:
```sh
adb shell input text "user@example.com"
```

Type numbers:
```sh
adb shell input text "1234567890"
```

Type special characters:
```sh
adb shell input text "Hello@World!"
```

### Advanced Commands

Type with URL encoding:
```sh
adb shell input text "Hello%20%26%20World"
```

Type with newlines:
```sh
adb shell input text "Line1%0ALine2"
```

Type with quotes:
```sh
adb shell input text "Hello%22World%22"
```

Type with backspace:
```sh
adb shell input keyevent KEYCODE_DEL
```

Clear entire field:
```sh
adb shell input keyevent KEYCODE_MOVE_HOME
for i in {1..100}; do adb shell input keyevent KEYCODE_DEL; done
```

Type with cursor movement:
```sh
adb shell input keyevent KEYCODE_MOVE_END
adb shell input text " appended text"
```

Select all text:
```sh
adb shell input keyevent KEYCODE_CTRL_LEFT KEYCODE_A
```

Copy text:
```sh
adb shell input keyevent KEYCODE_CTRL_LEFT KEYCODE_C
```

Paste text:
```sh
adb shell input keyevent KEYCODE_CTRL_LEFT KEYCODE_V
```

Type with emoji:
```sh
adb shell input text "Hello😊World"
```

### Examples

Type login credentials:
```sh
adb shell input text "username"
adb shell input keyevent KEYCODE_TAB
adb shell input text "password"
```

Type URL with special characters:
```sh
adb shell input text "https%3A%2F%2Fexample.com%2Fpage%3Fid%3D123"
```

Type multiline text:
```sh
adb shell input text "First%0ASecond%0AThird"
```

Replace text in field:
```sh
adb shell input keyevent KEYCODE_CTRL_LEFT KEYCODE_A
adb shell input text "New text"
```

Type with delay between characters:
```sh
echo "Hello World" | grep -o . | while read char; do
  adb shell input text "$char"
  sleep 0.1
done
```

## Notes
- Text input requires focus on editable field
- Special characters need URL encoding (% codes)
- Some characters may not work in all keyboards
- Text input may be blocked on secure screens
- Use `input text` for simple text entry
- Complex text may need multiple commands
- Keyboard behavior varies by input method
- Some apps detect programmatic text input
