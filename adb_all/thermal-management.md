# Thermal Management - ADB Commands

## Description
Commands for managing Android device temperature, thermal control, and overheating prevention.

### Basic Commands

Check current temperature:
```sh
adb shell cat /sys/class/thermal/thermal_zone*/temp
```

Monitor thermal zones:
```sh
adb shell ls /sys/class/thermal/thermal_zone*/
```

Check CPU temperature:
```sh
adb shell cat /sys/class/thermal/thermal_zone*/temp | grep -E "cpu|CPU"
```

Check battery temperature:
```sh
adb shell dumpsys battery | grep temperature
```

Monitor thermal throttling:
```sh
adb shell cat /sys/class/thermal/thermal_zone*/mode
```

### Advanced Commands

Comprehensive thermal monitoring:
```sh
#!/bin/bash
echo "=== Thermal Monitor ==="
for zone in /sys/class/thermal/thermal_zone*; do
  zone_name=$(cat $zone/type)
  temp=$(cat $zone/temp)
  mode=$(cat $zone/mode 2>/dev/null || echo "N/A")
  echo "$zone_name: $((temp/1000))°C (Mode: $mode)"
done
```

Real-time temperature monitoring:
```sh
while true; do
  clear
  echo "=== Thermal Status $(date) ==="
  for zone in /sys/class/thermal/thermal_zone*; do
    zone_name=$(cat $zone/type)
    temp=$(cat $zone/temp)
    echo "$zone_name: $((temp/1000))°C"
  done
  echo "Battery: $(adb shell dumpsys battery | grep temperature | awk '{print $2/10"°C"}')"
  sleep 5
done
```

Thermal throttling control:
```sh
# Check throttling status
adb shell cat /sys/class/thermal/thermal_zone*/mode

# Force thermal management
adb shell echo 1 > /sys/class/thermal/thermal_zone*/mode
```

CPU thermal management:
```sh
# Check CPU frequency limits
adb shell cat /sys/devices/system/cpu/cpu*/cpufreq/scaling_max_freq

# Reduce CPU frequency for cooling
adb shell echo 800000 > /sys/devices/system/cpu/cpu0/cpufreq/scaling_max_freq
```

GPU thermal management:
```sh
# Check GPU temperature
adb shell cat /sys/class/thermal/thermal_zone*/temp | grep -i gpu

# Reduce GPU performance
adb shell echo performance > /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor
```

Battery thermal protection:
```sh
# Check battery thermal status
adb shell dumpsys battery | grep -E "temperature|health"

# Enable battery protection
adb shell echo 1 > /sys/class/power_supply/battery/temp_alert
```

Thermal policy management:
```sh
# Check thermal policy
adb shell getprop ro.config.thermal_manager

# Set thermal policy
adb shell setprop ro.config.thermal_manager enabled
```

Thermal stress testing:
```sh
#!/bin/bash
echo "=== Thermal Stress Test ==="

# Start stress test
adb shell monkey -p com.example.app --throttle 25 2000 &

# Monitor temperature during stress
for i in {1..60}; do
  echo "=== Sample $i ==="
  for zone in /sys/class/thermal/thermal_zone*; do
    zone_name=$(cat $zone/type)
    temp=$(cat $zone/temp)
    echo "$zone_name: $((temp/1000))°C"
  done
  sleep 2
done
```

Thermal alert setup:
```sh
#!/bin/bash
# Monitor for overheating
while true; do
  max_temp=$(adb shell cat /sys/class/thermal/thermal_zone*/temp | sort -nr | head -1)
  max_temp_c=$((max_temp/1000))
  
  if [ $max_temp_c -gt 70 ]; then
    echo "WARNING: High temperature detected: ${max_temp_c}°C"
    # Take cooling action
    adb shell echo userspace > /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor
    adb shell echo 600000 > /sys/devices/system/cpu/cpu0/cpufreq/scaling_max_freq
  fi
  sleep 10
done
```

Thermal calibration:
```sh
# Reset thermal sensors
adb shell echo 0 > /sys/class/thermal/thermal_zone*/mode
sleep 2
adb shell echo 1 > /sys/class/thermal/thermal_zone*/mode
```

Thermal log analysis:
```sh
adb shell dmesg | grep -E "thermal|temp|overheat"
adb shell logcat -d | grep -E "thermal|temperature|overheat"
```

### Examples

Temperature monitoring:
```sh
for zone in /sys/class/thermal/thermal_zone*; do
  zone_name=$(cat $zone/type)
  temp=$(cat $zone/temp)
  echo "$zone_name: $((temp/1000))°C"
done
```

Thermal stress test:
```sh
adb shell monkey -p com.example.app --throttle 25 2000 &
for i in {1..30}; do
  echo "=== Check $i ==="
  adb shell cat /sys/class/thermal/thermal_zone*/temp | awk '{print $1/1000"°C"}'
  sleep 3
done
```

Thermal throttling check:
```sh
adb shell cat /sys/class/thermal/thermal_zone*/mode
adb shell cat /sys/devices/system/cpu/cpu*/cpufreq/scaling_cur_freq
```

Overheating prevention:
```sh
#!/bin/bash
while true; do
  max_temp=$(adb shell cat /sys/class/thermal/thermal_zone*/temp | sort -nr | head -1)
  max_temp_c=$((max_temp/1000))
  
  if [ $max_temp_c -gt 75 ]; then
    echo "Overheating detected: ${max_temp_c}°C"
    adb shell echo powersave > /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor
  fi
  sleep 30
done
```

## Notes
- Thermal management requires root access for some operations
- High temperatures can damage device hardware
- Thermal throttling affects performance
- Monitor temperature during intensive operations
- Different devices have different thermal zones
- Use thermal management to prevent overheating
- Some thermal controls may not be available on all devices
- Document thermal thresholds for your device
