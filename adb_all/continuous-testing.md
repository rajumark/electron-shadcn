# Continuous Testing - ADB Commands

## Description
Commands for continuous testing in Android applications, CI/CD integration, and automated testing pipelines.

### Basic Commands

Automated test execution:
```sh
adb shell am instrument -w com.example.app.test/androidx.test.runner.AndroidJUnitRunner
```

Test pipeline automation:
```sh
adb shell am instrument -w com.example.app.unit.test/androidx.test.runner.AndroidJUnitRunner && adb shell am instrument -w com.example.app.ui.test/androidx.test.runner.AndroidJUnitRunner
```

Continuous integration testing:
```sh
#!/bin/bash
echo "=== CI/CD Test Pipeline ==="
adb shell am instrument -w com.example.app.test/androidx.test.runner.AndroidJUnitRunner
if [ $? -eq 0 ]; then
  echo "All tests passed"
  exit 0
else
  echo "Tests failed"
  exit 1
fi
```

### Advanced Commands

Complete CI/CD pipeline:
```sh
#!/bin/bash
echo "=== Continuous Testing Pipeline ==="

# Environment setup
echo "Setting up test environment..."
adb shell pm clear com.example.app
adb shell settings put global airplane_mode_on 0

# Install applications
echo "Installing test APKs..."
adb install app-debug.apk
adb install app-debug-androidTest.apk

# Unit tests
echo "Running unit tests..."
adb shell am instrument -w com.example.app.unit.test/androidx.test.runner.AndroidJUnitRunner
UNIT_TESTS=$?

# Integration tests
echo "Running integration tests..."
adb shell am instrument -w com.example.app.integration.test/androidx.test.runner.AndroidJUnitRunner
INTEGRATION_TESTS=$?

# UI tests
echo "Running UI tests..."
adb shell am instrument -w com.example.app.ui.test/androidx.test.runner.AndroidJUnitRunner
UI_TESTS=$?

# Performance tests
echo "Running performance tests..."
adb shell am instrument -w com.example.app.performance.test/androidx.test.runner.AndroidJUnitRunner
PERFORMANCE_TESTS=$?

# Generate reports
echo "Generating test reports..."
adb pull /sdcard/test-results.xml
adb pull /sdcard/coverage.ec

# Cleanup
echo "Cleaning up..."
adb shell pm clear com.example.app

# Exit with appropriate code
if [ $UNIT_TESTS -eq 0 ] && [ $INTEGRATION_TESTS -eq 0 ] && [ $UI_TESTS -eq 0 ] && [ $PERFORMANCE_TESTS -eq 0 ]; then
  echo "All tests passed successfully"
  exit 0
else
  echo "Some tests failed"
  exit 1
fi
```

Continuous deployment testing:
```sh
#!/bin/bash
echo "=== Continuous Deployment Testing ==="

# Test on multiple devices
for device in $(adb devices | grep -v "List" | awk '{print $1}'); do
  echo "=== Testing on device: $device ==="
  
  # Install app
  adb -s $device install -r app-release.apk
  
  # Run smoke tests
  adb -s $device shell am instrument -w com.example.app.smoke.test/androidx.test.runner.AndroidJUnitRunner
  SMOKE_TESTS=$?
  
  # Run regression tests
  adb -s $device shell am instrument -w com.example.app.regression.test/androidx.test.runner.AndroidJUnitRunner
  REGRESSION_TESTS=$?
  
  if [ $SMOKE_TESTS -eq 0 ] && [ $REGRESSION_TESTS -eq 0 ]; then
    echo "Device $device: All tests passed"
  else
    echo "Device $device: Tests failed"
    exit 1
  fi
done

echo "All devices passed deployment testing"
```

