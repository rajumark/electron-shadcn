# Test Reporting - ADB Commands

## Description
Commands for test reporting in Android applications, generating test reports, and analyzing test results.

### Basic Commands

Generate test report:
```sh
adb shell am instrument -w -e log true com.example.app.test/androidx.test.runner.AndroidJUnitRunner
```

Export test results:
```sh
adb pull /sdcard/test-results.xml
```

Check test coverage:
```sh
adb shell am instrument -w -e coverage true com.example.app.test/androidx.test.runner.AndroidJUnitRunner
```

View test logs:
```sh
adb shell logcat -d | grep -E "TestRunner|INSTRUMENTATION"
```

Generate HTML report:
```sh
adb shell am instrument -w -e reportFormat html com.example.app.test/androidx.test.runner.AndroidJUnitRunner
```

### Advanced Commands

Comprehensive test reporting:
```sh
#!/bin/bash
echo "=== Generating Test Report ==="

# Run tests with detailed reporting
adb shell am instrument -w -e coverage true -e log true com.example.app.test/androidx.test.runner.AndroidJUnitRunner

# Pull all report files
adb pull /sdcard/test-results.xml
adb pull /sdcard/coverage.ec
adb pull /sdcard/test-report.html

# Generate summary report
cat > test_summary.txt << EOF
Test Report Summary
==================
Generated: $(date)
Test Results: $(cat test-results.xml | grep -c "test")
Failed Tests: $(cat test-results.xml | grep -c "failure")
Coverage: $(cat coverage.ec | wc -l)
EOF

echo "Test report generated successfully"
```

Generate performance report:
```sh
#!/bin/bash
echo "=== Performance Test Report ==="

# Run performance tests
adb shell am instrument -w com.example.app.performance.test/androidx.test.runner.AndroidJUnitRunner

# Collect performance metrics
adb shell dumpsys meminfo com.example.app > performance_memory.txt
adb shell dumpsys cpuinfo > performance_cpu.txt
adb shell dumpsys gfxinfo com.example.app > performance_gpu.txt

# Generate performance report
cat > performance_report.html << EOF
<!DOCTYPE html>
<html>
<head><title>Performance Test Report - $(date)</title></head>
<body>
<h1>Performance Test Report</h1>
<p>Generated on: $(date)</p>
<h2>Memory Usage</h2>
<pre>$(cat performance_memory.txt)</pre>
<h2>CPU Usage</h2>
<pre>$(cat performance_cpu.txt)</pre>
<h2>GPU Performance</h2>
<pre>$(cat performance_gpu.txt)</pre>
</body>
</html>
EOF

echo "Performance report generated"
```

Test result analysis:
```sh
#!/bin/bash
echo "=== Test Result Analysis ==="

# Analyze test results
total_tests=$(grep -c "test" test-results.xml)
failed_tests=$(grep -c "failure" test-results.xml)
passed_tests=$((total_tests - failed_tests))

echo "Total Tests: $total_tests"
echo "Passed: $passed_tests"
echo "Failed: $failed_tests"
echo "Success Rate: $((passed_tests * 100 / total_tests))%"

# Generate failure analysis
if [ $failed_tests -gt 0 ]; then
  echo "=== Failed Tests Analysis ==="
  grep -A 5 "failure" test-results.xml > failed_tests.txt
  echo "Failed tests details saved to failed_tests.txt"
fi
```

Multi-device test reporting:
```sh
#!/bin/bash
echo "=== Multi-Device Test Report ==="

# Create report directory
mkdir -p multi_device_report

# Test on each device and generate report
for device in $(adb devices | grep -v "List" | awk '{print $1}'); do
  echo "Testing device: $device"
  
  # Run tests
  adb -s $device shell am instrument -w com.example.app.test/androidx.test.runner.AndroidJUnitRunner
  
  # Pull device-specific reports
  adb -s $device pull /sdcard/test-results.xml multi_device_report/test_results_${device}.xml
  adb -s $device pull /sdcard/coverage.ec multi_device_report/coverage_${device}.ec
  
  # Get device info
  adb -s $device shell getprop ro.product.model > multi_device_report/device_info_${device}.txt
done

# Generate consolidated report
cat > multi_device_report/consolidated_report.html << EOF
<!DOCTYPE html>
<html>
<head><title>Multi-Device Test Report - $(date)</title></head>
<body>
<h1>Multi-Device Test Report</h1>
<p>Generated on: $(date)</p>
<h2>Device Summary</h2>
<table border="1">
<tr><th>Device</th><th>Model</th><th>Total Tests</th><th>Failed</th><th>Success Rate</th></tr>
EOF

# Add device results to report
for device in $(adb devices | grep -v "List" | awk '{print $1}'); do
  model=$(cat multi_device_report/device_info_${device}.txt)
  total=$(grep -c "test" multi_device_report/test_results_${device}.xml)
  failed=$(grep -c "failure" multi_device_report/test_results_${device}.xml)
  success_rate=$(((total - failed) * 100 / total))
  
  echo "<tr><td>$device</td><td>$model</td><td>$total</td><td>$failed</td><td>${success_rate}%</td></tr>" >> multi_device_report/consolidated_report.html
done

echo "</table></body></html>" >> multi_device_report/consolidated_report.html

echo "Multi-device test report generated"
```

