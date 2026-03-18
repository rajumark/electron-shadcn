# Kernel Debugging - ADB Commands

## Description
Commands for advanced kernel debugging, system internals analysis, and low-level system troubleshooting.

### Basic Commands

Check kernel version:
```sh
adb shell cat /proc/version
```

Check kernel modules:
```sh
adb shell cat /proc/modules
```

Check kernel parameters:
```sh
adb shell cat /proc/cmdline
```

Monitor kernel messages:
```sh
adb shell dmesg | tail -50
```

Check system calls:
```sh
adb shell strace -p $(pidof system_server)
```

### Advanced Commands

Kernel module management:
```sh
#!/bin/bash
echo "=== Kernel Module Management ==="

# List loaded modules
echo "Loaded kernel modules:"
adb shell cat /proc/modules | head -20

# Check module dependencies
echo "Module dependencies:"
adb shell cat /proc/modules | awk '{print $1}' | while read module; do
  echo "Module: $module"
  adb shell modinfo $module 2>/dev/null | head -5
done

# Check module memory usage
echo "Module memory usage:"
adb shell cat /proc/modules | awk '{print $2, $3}' | head -10
```

Kernel parameter tuning:
```sh
#!/bin/bash
echo "=== Kernel Parameter Tuning ==="

# Check current kernel parameters
echo "Current kernel parameters:"
adb shell sysctl -a | head -20

# Tune memory parameters
echo "Tuning memory parameters:"
adb shell sysctl -w vm.swappiness=10
adb shell sysctl -w vm.dirty_ratio=15
adb shell sysctl -w vm.dirty_background_ratio=5

# Tune network parameters
echo "Tuning network parameters:"
adb shell sysctl -w net.core.rmem_max=16777216
adb shell sysctl -w net.core.wmem_max=16777216
adb shell sysctl -w net.ipv4.tcp_rmem="4096 87380 16777216"

# Verify changes
echo "Parameter verification:"
adb shell sysctl vm.swappiness
adb shell sysctl net.core.rmem_max
```

Kernel profiling:
```sh
#!/bin/bash
echo "=== Kernel Profiling ==="

# Enable kernel profiling
echo "Enabling kernel profiling..."
adb shell echo 1 > /proc/sys/kernel/profile

# Profile CPU usage
echo "Profiling CPU usage..."
adb shell perf top -p $(pidof system_server) &
PROF_PID=$!
sleep 10
adb shell kill $PROF_PID

# Profile memory usage
echo "Profiling memory usage..."
adb shell cat /proc/meminfo | head -10

# Profile I/O usage
echo "Profiling I/O usage..."
adb shell iostat 1 5
```

Kernel crash analysis:
```sh
#!/bin/bash
echo "=== Kernel Crash Analysis ==="

# Check for kernel crashes
echo "Checking for kernel crashes..."
adb shell cat /proc/kmsg | grep -E "panic|oops|bug" | tail -10

# Check crash dumps
echo "Checking crash dumps..."
adb shell find /data -name "*crash*" -o -name "*panic*" -o -name "*oops*"

# Analyze kernel logs
echo "Analyzing kernel logs..."
adb shell dmesg | grep -E "error|warning|critical" | tail -20

# Check system stability
echo "Checking system stability..."
adb shell cat /proc/uptime
adb shell cat /proc/loadavg
```

Kernel debugging with ftrace:
```sh
#!/bin/bash
echo "=== Kernel Debugging with Ftrace ==="

# Check available tracers
echo "Available tracers:"
adb shell cat /sys/kernel/debug/tracing/available_tracers

# Enable function tracer
echo "Enabling function tracer..."
adb shell echo function > /sys/kernel/debug/tracing/current_tracer

# Set tracing filter
echo "Setting tracing filter..."
adb shell echo "sys_*" > /sys/kernel/debug/tracing/set_ftrace_filter

# Start tracing
echo "Starting tracing..."
adb shell echo 1 > /sys/kernel/debug/tracing/tracing_on
sleep 5
adb shell echo 0 > /sys/kernel/debug/tracing/tracing_on

# Read trace
echo "Reading trace..."
adb shell cat /sys/kernel/debug/tracing/trace | tail -20
```

Kernel memory debugging:
```sh
#!/bin/bash
echo "=== Kernel Memory Debugging ==="

# Check memory allocation
echo "Memory allocation:"
adb shell cat /proc/buddyinfo
adb shell cat /proc/pagetypeinfo

# Check memory fragmentation
echo "Memory fragmentation:"
adb shell cat /proc/zoneinfo | head -20

# Check memory leaks
echo "Memory leaks:"
adb shell cat /proc/slabinfo | head -10

# Check OOM killer activity
echo "OOM killer activity:"
adb shell dmesg | grep -E "oom-killer|Out of memory" | tail -5
```

Kernel network debugging:
```sh
#!/bin/bash
echo "=== Kernel Network Debugging ==="

# Check network stack
echo "Network stack:"
adb shell cat /proc/net/netstat | head -10

# Check routing table
echo "Routing table:"
adb shell cat /proc/net/route

# Check network connections
echo "Network connections:"
adb shell cat /proc/net/tcp | head -10

# Check network errors
echo "Network errors:"
adb shell cat /proc/net/snmp | grep -E "error|drop|fail"
```

Kernel scheduler debugging:
```sh
#!/bin/bash
echo "=== Kernel Scheduler Debugging ==="

# Check scheduler info
echo "Scheduler info:"
adb shell cat /proc/schedstat | head -10

# Check CPU load
echo "CPU load:"
adb shell cat /proc/loadavg

# Check process scheduling
echo "Process scheduling:"
adb shell cat /proc/$(pidof system_server)/sched | head -10

# Check CPU frequency
echo "CPU frequency:"
adb shell cat /proc/cpuinfo | grep -E "processor|cpu MHz"
```

### Examples

Basic kernel debugging:
```sh
adb shell cat /proc/version
adb shell dmesg | tail -20
adb shell cat /proc/modules | head -10
```

Kernel parameter tuning:
```sh
adb shell sysctl -w vm.swappiness=10
adb shell sysctl -w net.core.rmem_max=16777216
adb shell sysctl vm.swappiness
```

Kernel crash analysis:
```sh
adb shell dmesg | grep -E "panic|oops|bug" | tail -10
adb shell find /data -name "*crash*" 2>/dev/null
```

Complete kernel debugging:
```sh
#!/bin/bash
echo "=== Complete Kernel Debugging ==="

# Kernel info
echo "Kernel info:"
adb shell cat /proc/version

# System status
echo "System status:"
adb shell cat /proc/uptime
adb shell cat /proc/loadavg

# Recent kernel messages
echo "Recent kernel messages:"
adb shell dmesg | tail -10

echo "Kernel debugging completed"
```

## Notes
- Kernel debugging requires root access
- Kernel parameters may be reset on reboot
- Some debugging features may not be available on all devices
- Kernel debugging can affect system performance
- Use kernel debugging carefully in production environments
- Some kernel features depend on Android version
- Document kernel parameter changes
- Consider system stability when modifying kernel parameters
