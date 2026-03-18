# Hardware Monitoring - ADB Commands

## Description
Commands for monitoring Android hardware status, tracking hardware health, and hardware performance analysis.

### Basic Commands

Monitor CPU usage:
```sh
adb shell top -n 1 | grep -E "CPU|Load"
```

Check memory usage:
```sh
adb shell free -m
```

Monitor battery status:
```sh
adb shell dumpsys battery
```

Check storage usage:
```sh
adb shell df -h
```

Monitor temperature:
```sh
adb shell cat /sys/class/thermal/thermal_zone*/temp
```

### Advanced Commands

Comprehensive hardware monitoring:
```sh
#!/bin/bash
echo "=== Hardware Monitor ==="
echo "CPU: $(adb shell top -n 1 | grep CPU)"
echo "Memory: $(adb shell free -m | grep Mem)"
echo "Battery: $(adb shell dumpsys battery | grep level)"
echo "Storage: $(adb shell df -h /data | tail -1)"
echo "Temperature: $(adb shell cat /sys/class/thermal/thermal_zone*/temp | head -1)"
```

Real-time hardware monitoring:
```sh
while true; do
  clear
  echo "=== Hardware Status $(date) ==="
  echo "CPU Load: $(adb shell cat /proc/loadavg)"
  echo "Memory: $(adb shell free -m | grep Mem | awk '{print $3"/"$2"MB"}')"
  echo "Battery: $(adb shell dumpsys battery | grep level | awk '{print $2"%"}')"
  echo "Temperature: $(adb shell cat /sys/class/thermal/thermal_zone*/temp | head -1 | awk '{print $1/1000"°C"}')"
  sleep 5
done
```

CPU monitoring:
```sh
adb shell cat /proc/stat | grep cpu
adb shell top -n 1 | head -10
```

Memory monitoring:
```sh
adb shell cat /proc/meminfo | head -10
adb shell dumpsys meminfo | grep -E "TOTAL|FREE|USED"
```

GPU monitoring:
```sh
adb shell dumpsys gfxinfo | grep -E "frames|jank|fps"
adb shell cat /sys/class/kgsl/kgsl-3d0/gpu_clock
```

Network hardware monitoring:
```sh
adb shell cat /proc/net/dev | grep -E "wlan|rmnet"
adb shell dumpsys connectivity | grep -E "NetworkAgent|LinkProperties"
```

Storage monitoring:
```sh
adb shell iostat 1 5
adb shell df -h | grep -E "/data|/system|/sdcard"
```

Sensor hardware monitoring:
```sh
adb shell dumpsys sensorservice | grep -E "active|enabled|power"
```

Camera hardware monitoring:
```sh
adb shell dumpsys media.camera | grep -E "state|power|fps"
```

Audio hardware monitoring:
```sh
adb shell dumpsys audio | grep -E "output|input|volume"
```

Display hardware monitoring:
```sh
adb shell dumpsys display | grep -E "brightness|fps|resolution"
```

Hardware stress monitoring:
```sh
#!/bin/bash
echo "=== Hardware Stress Test Monitor ==="

# Start stress test
adb shell monkey -p com.example.app --throttle 50 1000 &

# Monitor during stress
for i in {1..60}; do
  echo "=== Sample $i ==="
  echo "CPU: $(adb shell top -n 1 | grep -E "CPU|Load")"
  echo "Memory: $(adb shell free -m | grep Mem)"
  echo "Temperature: $(adb shell cat /sys/class/thermal/thermal_zone*/temp | head -1)"
  sleep 2
done
```

Hardware health check:
```sh
#!/bin/bash
echo "=== Hardware Health Check ==="

# CPU health
echo "CPU Health:"
adb shell cat /proc/cpuinfo | grep -E "processor|model name"
adb shell cat /proc/loadavg

# Memory health
echo "Memory Health:"
adb shell free -m
adb shell cat /proc/meminfo | grep -E "MemTotal|MemFree|MemAvailable"

# Battery health
echo "Battery Health:"
adb shell dumpsys battery | grep -E "health|technology|temperature"

# Storage health
echo "Storage Health:"
adb shell df -h
adb shell cat /proc/mounts | grep -E "error|ro"

# Temperature health
echo "Temperature Health:"
adb shell cat /sys/class/thermal/thermal_zone*/temp
```

### Examples

Real-time hardware monitor:
```sh
while true; do
  clear
  echo "Hardware Monitor - $(date)"
  echo "CPU: $(adb shell top -n 1 | grep CPU | awk '{print $2}')"
  echo "Memory: $(adb shell free -m | grep Mem | awk '{print $3"/"$2}')"
  echo "Battery: $(adb shell dumpsys battery | grep level | awk '{print $2}')%"
  echo "Temp: $(adb shell cat /sys/class/thermal/thermal_zone*/temp | head -1 | awk '{print $1/1000"°C"}')"
  sleep 3
done
```

Hardware stress monitoring:
```sh
adb shell monkey -p com.example.app --throttle 25 2000 &
for i in {1..30}; do
  echo "=== Check $i ==="
  adb shell top -n 1 | grep CPU
  adb shell cat /sys/class/thermal/thermal_zone*/temp | head -3
  sleep 2
done
```

Complete hardware health check:
```sh
#!/bin/bash
echo "=== Complete Hardware Health Check ==="
echo "Date: $(date)"
echo "=== CPU ==="
adb shell cat /proc/loadavg
echo "=== Memory ==="
adb shell free -m
echo "=== Battery ==="
adb shell dumpsys battery | grep -E "level|health|temperature"
echo "=== Storage ==="
adb shell df -h
echo "=== Temperature ==="
adb shell cat /sys/class/thermal/thermal_zone*/temp
```

## Notes
- Hardware monitoring may affect device performance
- Continuous monitoring consumes battery
- Some hardware info requires root access
- Monitor during different usage patterns
- Temperature monitoring helps prevent overheating
- Hardware status varies by device manufacturer
- Use monitoring for performance optimization
- Document hardware baselines for comparison
