# App Automation - ADB Commands

## Description
Commands for automating app interactions, UI automation, and app testing workflows.

### Basic Commands
Launch app:
```sh
adb shell am start -n com.example.app/.MainActivity
```

Force stop app:
```sh
adb shell am force-stop com.example.app
```

Clear app data:
```sh
adb shell pm clear com.example.app
```

Install app:
```sh
adb install app.apk
```

Uninstall app:
```sh
adb uninstall com.example.app
```

### Advanced Commands
Automated app testing sequence:
```sh
adb shell am start -n com.example.app/.MainActivity
sleep 3
adb shell input tap 500 1000
sleep 2
adb shell input text "test"
sleep 1
adb shell input keyevent KEYCODE_ENTER
```

Batch app installation:
```sh
for apk in *.apk; do
  adb install "$apk"
done
```

App performance automation:
```sh
for i in {1..5}; do
  adb shell am start -W -n com.example.app/.MainActivity
  adb shell am force-stop com.example.app
done
```

UI automation script:
```sh
adb shell "input tap 100 200 && sleep 1 && input swipe 100 200 300 400 && sleep 1"
```

App crash monitoring:
```sh
while true; do
  adb shell am start -n com.example.app/.MainActivity
  sleep 10
  adb shell am force-stop com.example.app
done
```

Automated screenshot testing:
```sh
adb shell am start -n com.example.app/.MainActivity
sleep 5
adb shell screencap /sdcard/screen1.png
adb shell input keyevent KEYCODE_BACK
sleep 2
adb shell screencap /sdcard/screen2.png
```

App memory leak testing:
```sh
for i in {1..10}; do
  adb shell am start -n com.example.app/.MainActivity
  sleep 5
  adb shell dumpsys meminfo com.example.app >> memory_test.txt
  adb shell am force-stop com.example.app
done
```

## Notes
- Automation timing may need adjustment per device
- Use appropriate delays for app loading
- Monitor logcat for automation errors
- Test automation on various device configurations