Automated nightly testing:
```sh
#!/bin/bash
echo "=== Nightly Test Suite ==="

# Comprehensive test suite
TEST_SUITES=("unit" "integration" "ui" "performance" "security" "accessibility")

for suite in "${TEST_SUITES[@]}"; do
  echo "=== Running $suite tests ==="
  adb shell am instrument -w com.example.app.${suite}.test/androidx.test.runner.AndroidJUnitRunner
  
  if [ $? -ne 0 ]; then
    echo "$suite tests failed"
    # Send notification
    echo "$suite tests failed on $(date)" | mail -s "Test Failure" team@example.com
  fi
done

echo "Nightly testing completed"
```

Continuous monitoring testing:
```sh
#!/bin/bash
echo "=== Continuous Monitoring ==="

# Monitor app performance continuously
while true; do
  echo "$(date): Running health checks..."
  
  # Check app responsiveness
  adb shell am start -n com.example.app/.MainActivity
  sleep 3
  adb shell dumpsys activity | grep -q "com.example.app" && echo "App responsive" || echo "App not responding"
  
  # Check memory usage
  MEMORY=$(adb shell dumpsys meminfo com.example.app | grep TOTAL | awk '{print $2}')
  echo "$(date): Memory usage: $MEMORY KB"
  
  # Check battery usage
  BATTERY=$(adb shell dumpsys batterystats | grep com.example.app | wc -l)
  echo "$(date): Battery usage entries: $BATTERY"
  
  sleep 300  # Check every 5 minutes
done
```

Automated test reporting:
```sh
#!/bin/bash
echo "=== Test Reporting ==="

# Run all tests
adb shell am instrument -w com.example.app.test/androidx.test.runner.AndroidJUnitRunner

# Generate comprehensive report
cat > test_report.html << EOF
<!DOCTYPE html>
<html>
<head><title>Test Report - $(date)</title></head>
<body>
<h1>Automated Test Report</h1>
<p>Generated on: $(date)</p>
<h2>Test Results</h2>
<pre>
$(adb shell cat /sdcard/test-results.xml)
</pre>
<h2>Coverage Report</h2>
<pre>
$(adb shell cat /sdcard/coverage.ec)
</pre>
<h2>Device Information</h2>
<pre>
$(adb shell getprop ro.product.model)
$(adb shell getprop ro.build.version.release)
</pre>
</body>
</html>
EOF

# Send report
mail -s "Test Report - $(date)" team@example.com < test_report.html
```

Parallel test execution:
```sh
#!/bin/bash
echo "=== Parallel Test Execution ==="

# Run tests in parallel on multiple devices
devices=($(adb devices | grep -v "List" | awk '{print $1}'))
test_suites=("unit" "integration" "ui")

for i in "${!devices[@]}"; do
  device=${devices[$i]}
  suite=${test_suites[$((i % ${#test_suites[@]}))]}
  
  echo "Running $suite tests on $device..."
  adb -s $device shell am instrument -w com.example.app.${suite}.test/androidx.test.runner.AndroidJUnitRunner &
done

# Wait for all tests to complete
wait

echo "Parallel test execution completed"
```

### Examples

Simple CI pipeline:
```sh
#!/bin/bash
echo "Starting CI pipeline..."
adb shell am instrument -w com.example.app.test/androidx.test.runner.AndroidJUnitRunner
if [ $? -eq 0 ]; then
  echo "CI pipeline: SUCCESS"
  exit 0
else
  echo "CI pipeline: FAILED"
  exit 1
fi
```

Multi-device continuous testing:
```sh
for device in $(adb devices | grep -v "List" | awk '{print $1}'); do
  echo "Testing on $device..."
  adb -s $device shell am instrument -w com.example.app.test/androidx.test.runner.AndroidJUnitRunner
done
```

Automated test reporting:
```sh
adb shell am instrument -w com.example.app.test/androidx.test.runner.AndroidJUnitRunner
adb pull /sdcard/test-results.xml
cat test_report.html | mail -s "Test Results" team@example.com
```

## Notes
- Continuous testing requires proper CI/CD infrastructure
- Test environments should be consistent
- Monitor test execution times and resource usage
- Implement proper error handling and notifications
- Use version control for test scripts
- Consider parallel execution for faster feedback
- Document test pipeline procedures
- Regular maintenance of test infrastructure required
