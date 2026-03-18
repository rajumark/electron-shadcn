# Load Testing - ADB Commands

## Description
Commands for load testing Android applications, stress testing app performance under heavy load, and measuring system limits.

### Basic Commands

Stress test with monkey:
```sh
adb shell monkey -p com.example.app --throttle 100 5000
```

Memory stress test:
```sh
adb shell monkey -p com.example.app --pct-touch 80 --pct-motion 20 3000
```

CPU stress test:
```sh
adb shell monkey -p com.example.app --throttle 50 10000
```

Monitor during load test:
```sh
adb shell top -n 1 | grep com.example.app
```

Check system resources:
```sh
adb shell free -m && df -h
```

### Advanced Commands

Comprehensive load test:
```sh
#!/bin/bash
echo "=== Load Testing Started ==="
adb shell monkey -p com.example.app --throttle 100 --pct-touch 60 --pct-motion 20 --pct-appswitch 10 --pct-nav 10 5000 &
MONITOR_PID=$!
sleep 60
kill $MONITOR_PID
echo "=== Load Test Complete ==="
```

Concurrent user simulation:
```sh
for i in {1..10}; do
  adb shell am start -n com.example.app/.MainActivity &
done
```

Memory leak detection under load:
```sh
adb shell monkey -p com.example.app --throttle 50 2000 &
for i in {1..20}; do
  echo "=== Memory Check $i ==="
  adb shell dumpsys meminfo com.example.app | grep TOTAL
  sleep 3
done
```

Database load testing:
```sh
adb shell am instrument -w -e class com.example.app.DatabaseLoadTest com.example.app.load.test/androidx.test.runner.AndroidJUnitRunner
```

Network load testing:
```sh
adb shell am instrument -w -e networkLoad true com.example.app.load.test/androidx.test.runner.AndroidJUnitRunner
```

UI load testing:
```sh
adb shell monkey -p com.example.app --pct-touch 70 --pct-motion 30 --throttle 25 10000
```

Background service load test:
```sh
adb shell startservice -n com.example.app/.BackgroundService
adb shell monkey -p com.example.app --throttle 100 2000
```

Multi-process load test:
```sh
adb shell monkey -p com.example.app --throttle 75 3000 &
adb shell monkey -p com.example.app --throttle 75 3000 &
adb shell monkey -p com.example.app --throttle 75 3000
```

System resource monitoring:
```sh
while true; do
  echo "$(date): $(adb shell free -m | grep Mem)"
  echo "$(date): $(adb shell top -n 1 | grep com.example.app)"
  sleep 5
done
```

Thermal stress testing:
```sh
adb shell monkey -p com.example.app --throttle 25 15000
adb shell cat /sys/class/thermal/thermal_zone*/temp
```

Storage load testing:
```sh
adb shell monkey -p com.example.app --throttle 100 5000
adb shell df -h /data
```

Battery drain testing:
```sh
adb shell dumpsys batterystats --reset
adb shell monkey -p com.example.app --throttle 50 8000
adb shell dumpsys batterystats | grep com.example.app
```

### Examples

Basic load test:
```sh
adb shell monkey -p com.example.app --throttle 100 --pct-touch 80 --pct-motion 20 3000
```

Memory stress test with monitoring:
```sh
adb shell monkey -p com.example.app --throttle 50 5000 &
for i in {1..30}; do
  echo "=== Check $i ==="
  adb shell dumpsys meminfo com.example.app | grep TOTAL
  sleep 2
done
```

Comprehensive load test:
```sh
#!/bin/bash
echo "Starting comprehensive load test..."
adb shell monkey -p com.example.app --throttle 100 --pct-touch 60 --pct-motion 20 --pct-appswitch 10 --pct-nav 10 5000 &
MONITOR_PID=$!

for i in {1..60}; do
  echo "$(date): CPU=$(adb shell top -n 1 | grep com.example.app | awk '{print $9}')"
  echo "$(date): MEM=$(adb shell dumpsys meminfo com.example.app | grep TOTAL | awk '{print $2}')"
  sleep 1
done

kill $MONITOR_PID
echo "Load test completed"
```

Battery drain test:
```sh
adb shell dumpsys batterystats --reset
adb shell monkey -p com.example.app --throttle 25 10000
adb shell dumpsys batterystats | grep -A 5 com.example.app
```

## Notes
- Load testing can cause app crashes
- Monitor device temperature during testing
- Load tests should be run on dedicated test devices
- Document load test parameters and results
- System resources affect load test results
- Use consistent test conditions for comparison
- Load testing may impact device stability
- Consider network conditions in load tests
