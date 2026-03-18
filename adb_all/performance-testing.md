# Performance Testing - ADB Commands

## Description
Commands for performance testing Android applications, measuring app performance metrics, and optimizing application performance.

### Basic Commands

Measure app startup time:
```sh
adb shell am start -W -n com.example.app/.MainActivity
```

Check app memory usage:
```sh
adb shell dumpsys meminfo com.example.app
```

Monitor CPU usage:
```sh
adb shell top -n 1 | grep com.example.app
```

Check battery usage:
```sh
adb shell dumpsys batterystats | grep com.example.app
```

Measure frame rendering:
```sh
adb shell dumpsys gfxinfo com.example.app
```

### Advanced Commands

Performance profiling:
```sh
adb shell am profile start com.example.app /data/local/tmp/performance.trace
# Perform app actions
adb shell am profile stop com.example.app
```

Measure network performance:
```sh
adb shell dumpsys netstats | grep com.example.app
```

Check disk I/O performance:
```sh
adb shell iotop | grep com.example.app
```

Monitor GPU performance:
```sh
adb shell dumpsys gfxinfo com.example.app framestats
```

Performance stress testing:
```sh
adb shell monkey -p com.example.app --throttle 100 1000
```

Measure app responsiveness:
```sh
adb shell dumpsys activity | grep -E "ANR|stopped|com.example.app"
```

Check thermal performance:
```sh
adb shell cat /sys/class/thermal/thermal_zone*/temp
```

Profile memory leaks:
```sh
adb shell dumpsys meminfo com.example.app | watch -n 5
```

Measure database performance:
```sh
adb shell dumpsys activity provider | grep com.example.app
```

Check storage performance:
```sh
adb shell dd if=/dev/zero of=/sdcard/perf_test bs=1M count=100
```

Monitor network latency:
```sh
adb shell ping -c 10 api.example.com
```

Performance benchmarking:
```sh
adb shell "am start -W -n com.example.app/.MainActivity && dumpsys meminfo com.example.app && dumpsys gfxinfo com.example.app"
```

### Examples

Complete performance test:
```sh
adb shell am start -W -n com.example.app/.MainActivity
adb shell dumpsys meminfo com.example.app
adb shell dumpsys gfxinfo com.example.app
adb shell dumpsys cpuinfo | grep com.example.app
```

Memory leak detection:
```sh
for i in {1..10}; do
  echo "=== Check $i ==="
  adb shell dumpsys meminfo com.example.app | grep TOTAL
  adb shell am force-stop com.example.app
  adb shell am start -n com.example.app/.MainActivity
  sleep 5
done
```

Performance profiling:
```sh
adb shell am profile start com.example.app /data/local/tmp/perf.trace
sleep 30
adb shell am profile stop com.example.app
adb pull /data/local/tmp/perf.trace
```

Stress testing:
```sh
adb shell monkey -p com.example.app --throttle 50 --pct-touch 80 --pct-motion 20 2000
```

## Notes
- Performance testing affects device resources
- Baseline measurements should be established
- Test on various device configurations
- Monitor device temperature during testing
- Performance results vary by device hardware
- Use consistent testing conditions
- Document performance metrics for comparison
- Consider network conditions in performance tests
