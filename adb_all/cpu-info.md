# CPU Information - ADB Commands

## Description
Commands for monitoring CPU usage, performance, frequency, and processor information on Android devices.

### Basic Commands

Get CPU info:
```sh
adb shell cat /proc/cpuinfo
```

Monitor CPU usage:
```sh
adb shell top -n 1 | grep CPU
```

Get CPU load average:
```sh
adb shell cat /proc/loadavg
```

Check CPU frequency:
```sh
adb shell cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_cur_freq
```

List CPU cores:
```sh
adb shell ls /sys/devices/system/cpu/ | grep cpu[0-9]
```

### Advanced Commands

Monitor CPU usage by process:
```sh
adb shell top -n 1
```

Get CPU governor:
```sh
adb shell cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor
```

Set CPU governor:
```sh
adb shell echo performance > /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor
```

Get available frequencies:
```sh
adb shell cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_available_frequencies
```

Monitor CPU temperature:
```sh
adb shell cat /sys/class/thermal/thermal_zone*/temp | head -4
```

Get CPU usage percentage:
```sh
adb shell dumpsys cpuinfo
```

Check CPU affinity:
```sh
adb shell taskset -c -p [pid]
```

Monitor CPU in real-time:
```sh
adb shell watch -n 1 "cat /proc/loadavg"
```

Get CPU time statistics:
```sh
adb shell cat /proc/stat | grep cpu
```

### Examples

Monitor CPU usage continuously:
```sh
adb shell top -d 2
```

Check all CPU cores frequency:
```sh
for i in /sys/devices/system/cpu/cpu*/cpufreq/scaling_cur_freq; do echo "$i: $(cat $i)"; done
```

Set CPU governor to performance:
```sh
adb shell su -c "echo performance > /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor"
```

Monitor CPU temperature:
```sh
adb shell watch -n 5 "cat /sys/class/thermal/thermal_zone*/temp"
```

Get CPU architecture details:
```sh
adb shell lscpu
```

## Notes
- CPU frequency control requires root access
- Governor settings may vary between devices
- Temperature paths may differ by device manufacturer
- CPU usage commands may show different formats on Android versions
- Some CPU info files may not be accessible on all devices
- Use `adb shell dumpsys cpuinfo` for process-level CPU usage
