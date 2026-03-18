# Device Profiling - ADB Commands

## Description
Commands for device performance profiling, benchmarking, and device capability assessment.

### Basic Commands
CPU benchmark:
```sh
adb shell cat /proc/cpuinfo | grep -E "processor|model name|cpu MHz"
```

Memory benchmark:
```sh
adb shell free -m && cat /proc/meminfo | grep -E "MemTotal|MemFree"
```

Storage benchmark:
```sh
adb shell dd if=/dev/zero of=/sdcard/test bs=1M count=100
```

Network benchmark:
```sh
adb shell ping -c 10 8.8.8.8
```

GPU benchmark:
```sh
adb shell dumpsys gfxinfo
```

### Advanced Commands
Comprehensive device profile:
```sh
echo "=== Device Profile ==="
echo "CPU: $(adb shell cat /proc/cpuinfo | grep "processor" | wc -l) cores"
echo "Memory: $(adb shell free -m | grep Mem | awk '{print $2}')MB"
echo "Storage: $(adb shell df -h /data | tail -1 | awk '{print $2}')"
echo "Android: $(adb shell getprop ro.build.version.release)"
```

Performance stress test:
```sh
adb shell "dd if=/dev/zero of=/dev/null bs=1M count=1000 &"
adb shell "cat /dev/urandom > /dev/null &"
sleep 10
adb shell top -n 1
```

I/O performance test:
```sh
adb shell "dd if=/dev/zero of=/sdcard/write_test bs=1M count=100 && dd if=/sdcard/write_test of=/dev/null bs=1M"
```

CPU load test:
```sh
for i in {1..4}; do
  adb shell "dd if=/dev/zero of=/dev/null &"
done
sleep 5
adb shell top -n 1
```

Memory stress test:
```sh
adb shell "memtester 100M 1"
```

Network latency test:
```sh
adb shell "ping -c 20 8.8.8.8 | tail -1"
```

Display refresh rate:
```sh
adb shell dumpsys display | grep refresh
```

Battery drain test:
```sh
adb shell dumpsys batterystats --reset
# Run device usage
adb shell dumpsys batterystats
```

## Notes
- Benchmarking may affect device performance
- Test results vary by device and conditions
- Repeat tests for accurate measurements
- Document baseline performance for comparison
