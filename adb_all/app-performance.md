# App Performance - ADB Commands

## Description
Commands for monitoring and analyzing Android application performance, including memory usage, CPU consumption, and rendering performance.

### Basic Commands

Get app memory usage:
```sh
adb shell dumpsys meminfo com.example.app
```

Monitor app CPU usage:
```sh
adb shell top | grep com.example.app
```

Get app process info:
```sh
adb shell ps | grep com.example.app
```

### Advanced Commands

Start detailed memory profiling:
```sh
adb shell am profile start com.example.app
```

Stop memory profiling:
```sh
adb shell am profile stop com.example.app
```

Get GPU rendering info:
```sh
adb shell dumpsys gfxinfo com.example.app
```

Get frame rendering stats:
```sh
adb shell dumpsys gfxinfo com.example.app framestats
```

Get app battery usage:
```sh
adb shell dumpsys batterystats | grep com.example.app
```

Monitor app network usage:
```sh
adb shell cat /proc/net/dev | grep -E "(wlan0|rmnet0)"
```

Get app storage usage:
```sh
adb shell dumpsys diskstats | grep com.example.app
```

Start CPU profiling:
```sh
adb shell am start --start-profiler com.example.app/.MainActivity
```

Get app heap info:
```sh
adb shell dumpsys meminfo com.example.app -d
```

Monitor app threads:
```sh
adb shell ps -T | grep com.example.app
```

Get app I/O statistics:
```sh
adb shell cat /proc/<pid>/io
```

Monitor app wake locks:
```sh
adb shell dumpsys power | grep com.example.app
```

Get app thermal state:
```sh
adb shell dumpsys thermalservice
```

### Examples

Performance monitoring script:
```sh
#!/bin/bash
PACKAGE="com.example.app"

echo "=== Performance Monitoring for $PACKAGE ==="

# Get initial memory info
echo "Initial memory usage:"
adb shell dumpsys meminfo "$PACKAGE" | grep TOTAL

# Start app
echo "Starting app..."
adb shell am start -n "$PACKAGE/.MainActivity"

# Monitor for 30 seconds
echo "Monitoring performance for 30 seconds..."
for i in {1..6}; do
    echo "--- Check $i/6 ---"
    echo "Memory:"
    adb shell dumpsys meminfo "$PACKAGE" | grep TOTAL
    echo "CPU:"
    adb shell top -n 1 | grep "$PACKAGE"
    sleep 5
done
```

GPU performance analysis:
```sh
#!/bin/bash
PACKAGE="com.example.app"

echo "=== GPU Performance Analysis ==="

# Reset gfxinfo
adb shell dumpsys gfxinfo "$PACKAGE" reset

# Start app
echo "Starting app and collecting GPU data..."
adb shell am start -n "$PACKAGE/.MainActivity"

# Let app run
sleep 10

# Get GPU stats
echo "GPU rendering statistics:"
adb shell dumpsys gfxinfo "$PACKAGE"

# Get frame stats
echo -e "\nFrame statistics:"
adb shell dumpsys gfxinfo "$PACKAGE" framestats
```

Memory leak detection:
```sh
#!/bin/bash
PACKAGE="com.example.app"

echo "=== Memory Leak Detection ==="

# Force stop app
adb shell am force-stop "$PACKAGE"

# Get baseline memory
echo "Getting baseline memory..."
adb shell am start -n "$PACKAGE/.MainActivity"
sleep 3
BASELINE_MEMORY=$(adb shell dumpsys meminfo "$PACKAGE" | grep TOTAL | awk '{print $2}')
echo "Baseline memory: $BASELINE_MEMORY KB"

# Perform memory-intensive operations
echo "Performing memory operations..."
for i in {1..10}; do
    echo "Operation $i/10"
    # Simulate user interaction
    adb shell input tap 500 500
    sleep 2
done

# Check final memory
FINAL_MEMORY=$(adb shell dumpsys meminfo "$PACKAGE" | grep TOTAL | awk '{print $2}')
echo "Final memory: $FINAL_MEMORY KB"

# Calculate memory increase
MEMORY_INCREASE=$((FINAL_MEMORY - BASELINE_MEMORY))
echo "Memory increase: $MEMORY_INCREASE KB"

if [ "$MEMORY_INCREASE" -gt 5000 ]; then
    echo "⚠ Potential memory leak detected"
else
    echo "✓ Memory usage looks normal"
fi
```

Battery usage analysis:
```sh
#!/bin/bash
PACKAGE="com.example.app"

echo "=== Battery Usage Analysis ==="

# Reset battery stats
echo "Resetting battery stats..."
adb shell dumpsys batterystats --reset

# Start app
echo "Starting app for battery test..."
adb shell am start -n "$PACKAGE/.MainActivity"

# Run for 5 minutes
echo "Running app for 5 minutes..."
sleep 300

# Get battery stats
echo "Battery usage statistics:"
adb shell dumpsys batterystats | grep -A 10 "$PACKAGE"

# Get battery level
BATTERY_LEVEL=$(adb shell dumpsys battery | grep level | awk '{print $2}')
echo "Current battery level: $BATTERY_LEVEL%"
```

Complete performance report:
```sh
#!/bin/bash
PACKAGE="com.example.app"
REPORT_DIR="performance_reports"
DATE=$(date +%Y%m%d_%H%M%S)

echo "=== Complete Performance Report ==="
mkdir -p "$REPORT_DIR"

# Create report file
REPORT_FILE="$REPORT_DIR/performance_${PACKAGE}_${DATE}.txt"

# Collect performance data
{
    echo "Performance Report for $PACKAGE"
    echo "Generated: $(date)"
    echo "================================"
    
    echo -e "\n--- Memory Information ---"
    adb shell dumpsys meminfo "$PACKAGE"
    
    echo -e "\n--- CPU Information ---"
    adb shell top -n 1 | grep "$PACKAGE"
    
    echo -e "\n--- GPU Information ---"
    adb shell dumpsys gfxinfo "$PACKAGE" | head -20
    
    echo -e "\n--- Process Information ---"
    adb shell ps | grep "$PACKAGE"
    
    echo -e "\n--- Battery Information ---"
    adb shell dumpsys batterystats | grep -A 5 "$PACKAGE"
    
} > "$REPORT_FILE"

echo "Performance report saved to $REPORT_FILE"
```

Real-time performance monitor:
```sh
#!/bin/bash
PACKAGE="com.example.app"

echo "=== Real-time Performance Monitor ==="
echo "Press Ctrl+C to stop monitoring"

while true; do
    clear
    echo "=== Performance Monitor - $(date) ==="
    echo "Package: $PACKAGE"
    
    echo -e "\n--- Memory Usage ---"
    adb shell dumpsys meminfo "$PACKAGE" | grep -E "TOTAL|Native|Dalvik"
    
    echo -e "\n--- CPU Usage ---"
    adb shell top -n 1 | grep "$PACKAGE"
    
    echo -e "\n--- Process Status ---"
    adb shell ps | grep "$PACKAGE"
    
    sleep 3
done
```

## Notes
- Performance monitoring may impact app performance
- Some commands require root access
- Memory usage varies between Android versions
- GPU profiling requires Android 4.1+
- Battery stats reset requires root on some devices
- Use specific time intervals for accurate measurements
- Consider device load when analyzing performance
- Some performance metrics are only available on debug builds
- Always test on multiple devices for accurate performance assessment
