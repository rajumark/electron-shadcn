# Test Automation - ADB Commands

## Description
Commands for test automation in Android applications, automated testing workflows, and continuous integration testing.

### Basic Commands

Automated test execution:
```sh
adb shell am instrument -w com.example.app.test/androidx.test.runner.AndroidJUnitRunner
```

Batch test execution:
```sh
adb shell am instrument -w com.example.app.unit.test/androidx.test.runner.AndroidJUnitRunner && adb shell am instrument -w com.example.app.ui.test/androidx.test.runner.AndroidJUnitRunner
```

Automated app testing:
```sh
adb shell am start -n com.example.app/.MainActivity
sleep 5
adb shell monkey -p com.example.app 100
```

Test automation script:
```sh
#!/bin/bash
adb shell am instrument -w com.example.app.test/androidx.test.runner.AndroidJUnitRunner
adb shell am start -n com.example.app/.MainActivity
sleep 3
adb shell screencap /sdcard/test_result.png
```

### Advanced Commands

Complete test automation suite:
```sh
#!/bin/bash
echo "=== Automated Test Suite ==="

# Unit tests
echo "Running unit tests..."
adb shell am instrument -w com.example.app.unit.test/androidx.test.runner.AndroidJUnitRunner

# Integration tests
echo "Running integration tests..."
adb shell am instrument -w com.example.app.integration.test/androidx.test.runner.AndroidJUnitRunner

# UI tests
echo "Running UI tests..."
adb shell am instrument -w com.example.app.ui.test/androidx.test.runner.AndroidJUnitRunner

# Performance tests
echo "Running performance tests..."
adb shell am instrument -w com.example.app.performance.test/androidx.test.runner.AndroidJUnitRunner

echo "Test suite completed"
```

Automated regression testing:
```sh
#!/bin/bash
for app in $(adb shell pm list packages | grep example | cut -d: -f2); do
  echo "=== Testing $app ==="
  adb shell am instrument -w $app.test/androidx.test.runner.AndroidJUnitRunner
  adb shell am start -n $app/.MainActivity
  sleep 3
  adb shell screencap /sdcard/${app}_regression.png
done
```

Continuous integration automation:
```sh
#!/bin/bash
# CI/CD test automation
echo "=== CI/CD Test Pipeline ==="

# Clean environment
adb shell pm clear com.example.app

# Install test APK
adb install app-debug.apk
adb install app-debug-androidTest.apk

# Run test suite
adb shell am instrument -w com.example.app.test/androidx.test.runner.AndroidJUnitRunner

# Generate reports
adb pull /sdcard/test-results.xml
adb pull /sdcard/coverage.ec

echo "CI/CD pipeline completed"
```

Automated device testing:
```sh
for device in $(adb devices | grep -v "List" | awk '{print $1}'); do
  echo "=== Testing on $device ==="
  adb -s $device shell am instrument -w com.example.app.test/androidx.test.runner.AndroidJUnitRunner
  adb -s $device shell screencap /sdcard/test_result_${device}.png
done
```

Automated performance monitoring:
```sh
#!/bin/bash
echo "=== Performance Monitoring ==="

# Start performance monitoring
adb shell am profile start com.example.app /data/local/tmp/perf_test.trace

# Run automated tests
adb shell am instrument -w com.example.app.test/androidx.test.runner.AndroidJUnitRunner

# Stop monitoring
adb shell am profile stop com.example.app
adb pull /data/local/tmp/perf_test.trace
```

Automated screenshot testing:
```sh
#!/bin/bash
screenshots=("MainActivity" "SettingsActivity" "ProfileActivity")

for activity in "${screenshots[@]}"; do
  echo "Capturing $activity..."
  adb shell am start -n com.example.app/.$activity
  sleep 3
  adb shell screencap /sdcard/${activity}.png
done

# Pull all screenshots
adb pull /sdcard/*.png ./screenshots/
```

Automated crash detection:
```sh
#!/bin/bash
echo "=== Crash Detection Automation ==="

# Clear logs
adb shell logcat -c

# Run automated tests
adb shell monkey -p com.example.app --throttle 100 1000

# Check for crashes
crashes=$(adb shell logcat -d | grep -c "FATAL.*com.example.app")
echo "Crashes detected: $crashes"

if [ $crashes -gt 0 ]; then
  adb shell logcat -d | grep "FATAL.*com.example.app" > crash_report.txt
fi
```

Automated API testing:
```sh
#!/bin/bash
api_endpoints=("users" "products" "orders")

for endpoint in "${api_endpoints[@]}"; do
  echo "Testing API endpoint: $endpoint"
  adb shell curl -X GET "http://api.example.com/$endpoint" -w "%{http_code}\n"
done
```

### Examples

Simple test automation:
```sh
#!/bin/bash
echo "Starting automated tests..."
adb shell am instrument -w com.example.app.test/androidx.test.runner.AndroidJUnitRunner
if [ $? -eq 0 ]; then
  echo "Tests passed"
else
  echo "Tests failed"
fi
```

Multi-device test automation:
```sh
for device in $(adb devices | grep -v "List" | awk '{print $1}'); do
  echo "Testing on device: $device"
  adb -s $device shell am instrument -w com.example.app.test/androidx.test.runner.AndroidJUnitRunner
done
```

Automated screenshot testing:
```sh
activities=("MainActivity" "SettingsActivity" "ProfileActivity")
for activity in "${activities[@]}"; do
  adb shell am start -n com.example.app/.$activity
  sleep 3
  adb shell screencap /sdcard/${activity}.png
done
adb pull /sdcard/*.png ./screenshots/
```

## Notes
- Test automation saves time and ensures consistency
- Use proper error handling in automation scripts
- Monitor device resources during automated testing
- Document automation procedures for team use
- Test automation should be version controlled
- Use appropriate delays for app loading
- Consider device differences in automation
- Automation scripts should be maintainable
