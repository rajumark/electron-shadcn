# System Tracing - ADB Commands

## Description
Commands for advanced system tracing, performance analysis, and system call monitoring.

### Basic Commands

Check tracing status:
```sh
adb shell getprop debug.tracing.enable
```

Start system trace:
```sh
adb shell atrace --async_start -c -b 4096
```

Stop system trace:
```sh
adb shell atrace --async_stop
```

Check trace categories:
```sh
adb shell atrace --list_categories
```

Monitor system calls:
```sh
adb shell strace -p $(pidof system_server)
```

### Advanced Commands

System performance tracing:
```sh
#!/bin/bash
echo "=== System Performance Tracing ==="

# Start comprehensive trace
echo "Starting system performance trace..."
adb shell atrace --async_start -c -b 8192 -t 10 \
  gfx view wm am sm audio video camera hal res dalvik rs bionic power pm \
  freq idle disk memreclaim binder_driver binder_lock pagecache

# Monitor trace progress
echo "Monitoring trace progress..."
sleep 5
adb shell atrace --async_dump | head -10

# Stop trace and save
echo "Stopping trace..."
adb shell atrace --async_stop > system_trace.txt

echo "System trace saved to system_trace.txt"
```

System call tracing:
```sh
#!/bin/bash
echo "=== System Call Tracing ==="

# Trace system calls for specific process
target_pid=$(pidof system_server)
echo "Tracing system calls for PID $target_pid..."

# Start strace with detailed options
adb shell strace -f -e trace=all -p $target_pid -o /sdcard/syscalls.log &
STRACE_PID=$!

# Monitor for 30 seconds
sleep 30

# Stop strace
adb shell kill $STRACE_PID

# Pull trace results
adb pull /sdcard/syscalls.log

echo "System call trace completed"
```

Graphics tracing:
```sh
#!/bin/bash
echo "=== Graphics Tracing ==="

# Start graphics trace
echo "Starting graphics trace..."
adb shell atrace --async_start -c -b 4096 gfx view wm

# Launch graphics-intensive app
adb shell am start -n com.example.game/.MainActivity
sleep 10

# Stop graphics trace
adb shell atrace --async_stop > graphics_trace.txt

# Analyze graphics performance
echo "Graphics performance analysis:"
adb shell dumpsys gfxinfo com.example.game | head -20
```

Memory tracing:
```sh
#!/bin/bash
echo "=== Memory Tracing ==="

# Enable memory tracing
echo "Enabling memory tracing..."
adb shell setprop debug.tracing.enable 1
adb shell setprop debug.tracing.app "com.example.app"

# Start memory trace
adb shell atrace --async_start -c -b 4096 memreclaim am dalvik

# Trigger memory operations
adb shell am start -n com.example.app/.MainActivity
sleep 5

# Stop memory trace
adb shell atrace --async_stop > memory_trace.txt

# Analyze memory usage
echo "Memory analysis:"
adb shell dumpsys meminfo com.example.app | head -15
```

Network tracing:
```sh
#!/bin/bash
echo "=== Network Tracing ==="

# Start network trace
echo "Starting network trace..."
adb shell atrace --async_start -c -b 4096 network

# Generate network activity
adb shell ping -c 10 8.8.8.8
adb shell curl -s http://example.com

# Stop network trace
adb shell atrace --async_stop > network_trace.txt

# Analyze network performance
echo "Network analysis:"
adb shell dumpsys connectivity | head -10
```

Power tracing:
```sh
#!/bin/bash
echo "=== Power Tracing ==="

# Start power trace
echo "Starting power trace..."
adb shell atrace --async_start -c -b 4096 power freq

# Generate power events
adb shell am start -n com.example.app/.MainActivity
sleep 10

# Stop power trace
adb shell atrace --async_stop > power_trace.txt

# Analyze power usage
echo "Power analysis:"
adb shell dumpsys batterystats | head -20
```

