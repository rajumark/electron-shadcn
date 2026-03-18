# UI Testing - ADB Commands

## Description
Commands for UI testing Android applications, automating user interface interactions, and managing UI test execution.

### Basic Commands

Run UI tests:
```sh
adb shell am instrument -w com.example.app.ui.test/androidx.test.runner.AndroidJUnitRunner
```

Launch app for UI testing:
```sh
adb shell am start -n com.example.app/.MainActivity
```

Take screenshot during test:
```sh
adb shell screencap /sdcard/ui_test.png
```

Record screen during UI test:
```sh
adb shell screenrecord /sdcard/ui_test.mp4
```

Check UI components:
```sh
adb shell dumpsys activity top | grep -E "View|Activity"
```

### Advanced Commands

Run UI tests with Espresso:
```sh
adb shell am instrument -w com.example.app.ui.test/androidx.test.runner.AndroidJUnitRunner
```

Test specific UI flow:
```sh
adb shell am instrument -w -e class com.example.app.LoginFlowTest com.example.app.ui.test/androidx.test.runner.AndroidJUnitRunner
```

Test UI accessibility:
```sh
adb shell am instrument -w -e accessibilityTests true com.example.app.ui.test/androidx.test.runner.AndroidJUnitRunner
```

Run UI tests on specific device:
```sh
adb -s device_id shell am instrument -w com.example.app.ui.test/androidx.test.runner.AndroidJUnitRunner
```

Test UI performance:
```sh
adb shell am instrument -w -e performanceTests true com.example.app.ui.test/androidx.test.runner.AndroidJUnitRunner
```

Monitor UI test execution:
```sh
adb shell logcat | grep -E "UI|Espresso|View|Activity"
```

Test UI on different screen sizes:
```sh
adb shell wm size 1080x1920
adb shell am instrument -w com.example.app.ui.test/androidx.test.runner.AndroidJUnitRunner
```

Test UI with different orientations:
```sh
adb shell content insert --uri content://settings/system --bind name:s:accelerometer_rotation --bind value:i:1
adb shell am instrument -w com.example.app.ui.test/androidx.test.runner.AndroidJUnitRunner
```

Test UI with different themes:
```sh
adb shell uiautomator dump && adb shell uiautomator dump /sdcard/ui_dump.xml
```

Run UI tests with mock data:
```sh
adb shell am instrument -w -e mockData true com.example.app.ui.test/androidx.test.runner.AndroidJUnitRunner
```

Test UI animations:
```sh
adb shell settings put global window_animation_scale 1
adb shell am instrument -w com.example.app.ui.test/androidx.test.runner.AndroidJUnitRunner
```

Check UI hierarchy:
```sh
adb shell uiautomator dump && adb pull /sdcard/window_dump.xml
```

### Examples

Run complete UI test suite:
```sh
adb shell am instrument -w com.example.app.ui.test/androidx.test.runner.AndroidJUnitRunner
```

Test specific UI flow:
```sh
adb shell am instrument -w -e class com.example.app.LoginFlowTest com.example.app.ui.test/androidx.test.runner.AndroidJUnitRunner
```

Capture UI test screenshots:
```sh
adb shell screencap /sdcard/ui_test_before.png
adb shell am instrument -w com.example.app.ui.test/androidx.test.runner.AndroidJUnitRunner
adb shell screencap /sdcard/ui_test_after.png
```

Monitor UI test execution:
```sh
adb shell logcat | grep -E "UI|Espresso|View" | tail -20
```

Test UI on different screen sizes:
```sh
adb shell wm size 720x1280
adb shell am instrument -w com.example.app.ui.test/androidx.test.runner.AndroidJUnitRunner
adb shell wm size reset
```

## Notes
- UI tests require app to be in foreground
- Screen recordings may impact test performance
- UI tests can be flaky due to timing issues
- Use proper waiting strategies for UI elements
- Monitor device performance during UI testing
- Some UI tests may require specific permissions
- Screen orientation affects UI test results
- Use accessibility testing for inclusive design
