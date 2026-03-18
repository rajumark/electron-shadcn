# Low-Level Memory - ADB Commands

## Description
Commands for low-level memory management, memory debugging, and advanced memory analysis.

### Basic Commands

Check memory layout:
```sh
adb shell cat /proc/meminfo
```

Check memory maps:
```sh
adb shell cat /proc/$(pidof system_server)/maps
```

Check memory statistics:
```sh
adb shell cat /proc/$(pidof system_server)/statm
```

Monitor memory usage:
```sh
adb shell dumpsys meminfo
```

Check memory fragmentation:
```sh
adb shell cat /proc/buddyinfo
```

### Advanced Commands

Memory layout analysis:
```sh
#!/bin/bash
echo "=== Memory Layout Analysis ==="

# Analyze system memory
echo "System memory layout:"
adb shell cat /proc/meminfo | head -20

# Check memory zones
echo "Memory zones:"
adb shell cat /proc/zoneinfo | head -30

# Check memory fragmentation
echo "Memory fragmentation:"
adb shell cat /proc/buddyinfo

# Check memory allocation
echo "Memory allocation:"
adb shell cat /proc/slabinfo | head -15
```

Process memory debugging:
```sh
#!/bin/bash
echo "=== Process Memory Debugging ==="

# Get target process
target_pid=$(pidof system_server)
echo "Debugging memory for PID: $target_pid"

# Analyze memory maps
echo "Memory maps:"
adb shell cat /proc/$target_pid/maps | head -20

# Check memory statistics
echo "Memory statistics:"
adb shell cat /proc/$target_pid/statm

# Check memory status
echo "Memory status:"
adb shell cat /proc/$target_pid/status | grep -E "Vm|Name|PPid"

# Check memory layout
echo "Memory layout:"
adb shell cat /proc/$target_pid/smaps | head -30
```

Memory leak detection:
```sh
#!/bin/bash
echo "=== Memory Leak Detection ==="

# Monitor memory growth over time
target_app="com.example.app"
initial_memory=$(adb shell dumpsys meminfo $target_app | grep TOTAL | awk '{print $2}')
echo "Initial memory: $initial_memory KB"

# Start memory leak monitoring
for i in {1..10}; do
  echo "Memory check $i:"
  
  # Launch app
  adb shell am start -n $target_app/.MainActivity
  sleep 5
  
  # Check memory usage
  current_memory=$(adb shell dumpsys meminfo $target_app | grep TOTAL | awk '{print $2}')
  echo "Current memory: $current_memory KB"
  
  # Calculate growth
  growth=$((current_memory - initial_memory))
  echo "Memory growth: $growth KB"
  
  # Clear app
  adb shell am force-stop $target_app
  sleep 2
done
```

Low-level memory allocation:
```sh
#!/bin/bash
echo "=== Low-Level Memory Allocation ==="

# Check memory allocation patterns
echo "Memory allocation patterns:"
adb shell cat /proc/vmallocinfo | head -20

# Check page allocation
echo "Page allocation:"
adb shell cat /proc/pagetypeinfo

# Check memory pressure
echo "Memory pressure:"
adb shell cat /proc/pressure/memory

# Check slab allocation
echo "Slab allocation:"
adb shell cat /proc/slabinfo | grep -E "kmem_cache|kmalloc" | head -10
```

Memory optimization:
```sh
#!/bin/bash
echo "=== Memory Optimization ==="

# Optimize memory parameters
echo "Optimizing memory parameters..."
adb shell echo 1 > /proc/sys/vm/drop_caches
adb shell echo 1 > /proc/sys/vm/compact_memory

# Tune memory management
adb shell sysctl -w vm.swappiness=10
adb shell sysctl -w vm.vfs_cache_pressure=50

# Optimize OOM killer
adb shell echo -1000 > /proc/$(pidof system_server)/oom_score_adj

# Verify optimization
echo "Memory optimization verification:"
adb shell cat /proc/sys/vm/swappiness
adb shell cat /proc/sys/vm/vfs_cache_pressure
```

Memory profiling:
```sh
#!/bin/bash
echo "=== Memory Profiling ==="

# Profile memory usage patterns
echo "Profiling memory usage..."
target_pid=$(pidof system_server)

# Monitor memory allocation
adb shell perf record -e mem:* -p $target_pid -- sleep 30 &
PERF_PID=$!

# Collect memory statistics
for i in {1..30}; do
  echo "Memory profile $i:"
  adb shell cat /proc/$target_pid/statm
  sleep 1
done

# Stop profiling
adb shell kill $PERF_PID

# Analyze results
echo "Memory profiling completed"
```