Binder tracing:
```sh
#!/bin/bash
echo "=== Binder Tracing ==="

# Start binder trace
echo "Starting binder trace..."
adb shell atrace --async_start -c -b 4096 binder_driver binder_lock

# Generate binder activity
adb shell am start -n com.example.app/.MainActivity
sleep 5

# Stop binder trace
adb shell atrace --async_stop > binder_trace.txt

# Analyze binder transactions
echo "Binder analysis:"
adb shell dumpsys binder | head -20
```

Custom trace configuration:
```sh
#!/bin/bash
echo "=== Custom Trace Configuration ==="

# List available trace categories
echo "Available trace categories:"
adb shell atrace --list_categories | head -20

# Create custom trace configuration
echo "Creating custom trace..."
categories="gfx view wm am sm audio video camera hal res dalvik rs bionic power pm"

# Start custom trace
adb shell atrace --async_start -c -b 16384 -t 15 $categories

# Monitor trace
echo "Monitoring custom trace..."
for i in {1..15}; do
  echo "Trace progress: $i/15 seconds"
  sleep 1
done

# Stop custom trace
adb shell atrace --async_stop > custom_trace.txt

echo "Custom trace completed"
```

Real-time tracing:
```sh
#!/bin/bash
echo "=== Real-time Tracing ==="

# Start real-time trace
echo "Starting real-time trace..."
adb shell atrace --async_start -c -b 4096 gfx view wm

# Monitor trace output in real-time
while true; do
  echo "=== Real-time Trace $(date) ==="
  adb shell atrace --async_dump | tail -10
  sleep 5
done
```

Trace analysis and reporting:
```sh
#!/bin/bash
echo "=== Trace Analysis and Reporting ==="

# Analyze trace file
if [ -f "system_trace.txt" ]; then
  echo "Analyzing system trace..."
  
  # Count different event types
  echo "Event type analysis:"
  grep -o "|[A-Za-z_]*|" system_trace.txt | sort | uniq -c | sort -nr | head -10
  
  # Find performance bottlenecks
  echo "Performance bottlenecks:"
  grep -E "(B|b)locked|SLOW|TIMEOUT" system_trace.txt | head -10
  
  # Generate summary report
  echo "Trace summary:"
  echo "Total events: $(wc -l < system_trace.txt)"
  echo "Trace duration: $(head -1 system_trace.txt | grep -o '[0-9.]*')"
fi
```

### Examples

Basic system tracing:
```sh
adb shell atrace --async_start -c -b 4096 gfx view wm
adb shell am start -n com.example.app/.MainActivity
adb shell atrace --async_stop > trace.txt
```

System call tracing:
```sh
adb shell strace -f -e trace=all -p $(pidof system_server) -o /sdcard/syscalls.log &
sleep 10
adb shell kill $(pidof strace)
```

Graphics performance tracing:
```sh
adb shell atrace --async_start -c -b 4096 gfx view wm
adb shell am start -n com.example.game/.MainActivity
sleep 10
adb shell atrace --async_stop > gfx_trace.txt
```

Complete system tracing:
```sh
#!/bin/bash
echo "=== Complete System Tracing ==="

# Start comprehensive trace
adb shell atrace --async_start -c -b 8192 gfx view wm am sm audio video

# Generate activity
adb shell am start -n com.example.app/.MainActivity
sleep 5

# Stop trace
adb shell atrace --async_stop > complete_trace.txt

# Analyze results
echo "Trace analysis:"
wc -l complete_trace.txt
head -10 complete_trace.txt

echo "System tracing completed"
```

## Notes
- System tracing requires appropriate permissions
- Large traces may consume significant storage
- Tracing can affect system performance
- Use specific trace categories for better analysis
- Consider trace buffer size for long traces
- Some trace categories may not be available on all devices
- Analyze traces with appropriate tools
- Document trace configurations for reproducibility
