# Intent Testing - ADB Commands

## Description
Commands for testing Android intents, launching activities, and intent-based debugging operations.

### Basic Commands

Launch app with intent:
```sh
adb shell am start -n com.example.app/.MainActivity
```

Send broadcast intent:
```sh
adb shell am broadcast -a android.intent.action.BOOT_COMPLETED
```

Start service with intent:
```sh
adb shell am startservice -n com.example.app/.MyService
```

Test intent with extras:
```sh
adb shell am start -n com.example.app/.MainActivity -e key value
```

Force stop app:
```sh
adb shell am force-stop com.example.app
```

### Advanced Commands

Launch app with action:
```sh
adb shell am start -a android.intent.action.VIEW -d http://example.com
```

Test intent filters:
```sh
adb shell am start -a android.intent.action.SEND -t text/plain
```

Launch with data URI:
```sh
adb shell am start -a android.intent.action.VIEW -d content://media/external/images/1
```

Test intent with MIME type:
```sh
adb shell am start -a android.intent.action.VIEW -t image/png
```

Launch with category:
```sh
adb shell am start -a android.intent.action.MAIN -c android.intent.category.LAUNCHER
```

Test intent with flags:
```sh
adb shell am start -n com.example.app/.Activity -f 0x10000000
```

Start service with extras:
```sh
adb shell am startservice -n com.example.app/.MyService -e param value
```

Send broadcast with extras:
```sh
adb shell am broadcast -a com.example.CUSTOM_ACTION -e data "test data"
```

Test deep link:
```sh
adb shell am start -W -a android.intent.action.VIEW -d "exampleapp://path/param" com.example.app
```

Launch with multiple extras:
```sh
adb shell am start -n com.example.app/.Activity -e key1 value1 -e key2 value2
```

Test intent chooser:
```sh
adb shell am start -a android.intent.action.SEND -t text/plain --ez android.intent.extra.CHOOSE_COMPONENT true
```

Monitor intent results:
```sh
adb shell logcat | grep -E "ActivityManager|Intent"
```

Test implicit intent:
```sh
adb shell am start -a android.intent.action.VIEW -d file:///sdcard/test.jpg -t image/jpeg
```

### Examples

Launch app main activity:
```sh
adb shell am start -n com.example.app/.MainActivity
```

Test web URL intent:
```sh
adb shell am start -a android.intent.action.VIEW -d http://google.com
```

Send custom broadcast:
```sh
adb shell am broadcast -a com.example.TEST_ACTION -e message "Hello World"
```

Launch app with data:
```sh
adb shell am start -n com.example.app/.DetailActivity -e id 123
```

Test share intent:
```sh
adb shell am start -a android.intent.action.SEND -t text/plain -e android.intent.extra.TEXT "Shared text"
```

Test deep link:
```sh
adb shell am start -W -a android.intent.action.VIEW -d "myapp://product/123" com.example.app
```

Monitor intent handling:
```sh
adb shell logcat | grep -E "ActivityManager.*Intent|Intent.*handled"
```

## Notes
- Intent testing requires appropriate permissions
- Some intents may be restricted by security policies
- Use `am` command for all intent operations
- Intent extras support various data types
- Some intents require specific app components
- Monitor logcat for intent handling results
- Use flags to control launch behavior
- Intent testing helps validate app flows
