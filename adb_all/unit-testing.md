# Unit Testing - ADB Commands

## Description
Commands for unit testing Android applications, running automated unit tests, and managing test execution through ADB.

### Basic Commands

Run unit tests:
```sh
adb shell am instrument -w com.example.app.test/androidx.test.runner.AndroidJUnitRunner
```

Run specific test class:
```sh
adb shell am instrument -w -e class com.example.app.ExampleTest com.example.app.test/androidx.test.runner.AndroidJUnitRunner
```

Run specific test method:
```sh
adb shell am instrument -w -e class com.example.app.ExampleTest#testMethod com.example.app.test/androidx.test.runner.AndroidJUnitRunner
```

List test packages:
```sh
adb shell pm list packages | grep test
```

Check test runner status:
```sh
adb shell dumpsys activity | grep -E "instrumentation|test"
```

### Advanced Commands

Run tests with coverage:
```sh
adb shell am instrument -w -e coverage true com.example.app.test/androidx.test.runner.AndroidJUnitRunner
```

Generate coverage report:
```sh
adb shell am instrument -w -e coverageFile /sdcard/coverage.ec com.example.app.test/androidx.test.runner.AndroidJUnitRunner
```

Run tests with specific annotations:
```sh
adb shell am instrument -w -e annotation com.example.annotation.SmokeTest com.example.app.test/androidx.test.runner.AndroidJUnitRunner
```

Run tests in parallel:
```sh
adb shell am instrument -w -e numShards 4 -e shardIndex 0 com.example.app.test/androidx.test.runner.AndroidJUnitRunner
```

Run tests with custom arguments:
```sh
adb shell am instrument -w -e key value com.example.app.test/androidx.test.runner.AndroidJUnitRunner
```

Monitor test execution:
```sh
adb shell logcat | grep -E "TestRunner|INSTRUMENTATION|JUnit"
```

Run tests with timeout:
```sh
adb shell am instrument -w -e timeout 30000 com.example.app.test/androidx.test.runner.AndroidJUnitRunner
```

Run tests with specific build variant:
```sh
adb shell am instrument -w -e buildType debug com.example.app.test/androidx.test.runner.AndroidJUnitRunner
```

Check test results:
```sh
adb shell cat /sdcard/test-results.xml
```

Run tests with filtering:
```sh
adb shell am instrument -w -e size small com.example.app.test/androidx.test.runner.AndroidJUnitRunner
```

### Examples

Run all unit tests:
```sh
adb shell am instrument -w com.example.app.test/androidx.test.runner.AndroidJUnitRunner
```

Run specific test class:
```sh
adb shell am instrument -w -e class com.example.app.MainActivityTest com.example.app.test/androidx.test.runner.AndroidJUnitRunner
```

Run tests with coverage:
```sh
adb shell am instrument -w -e coverage true com.example.app.test/androidx.test.runner.AndroidJUnitRunner
adb pull /sdcard/coverage.ec
```

Monitor test execution:
```sh
adb shell logcat | grep -E "TestRunner|INSTRUMENTATION" | tail -20
```

Run smoke tests:
```sh
adb shell am instrument -w -e annotation com.example.annotation.SmokeTest com.example.app.test/androidx.test.runner.AndroidJUnitRunner
```

## Notes
- Unit tests require test APK to be installed
- Test runner must be properly configured in AndroidManifest.xml
- Coverage reports require Jacoco or similar tools
- Test execution may affect app performance
- Use proper test annotations for categorization
- Monitor logcat for detailed test execution information
- Some test options require specific testing frameworks
- Test results can be exported in various formats
