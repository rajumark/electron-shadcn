# Vibration Control - ADB Commands

## Description
Commands for controlling Android device vibration, haptic feedback management, and vibration pattern testing.

### Basic Commands

Test basic vibration:
```sh
adb shell service call vibrator 6 i32 500
```

Check vibrator status:
```sh
adb shell dumpsys vibrator
```

Vibrate for specific duration:
```sh
adb shell service call vibrator 6 i32 1000
```

Check vibration permissions:
```sh
adb shell dumpsys package com.example.app | grep -E "vibration|VIBRATE"
```

Grant vibration permission:
```sh
adb shell pm grant com.example.app android.permission.VIBRATE
```

### Advanced Commands

Vibration pattern control:
```sh
adb shell service call vibrator 7 i32 3 i32 200 i32 100 i32 200
```

Custom vibration pattern:
```sh
#!/bin/bash
# Pattern: vibrate 200ms, pause 100ms, vibrate 200ms, pause 100ms, vibrate 500ms
adb shell service call vibrator 7 i32 5 i32 200 i32 100 i32 200 i32 100 i32 500
```

Haptic feedback control:
```sh
adb shell service call input 16 i32 1  # Enable haptic feedback
adb shell service call input 16 i32 0  # Disable haptic feedback
```

Vibration intensity control:
```sh
adb shell service call vibrator 8 i32 128  # Set intensity (0-255)
```

Test different vibration types:
```sh
# Short notification
adb shell service call vibrator 6 i32 100

# Long notification
adb shell service call vibrator 6 i32 1000

# Ringtone vibration
adb shell service call vibrator 6 i32 2000
```

Vibration amplitude control:
```sh
adb shell service call vibrator 9 i32 255  # Maximum amplitude
adb shell service call vibrator 9 i32 128  # Medium amplitude
adb shell service call vibrator 9 i32 64   # Low amplitude
```

Vibration frequency control:
```sh
adb shell service call vibrator 10 i32 200  # 200Hz frequency
```

Test vibration patterns:
```sh
#!/bin/bash
echo "=== Vibration Pattern Test ==="

# Dot pattern (Morse code: .)
adb shell service call vibrator 7 i32 1 i32 100

# Dash pattern (Morse code: -)
adb shell service call vibrator 7 i32 1 i32 300

# SOS pattern
adb shell service call vibrator 7 i32 7 i32 100 i32 100 i32 100 i32 300 i32 300 i32 300 i32 100 i32 100 i32 100

# Heartbeat pattern
adb shell service call vibrator 7 i32 6 i32 100 i32 100 i32 200 i32 100 i32 100
```

Vibration cancellation:
```sh
adb shell service call vibrator 5  # Cancel current vibration
```

System vibration settings:
```sh
# Check vibration settings
adb shell settings get system vibrate_when_ringing
adb shell settings get system haptic_feedback_enabled

# Disable system vibration
adb shell settings put system vibrate_when_ringing 0
adb shell settings put system haptic_feedback_enabled 0
```

App-specific vibration:
```sh
# Test app vibration
adb shell am start -n com.example.app/.VibrationActivity
sleep 2
adb shell input tap 500 1000  # Trigger vibration
```

Vibration hardware info:
```sh
adb shell cat /sys/class/timed_output/vibrator/enable
adb shell cat /sys/class/timed_output/vibrator/max_timeout
```

Vibration debugging:
```sh
adb shell logcat | grep -E "vibrator|Vibration|haptic"
```

### Examples

Basic vibration test:
```sh
adb shell service call vibrator 6 i32 500
sleep 1
adb shell service call vibrator 6 i32 1000
```

Vibration pattern test:
```sh
# Create custom pattern
adb shell service call vibrator 7 i32 4 i32 200 i32 100 i32 200 i32 500
```

Haptic feedback control:
```sh
adb shell service call input 16 i32 1  # Enable
# Test haptic feedback
adb shell input keyevent KEYCODE_HOME
adb shell service call input 16 i32 0  # Disable
```

Vibration intensity adjustment:
```sh
for intensity in 64 128 192 255; do
  echo "Testing intensity: $intensity"
  adb shell service call vibrator 8 i32 $intensity
  adb shell service call vibrator 6 i32 300
  sleep 1
done
```

Complete vibration test suite:
```sh
#!/bin/bash
echo "=== Vibration Test Suite ==="

# Basic vibration
echo "Testing basic vibration..."
adb shell service call vibrator 6 i32 500

# Pattern vibration
echo "Testing pattern vibration..."
adb shell service call vibrator 7 i32 3 i32 200 i32 100 i32 200

# Intensity test
echo "Testing intensity levels..."
for i in 64 128 192 255; do
  adb shell service call vibrator 8 i32 $i
  adb shell service call vibrator 6 i32 200
  sleep 1
done

echo "Vibration test completed"
```

## Notes
- Vibration control requires VIBRATE permission for apps
- Some devices may not support all vibration features
- Vibration consumes battery power
- Test vibration patterns for user experience
- Vibration hardware varies by device
- Some commands require specific Android versions
- Use vibration appropriately for accessibility
- Consider user preferences when implementing vibration
