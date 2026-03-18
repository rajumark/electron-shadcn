# Regression Testing - ADB Commands

## Description
Commands for regression testing Android applications, ensuring existing functionality remains intact after code changes.

### Basic Commands

Run regression test suite:
```sh
adb shell am instrument -w com.example.app.regression.test/androidx.test.runner.AndroidJUnitRunner
```

Check app functionality:
```sh
adb shell am start -n com.example.app/.MainActivity
```

Verify core features:
```sh
adb shell am instrument -w -e class com.example.app.CoreFeaturesTest com.example.app.regression.test/androidx.test.runner.AndroidJUnitRunner
```

Check app stability:
```sh
adb shell dumpsys activity | grep -E "ANR|crash|error"
```

Monitor performance regression:
```sh
adb shell dumpsys meminfo com.example.app | grep TOTAL
```

### Advanced Commands

Automated regression testing:
```sh
#!/bin/bash
echo "=== Regression Test Suite ==="
adb shell am instrument -w com.example.app.regression.test/androidx.test.runner.AndroidJUnitRunner
adb shell am start -n com.example.app/.MainActivity
sleep 5
adb shell dumpsys activity | grep -E "ANR|crash"
adb shell dumpsys meminfo com.example.app | grep TOTAL
```

Compare with baseline:
```sh
adb shell dumpsys meminfo com.example.app > current_memory.txt
diff current_memory.txt baseline_memory.txt
```

Test critical user flows:
```sh
adb shell am instrument -w -e class com.example.app.CriticalFlowsTest com.example.app.regression.test/androidx.test.runner.AndroidJUnitRunner
```

Regression smoke testing:
```sh
adb shell am instrument -w -e annotation com.example.annotation.RegressionSmoke com.example.app.regression.test/androidx.test.runner.AndroidJUnitRunner
```

Monitor UI regression:
```sh
adb shell dumpsys gfxinfo com.example.app | grep -E "frames|jank"
```

Test API compatibility regression:
```sh
adb shell am instrument -w -e class com.example.app.ApiCompatibilityTest com.example.app.regression.test/androidx.test.runner.AndroidJUnitRunner
```

Check database regression:
```sh
adb shell am instrument -w -e class com.example.app.DatabaseRegressionTest com.example.app.regression.test/androidx.test.runner.AndroidJUnitRunner
```

Test performance regression:
```sh
adb shell am profile start com.example.app /data/local/tmp/regression_perf.trace
# Perform regression tests
adb shell am profile stop com.example.app
```

Monitor crash regression:
```sh
adb shell logcat -d | grep -E "FATAL|CRASH.*com.example.app" | tail -10
```

Test network regression:
```sh
adb shell am instrument -w -e class com.example.app.NetworkRegressionTest com.example.app.regression.test/androidx.test.runner.AndroidJUnitRunner
```

Regression testing with baseline comparison:
```sh
adb shell am instrument -w -e baseline true com.example.app.regression.test/androidx.test.runner.AndroidJUnitRunner
```

### Examples

Complete regression test suite:
```sh
echo "=== Running Regression Tests ==="
adb shell am instrument -w com.example.app.regression.test/androidx.test.runner.AndroidJUnitRunner
adb shell am start -n com.example.app/.MainActivity
sleep 5
adb shell dumpsys activity | grep -E "ANR|crash"
adb shell dumpsys meminfo com.example.app | grep TOTAL
```

Critical path regression test:
```sh
adb shell am instrument -w -e class com.example.app.CriticalPathTest com.example.app.regression.test/androidx.test.runner.AndroidJUnitRunner
```

Performance regression check:
```sh
adb shell am profile start com.example.app /data/local/tmp/perf_regression.trace
sleep 30
adb shell am profile stop com.example.app
adb pull /data/local/tmp/perf_regression.trace
```

UI regression testing:
```sh
adb shell dumpsys gfxinfo com.example.app > current_ui.txt
diff current_ui.txt baseline_ui.txt
```

## Notes
- Regression tests should cover critical user paths
- Baseline metrics should be established
- Automated regression testing saves time
- Monitor performance metrics for regression
- Document any regression issues found
- Test on multiple device configurations
- Regression tests should run frequently
- Use version control to track regression history
