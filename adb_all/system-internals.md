# System Internals - ADB Commands

## Description
Commands for deep system internals analysis, system service debugging, and low-level system operations.

### Basic Commands

Check system services:
```sh
adb shell service list
```

Check system properties:
```sh
adb shell getprop
```

Check system processes:
```sh
adb shell ps -A
```

Check system memory:
```sh
adb shell cat /proc/meminfo
```

Check system load:
```sh
adb shell cat /proc/loadavg
```

### Advanced Commands

System service analysis:
```sh
#!/bin/bash
echo "=== System Service Analysis ==="

# List all system services
echo "System services:"
adb shell service list | head -20

# Check service status
echo "Service status:"
services=("activity" "window" "package" "telephony" "location")

for service in "${services[@]}"; do
  echo "=== $service service ==="
  adb shell service check $service
  adb shell dumpsys $service | head -10
done

# Check service dependencies
echo "Service dependencies:"
adb shell dumpsys activity | grep -E "service|dependency" | head -10
```

System property debugging:
```sh
#!/bin/bash
echo "=== System Property Debugging ==="

# Check system properties
echo "System properties:"
adb shell getprop | head -20

# Check specific property categories
echo "Build properties:"
adb shell getprop | grep -E "ro\.build" | head -10

echo "Product properties:"
adb shell getprop | grep -E "ro\.product" | head -10

echo "System properties:"
adb shell getprop | grep -E "ro\.system" | head -10

# Set debug properties
echo "Setting debug properties..."
adb shell setprop debug.log.tag VERBOSE
adb shell setprop debug.trace.enable 1

# Verify property changes
echo "Property verification:"
adb shell getprop debug.log.tag
adb shell getprop debug.trace.enable
```

System process debugging:
```sh
#!/bin/bash
echo "=== System Process Debugging ==="

# Analyze critical system processes
critical_processes=("zygote" "system_server" "surfaceflinger" "media")

for process in "${critical_processes[@]}"; do
  echo "=== Analyzing $process ==="
  
  # Get process PID
  pid=$(adb shell pgrep $process)
  if [ ! -z "$pid" ]; then
    echo "PID: $pid"
    
    # Process status
    adb shell cat /proc/$pid/status | head -15
    
    # Process memory
    adb shell cat /proc/$pid/statm
    
    # Process file descriptors
    adb shell ls -la /proc/$pid/fd/ | wc -l
    
    # Process threads
    adb shell ls -la /proc/$pid/task/ | wc -l
  fi
done
```

System call tracing:
```sh
#!/bin/bash
echo "=== System Call Tracing ==="

# Trace system calls for system_server
pid=$(pidof system_server)
echo "Tracing system calls for PID: $pid"

# Start strace
adb shell strace -f -e trace=all -p $pid -o /sdcard/syscalls.log &
STRACE_PID=$!

# Monitor for 30 seconds
sleep 30

# Stop strace
adb shell kill $STRACE_PID

# Analyze results
echo "System call analysis:"
adb shell cat /sdcard/syscalls.log | head -20
adb shell cat /sdcard/syscalls.log | grep -E "open|read|write" | head -10
```

System memory internals:
```sh
#!/bin/bash
echo "=== System Memory Internals ==="

# Analyze memory allocation
echo "Memory allocation:"
adb shell cat /proc/meminfo | head -15

# Check memory zones
echo "Memory zones:"
adb shell cat /proc/zoneinfo | head -20

# Check slab allocation
echo "Slab allocation:"
adb shell cat /proc/slabinfo | head -15

# Check memory fragmentation
echo "Memory fragmentation:"
adb shell cat /proc/buddyinfo

# Check memory pressure
echo "Memory pressure:"
adb shell cat /proc/pressure/memory
```