Automated report distribution:
```sh
#!/bin/bash
echo "=== Automated Report Distribution ==="

# Generate reports
./generate_test_report.sh
./generate_performance_report.sh

# Send reports via email
mail -s "Test Report - $(date)" team@example.com < test_summary.txt
mail -s "Performance Report - $(date)" team@example.com < performance_report.html

# Upload to cloud storage
aws s3 cp test-results.xml s3://test-reports/$(date +%Y%m%d)/
aws s3 cp performance_report.html s3://test-reports/$(date +%Y%m%d)/

# Generate webhook notification
curl -X POST https://hooks.slack.com/webhook \
  -H 'Content-type: application/json' \
  --data "{\"text\":\"Test report generated for $(date). Success rate: $success_rate%\"}"

echo "Reports distributed successfully"
```

Test trend analysis:
```sh
#!/bin/bash
echo "=== Test Trend Analysis ==="

# Collect historical test data
mkdir -p test_trends

# Get current test results
current_date=$(date +%Y%m%d)
cp test-results.xml test_trends/test_results_${current_date}.xml

# Analyze trends over last 30 days
echo "=== 30-Day Test Trend Analysis ==="
for i in {1..30}; do
  date_str=$(date -d "$i days ago" +%Y%m%d)
  if [ -f "test_trends/test_results_${date_str}.xml" ]; then
    total=$(grep -c "test" test_trends/test_results_${date_str}.xml)
    failed=$(grep -c "failure" test_trends/test_results_${date_str}.xml)
    success_rate=$(((total - failed) * 100 / total))
    echo "$date_str: ${success_rate}% success rate"
  fi
done

# Generate trend chart data
echo "date,success_rate" > test_trends.csv
for i in {1..30}; do
  date_str=$(date -d "$i days ago" +%Y%m%d)
  if [ -f "test_trends/test_results_${date_str}.xml" ]; then
    total=$(grep -c "test" test_trends/test_results_${date_str}.xml)
    failed=$(grep -c "failure" test_trends/test_results_${date_str}.xml)
    success_rate=$(((total - failed) * 100 / total))
    echo "$date_str,$success_rate" >> test_trends.csv
  fi
done

echo "Test trend analysis completed"
```

### Examples

Generate basic test report:
```sh
adb shell am instrument -w -e coverage true com.example.app.test/androidx.test.runner.AndroidJUnitRunner
adb pull /sdcard/test-results.xml
cat test-results.xml
```

Generate performance report:
```sh
adb shell dumpsys meminfo com.example.app > memory_report.txt
adb shell dumpsys cpuinfo > cpu_report.txt
cat > performance_summary.txt << EOF
Performance Summary - $(date)
Memory Usage: $(grep TOTAL memory_report.txt)
CPU Usage: $(grep com.example.app cpu_report.txt)
EOF
```

Multi-device report:
```sh
for device in $(adb devices | grep -v "List" | awk '{print $1}'); do
  adb -s $device shell am instrument -w com.example.app.test/androidx.test.runner.AndroidJUnitRunner
  adb -s $device pull /sdcard/test-results.xml report_${device}.xml
done
```

## Notes
- Test reports provide valuable insights into app quality
- Different report formats serve different purposes
- Historical data helps identify trends
- Automated reporting saves time and ensures consistency
- Report distribution keeps team informed
- Consider security when sharing test reports
- Use visualization tools for better data presentation
- Regular review of reports helps improve testing strategy
