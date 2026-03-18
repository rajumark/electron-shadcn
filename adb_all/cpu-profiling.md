# CPU Profiling - ADB Commands

## Description
Commands for CPU performance analysis, monitoring CPU usage, and profiling CPU-intensive operations on Android devices.

### Basic Commands

Monitor CPU usage:
```sh
adb shell top -n 1
```

Check CPU load:
```sh
adb shell cat /proc/loadavg
```

Get CPU info:
```sh
adb shell cat /proc/cpuinfo
```

Monitor specific app CPU:
```sh
adb shell top -n 1 | grep com.example.app
```

Check CPU frequency:
```sh
adb shell cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_cur_freq
```

### Advanced Commands

Profile app CPU usage:
```sh
adb shell dumpsys cpuinfo | grep com.example.app
```

Monitor CPU by process:
```sh
adb shell ps -A -o pid,ppid,name,pcpu
```

Check CPU governor:
```sh
adb shell cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor
```

Monitor CPU temperature:
```sh
adb shell cat /sys/class/thermal/thermal_zone*/temp | head -4
```

Profile CPU over time:
```sh
for i in {1..10}; do
  echo "=== Sample $i ==="
  adb shell top -n 1 | grep com.example.app
  sleep 5
done
```

Check CPU cores:
```sh
adb shell ls /sys/devices/system/cpu/ | grep cpu[0-9]
```

Monitor CPU frequency per core:
```sh
for cpu in /sys/devices/system/cpu/cpu*/cpufreq/scaling_cur_freq; do
  echo "$cpu: $(cat $cpu)"
done
```

Profile CPU intensive operations:
```sh
adb shell perf record -g -p $(adb shell pidof com.example.app)
```

Check CPU scheduling:
```sh
adb shell cat /proc/$(adb shell pidof com.example.app)/schedstat
```

Monitor CPU usage by thread:
```sh
adb shell top -H -n 1 | grep com.example.app
```

Check CPU power states:
```sh
adb shell cat /sys/devices/system/cpu/cpu*/cpuidle/state*/time
```

Profile CPU with systrace:
```sh
adb shell atrace --async_start -c -b 4096 -t 10 sched gfx view
```

Monitor CPU throttling:
```sh
adb shell logcat | grep -E "thermal.*throttle|cpu.*throttle"
```

### Examples

Monitor app CPU usage:
```sh
adb shell top -n 1 | grep com.example.app
```

Profile CPU over time:
```sh
for i in {1..20}; do
  echo "$(date): $(adb shell top -n 1 | grep com.example.app)"
  sleep 2
done
```

Check CPU frequency and governor:
```sh
adb shell cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_cur_freq
adb shell cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor
```

Monitor CPU temperature:
```sh
adb shell cat /sys/class/thermal/thermal_zone*/temp | head -4
```

Profile CPU with detailed info:
```sh
adb shell dumpsys cpuinfo | grep -A 5 com.example.app
```

Check CPU cores and frequencies:
```sh
for cpu in /sys/devices/system/cpu/cpu*/cpufreq/scaling_cur_freq; do
  echo "$cpu: $(cat $cpu)"
done
```

Monitor CPU scheduling:
```sh
adb shell cat /proc/$(adb shell pidof com.example.app)/schedstat
```

## Notes
- CPU profiling may impact device performance
- Some CPU info requires root access
- CPU frequency paths vary by device
- Use `top` for real-time CPU monitoring
- CPU temperature monitoring requires thermal sensors
- Some CPU features vary by Android version
- Use `dumpsys cpuinfo` for detailed CPU usage
- CPU profiling can help identify performance bottlenecks
