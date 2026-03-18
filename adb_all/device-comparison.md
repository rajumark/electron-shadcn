# Device Comparison - ADB Commands

## Description
Commands for comparing multiple devices, analyzing device differences, and cross-device analysis.

### Basic Commands
Compare device models:
```sh
adb devices | grep -v "List" | while read device; do
  echo "=== $device ==="
  adb -s $device shell getprop ro.product.model
done
```

Compare Android versions:
```sh
for device in $(adb devices | grep -v "List" | awk '{print $1}'); do
  echo "$device: $(adb -s $device shell getprop ro.build.version.release)"
done
```

Compare storage usage:
```sh
for device in $(adb devices | grep -v "List" | awk '{print $1}'); do
  echo "=== $device ==="
  adb -s $device shell df -h
done
```

### Advanced Commands
Comprehensive device comparison:
```sh
for device in $(adb devices | grep -v "List" | awk '{print $1}'); do
  echo "=== Device: $device ==="
  echo "Model: $(adb -s $device shell getprop ro.product.model)"
  echo "Android: $(adb -s $device shell getprop ro.build.version.release)"
  echo "Memory: $(adb -s $device shell free -m | grep Mem)"
  echo "Storage: $(adb -s $device shell df -h /data)"
  echo "=================="
done
```

Compare app installations:
```sh
for device in $(adb devices | grep -v "List" | awk '{print $1}'); do
  echo "=== $device Apps ==="
  adb -s $device shell pm list packages -3 | wc -l
done
```

Compare performance metrics:
```sh
for device in $(adb devices | grep -v "List" | awk '{print $1}'); do
  echo "=== $device Performance ==="
  adb -s $device shell dumpsys cpuinfo | head -5
done
```

## Notes
- Use device-specific commands with -s flag
- Comparison scripts help identify device differences
- Consider device capabilities when comparing
- Document comparison results for analysis