Native memory debugging:
```sh
#!/bin/bash
echo "=== Native Memory Debugging ==="

# Enable native memory tracking
echo "Enabling native memory tracking..."
adb shell setprop debug.allocTracker 1
adb shell setprop debug.allocTracker.app com.example.app

# Start native memory tracking
adb shell am start -n com.example.app/.MainActivity
sleep 10

# Collect native memory info
echo "Native memory information:"
adb shell dumpsys meminfo com.example.app | grep -E "Native|Graphics|GL"

# Disable tracking
adb shell setprop debug.allocTracker 0
```

Heap memory analysis:
```sh
#!/bin/bash
echo "=== Heap Memory Analysis ==="

# Analyze Java heap
target_app="com.example.app"
echo "Analyzing Java heap for $target_app..."

# Get heap info
echo "Java heap information:"
adb shell dumpsys meminfo $target_app | grep -A 10 "Java Heap"

# Analyze heap dump
echo "Creating heap dump..."
adb shell am dumpheap $target_app /sdcard/heap.hprof

# Pull heap dump
adb pull /sdcard/heap.hprof

# Analyze heap usage
echo "Heap usage analysis:"
adb shell dumpsys meminfo $target_app | grep -E "Objects|Views|Activities"
```

Memory pressure monitoring:
```sh
#!/bin/bash
echo "=== Memory Pressure Monitoring ==="

# Monitor memory pressure
while true; do
  echo "=== Memory Pressure $(date) ==="
  
  # Check memory pressure levels
  echo "Memory pressure:"
  adb shell cat /proc/pressure/memory
  
  # Check available memory
  echo "Available memory:"
  adb shell cat /proc/meminfo | grep -E "MemAvailable|MemFree|Buffers"
  
  # Check OOM killer activity
  echo "OOM killer activity:"
  adb shell dmesg | grep -E "oom-killer|Out of memory" | tail -3
  
  sleep 30
done
```

Memory corruption detection:
```sh
#!/bin/bash
echo "=== Memory Corruption Detection ==="

# Check for memory corruption
echo "Checking for memory corruption..."

# Check kernel memory corruption
echo "Kernel memory corruption:"
adb shell dmesg | grep -E "corruption|bad|fault" | tail -10

# Check process memory corruption
target_pid=$(pidof system_server)
echo "Process memory corruption:"
adb shell cat /proc/$target_pid/smaps | grep -E "corrupt|bad|fault"

# Check memory protection violations
echo "Memory protection violations:"
adb shell dmesg | grep -E "protection|violation|segfault" | tail -10
```

### Examples

Basic memory analysis:
```sh
adb shell cat /proc/meminfo
adb shell cat /proc/$(pidof system_server)/maps | head -10
adb shell dumpsys meminfo | head -15
```

Memory leak detection:
```sh
initial_memory=$(adb shell dumpsys meminfo com.example.app | grep TOTAL | awk '{print $2}')
echo "Initial: $initial_memory KB"
# Run app
current_memory=$(adb shell dumpsys meminfo com.example.app | grep TOTAL | awk '{print $2}')
echo "Current: $current_memory KB"
```

Memory optimization:
```sh
adb shell echo 1 > /proc/sys/vm/drop_caches
adb shell sysctl -w vm.swappiness=10
adb shell cat /proc/sys/vm/swappiness
```

Complete memory analysis:
```sh
#!/bin/bash
echo "=== Complete Memory Analysis ==="

# System memory
echo "System memory:"
adb shell cat /proc/meminfo | head -10

# Process memory
echo "Process memory:"
adb shell cat /proc/$(pidof system_server)/statm

# Memory fragmentation
echo "Memory fragmentation:"
adb shell cat /proc/buddyinfo

echo "Memory analysis completed"
```

## Notes
- Low-level memory commands require root access
- Memory debugging can affect system performance
- Some memory features depend on kernel configuration
- Use memory debugging carefully in production
- Monitor memory usage during debugging
- Some memory parameters may be reset on reboot
- Document memory optimization changes
- Consider system stability when modifying memory parameters