System IPC debugging:
```sh
#!/bin/bash
echo "=== System IPC Debugging ==="

# Check Binder statistics
echo "Binder statistics:"
adb shell cat /proc/binder/stats | head -20

# Check Binder transactions
echo "Binder transactions:"
adb shell dumpsys binder | head -20

# Monitor IPC activity
echo "IPC activity monitoring:"
for i in {1..10}; do
  echo "IPC check $i:"
  adb shell cat /proc/binder/stats | grep -E "transaction|call" | tail -5
  sleep 5
done

# Check shared memory
echo "Shared memory:"
adb shell cat /proc/sysvipc/shm | head -10
```

System scheduler debugging:
```sh
#!/bin/bash
echo "=== System Scheduler Debugging ==="

# Check scheduler information
echo "Scheduler information:"
adb shell cat /proc/schedstat | head -15

# Check process scheduling
pid=$(pidof system_server)
echo "Process scheduling for PID: $pid"
adb shell cat /proc/$pid/sched | head -15

# Check CPU load
echo "CPU load:"
adb shell cat /proc/loadavg

# Check run queue
echo "Run queue:"
adb shell cat /proc/sched_debug | head -20
```

System file system debugging:
```sh
#!/bin/bash
echo "=== System File System Debugging ==="

# Check mounted file systems
echo "Mounted file systems:"
adb shell cat /proc/mounts | head -15

# Check file system statistics
echo "File system statistics:"
adb shell cat /proc/filesystems | head -10

# Check inode usage
echo "Inode usage:"
adb shell df -i | head -10

# Check file system performance
echo "File system performance:"
adb shell cat /proc/diskstats | head -10
```

System event logging:
```sh
#!/bin/bash
echo "=== System Event Logging ==="

# Enable system event logging
echo "Enabling system event logging..."
adb shell setprop log.tag.SystemServer VERBOSE
adb shell setprop log.tag.ActivityManager VERBOSE

# Monitor system events
echo "Monitoring system events..."
for i in {1..20}; do
  echo "System events $i:"
  adb shell logcat | grep -E "SystemServer|ActivityManager" | tail -5
  sleep 3
done

# Disable logging
adb shell setprop log.tag.SystemServer INFO
adb shell setprop log.tag.ActivityManager INFO
```

Real-time system monitoring:
```sh
#!/bin/bash
echo "=== Real-time System Monitoring ==="

# Monitor system internals in real-time
while true; do
  echo "=== System Monitor $(date) ==="
  
  # System load
  echo "System load:"
  adb shell cat /proc/loadavg
  
  # Memory usage
  echo "Memory usage:"
  adb shell free -m | head -5
  
  # Process count
  echo "Process count:"
  adb shell ps -A | wc -l
  
  # System services
  echo "System services:"
  adb shell service list | wc -l
  
  sleep 30
done
```

### Examples

Basic system analysis:
```sh
adb shell service list
adb shell getprop | head -20
adb shell ps -A | head -10
adb shell cat /proc/meminfo | head -15
```

System service debugging:
```sh
adb shell dumpsys activity | head -20
adb shell dumpsys package | head -15
adb shell dumpsys telephony | head -10
```

System call tracing:
```sh
pid=$(pidof system_server)
adb shell strace -f -e trace=open,read,write -p $pid -o /sdcard/syscalls.log &
sleep 10
adb shell kill $(pidof strace)
adb shell cat /sdcard/syscalls.log | head -20
```

Complete system analysis:
```sh
#!/bin/bash
echo "=== Complete System Analysis ==="

# System services
echo "System services:"
adb shell service list | head -15

# System properties
echo "System properties:"
adb shell getprop | head -15

# System processes
echo "System processes:"
adb shell ps -A | head -10

# System memory
echo "System memory:"
adb shell cat /proc/meminfo | head -10

echo "System analysis completed"
```

## Notes
- System internals commands require root access for most operations
- System debugging can affect system stability
- Some system features depend on Android version
- Use system commands carefully in production
- Monitor system stability during debugging
- Some system parameters may be reset on reboot
- Document system configuration changes
- Consider system performance when modifying internals
