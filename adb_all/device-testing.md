# Device Testing - ADB Commands

## Description
Commands for device testing, quality assurance, and device validation procedures.

### Basic Commands
Device connectivity test:
```sh
adb shell ping -c 4 8.8.8.8
```

Hardware test:
```sh
adb shell dumpsys sensorservice
```

Display test:
```sh
adb shell dumpsys display
```

Audio test:
```sh
adb shell dumpsys audio
```

### Advanced Commands
Comprehensive device test:
```sh
#!/bin/bash
echo "=== Device Test Suite ==="
echo "Connectivity: $(adb shell ping -c 1 8.8.8.8 >/dev/null && echo "OK" || echo "FAIL")"
echo "Storage: $(adb shell df -h | grep -q /data && echo "OK" || echo "FAIL")"
echo "Memory: $(adb shell free -m | grep -q Mem && echo "OK" || echo "FAIL")"
echo "Camera: $(adb shell dumpsys media.camera | grep -q "Camera" && echo "OK" || echo "FAIL")"
echo "Sensors: $(adb shell dumpsys sensorservice | grep -q "Sensor" && echo "OK" || echo "FAIL")"
```

Stress testing:
```sh
for i in {1..100}; do
  adb shell am start -n com.example.app/.MainActivity
  sleep 2
  adb shell am force-stop com.example.app
done
```

Performance testing:
```sh
adb shell dumpsys cpuinfo > cpu_test.txt
adb shell dumpsys meminfo > mem_test.txt
adb shell dumpsys gfxinfo > gfx_test.txt
```

Network testing:
```sh
adb shell "ping -c 10 8.8.8.8 > network_test.txt"
adb shell "traceroute 8.8.8.8 > route_test.txt"
adb shell "nslookup google.com > dns_test.txt"
```

Battery testing:
```sh
adb shell dumpsys batterystats --reset
# Run device usage test
adb shell dumpsys batterystats > battery_test.txt
```

Display testing:
```sh
adb shell dumpsys display > display_test.txt
for brightness in {0..255..51}; do
  adb shell settings put system screen_brightness $brightness
  sleep 1
done
```

Audio testing:
```sh
adb shell dumpsys audio > audio_test.txt
adb shell "tinycap /sdcard/audio_test.wav -D 0 -d 0 -c 1 -r 44100 -t 5"
```

Camera testing:
```sh
adb shell dumpsys media.camera > camera_test.txt
adb shell "am start -a android.media.action.IMAGE_CAPTURE"
sleep 3
adb shell screencap /sdcard/camera_test.png
```

Sensor testing:
```sh
adb shell dumpsys sensorservice > sensor_test.txt
adb shell "watch -n 1 'dumpsys sensorservice | grep -E \"Accelerometer|Gyroscope\"'"
```

## Notes
- Testing may affect device performance
- Use controlled testing environments
- Document test results and procedures
- Compare results against baseline measurements
- Test on various device configurations
