# Audio Low-Level - ADB Commands

## Description
Commands for low-level audio control, audio debugging, and advanced audio system management.

### Basic Commands

Check audio devices:
```sh
adb shell cat /proc/asound/cards
```

Check audio streams:
```sh
adb shell dumpsys media.audio_flinger
```

Check audio routing:
```sh
adb shell dumpsys audio
```

Monitor audio sessions:
```sh
adb shell dumpsys media.audio_policy
```

Check audio effects:
```sh
adb shell dumpsys media.audio_effect
```

### Advanced Commands

Audio hardware analysis:
```sh
#!/bin/bash
echo "=== Audio Hardware Analysis ==="

# Check audio cards
echo "Audio cards:"
adb shell cat /proc/asound/cards

# Check audio devices
echo "Audio devices:"
adb shell cat /proc/asound/devices

# Check audio codec info
echo "Audio codec information:"
adb shell find /sys -name "*codec*" -exec cat {} \; 2>/dev/null

# Check audio DSP
echo "Audio DSP information:"
adb shell find /sys -name "*dsp*" -exec ls -la {} \; 2>/dev/null
```

Audio routing control:
```sh
#!/bin/bash
echo "=== Audio Routing Control ==="

# Check current routing
echo "Current audio routing:"
adb shell dumpsys audio | grep -E "routing|output|input"

# Force speaker output
echo "Forcing speaker output:"
adb shell service call audio 3 i32 2 i32 0  # Speaker

# Force headphone output
echo "Forcing headphone output:"
adb shell service call audio 3 i32 1 i32 0  # Headphone

# Force Bluetooth output
echo "Forcing Bluetooth output:"
adb shell service call audio 3 i32 4 i32 0  # Bluetooth

# Verify routing
echo "Audio routing verification:"
adb shell dumpsys audio | grep -E "routing|output"
```

Audio stream management:
```sh
#!/bin/bash
echo "=== Audio Stream Management ==="

# Check audio streams
echo "Audio streams:"
adb shell dumpsys media.audio_flinger | grep -E "stream|volume"

# Set stream volumes
echo "Setting stream volumes:"
adb shell service call audio 1 i32 3 i32 15 f 0.8  # Music volume 80%
adb shell service call audio 1 i32 2 i32 15 f 0.5  # Ring volume 50%
adb shell service call audio 1 i32 5 i32 15 f 0.7  # Alarm volume 70%

# Mute/unmute streams
echo "Muting streams:"
adb shell service call audio 2 i32 3 i32 1  # Mute music
adb shell service call audio 2 i32 3 i32 0  # Unmute music

# Verify stream settings
echo "Stream settings verification:"
adb shell dumpsys media.audio_flinger | grep -E "stream|volume"
```

Audio effect processing:
```sh
#!/bin/bash
echo "=== Audio Effect Processing ==="

# Check available effects
echo "Available audio effects:"
adb shell dumpsys media.audio_effect | head -20

# Enable equalizer
echo "Enabling equalizer:"
adb shell service call audio 10 i32 1000 i32 1  # Equalizer effect

# Configure equalizer bands
echo "Configuring equalizer:"
adb shell service call audio 11 i32 1000 i32 0 f 0.8  # Band 1
adb shell service call audio 11 i32 1000 i32 1 f 0.6  # Band 2
adb shell service call audio 11 i32 1000 i32 2 f 0.7  # Band 3

# Enable bass boost
echo "Enabling bass boost:"
adb shell service call audio 10 i32 1001 i32 1  # Bass boost effect

# Verify effects
echo "Effects verification:"
adb shell dumpsys media.audio_effect | grep -E "equalizer|bass"
```

Low-level audio recording:
```sh
#!/bin/bash
echo "=== Low-Level Audio Recording ==="

# Check audio input devices
echo "Audio input devices:"
adb shell cat /proc/asound/devices | grep -E "capture|input"

# Start raw audio recording
echo "Starting raw audio recording..."
adb shell tinycap /sdcard/raw_audio.wav -D 0 -d 2 -r 44100 -c 2 -b 16 &
RECORD_PID=$!

# Monitor recording
sleep 10

# Stop recording
adb shell kill $RECORD_PID

# Verify recording
echo "Recording verification:"
adb shell ls -la /sdcard/raw_audio.wav
```

Audio latency testing:
```sh
#!/bin/bash
echo "=== Audio Latency Testing ==="

# Check audio latency
echo "Audio latency:"
adb shell dumpsys media.audio_policy | grep -E "latency|buffer"

# Test round-trip latency
echo "Testing round-trip latency..."
adb shell tinyplay /sdcard/test.wav &
sleep 2
adb shell tinycap /sdcard/latency_test.wav -D 0 -d 1 -r 44100 -c 2 -b 16

# Analyze latency
echo "Latency analysis:"
adb shell sox /sdcard/test.wav /sdcard/latency_test.wav /sdcard/latency_output.wav
```

Audio codec debugging:
```sh
#!/bin/bash
echo "=== Audio Codec Debugging ==="

# Check codec status
echo "Codec status:"
adb shell dumpsys media.codec | head -20

# Monitor codec activity
echo "Monitoring codec activity:"
adb shell logcat | grep -E "codec|audio|decoder|encoder" | tail -10

# Check codec parameters
echo "Codec parameters:"
adb shell dumpsys media.audio_flinger | grep -E "codec|format|rate"
```

Audio power management:
```sh
#!/bin/bash
echo "=== Audio Power Management ==="

# Check audio power states
echo "Audio power states:"
adb shell find /sys -name "*audio*" -exec cat {} \; 2>/dev/null

# Force audio power on
echo "Forcing audio power on:"
adb shell echo 1 > /sys/class/audio/power/on

# Monitor audio power consumption
echo "Audio power consumption:"
for i in {1..10}; do
  echo "Power check $i:"
  adb shell cat /sys/class/power_supply/battery/current_now
  sleep 2
done
```

Audio session debugging:
```sh
#!/bin/bash
echo "=== Audio Session Debugging ==="

# Check active audio sessions
echo "Active audio sessions:"
adb shell dumpsys media.audio_policy | grep -E "session|active"

# Monitor session changes
echo "Monitoring session changes..."
adb shell logcat | grep -E "audio.*session|session.*audio" | tail -10

# Check session parameters
echo "Session parameters:"
adb shell dumpsys media.audio_flinger | grep -E "session|track|port"
```

Real-time audio monitoring:
```sh
#!/bin/bash
echo "=== Real-time Audio Monitoring ==="

# Monitor audio system in real-time
while true; do
  echo "=== Audio Monitor $(date) ==="
  
  # Audio streams
  echo "Audio streams:"
  adb shell dumpsys media.audio_flinger | grep -E "stream|active" | tail -5
  
  # Audio routing
  echo "Audio routing:"
  adb shell dumpsys audio | grep -E "routing|output" | tail -3
  
  # Audio effects
  echo "Audio effects:"
  adb shell dumpsys media.audio_effect | grep -E "active|enabled" | tail -3
  
  sleep 10
done
```

### Examples

Basic audio analysis:
```sh
adb shell cat /proc/asound/cards
adb shell dumpsys media.audio_flinger | head -20
adb shell dumpsys audio | head -15
```

Audio routing control:
```sh
adb shell service call audio 3 i32 2 i32 0  # Speaker
adb shell service call audio 1 i32 3 i32 15 f 0.8  # Music volume
adb shell dumpsys audio | grep routing
```

Audio effects:
```sh
adb shell service call audio 10 i32 1000 i32 1  # Enable equalizer
adb shell service call audio 11 i32 1000 i32 0 f 0.8  # Set band
adb shell dumpsys media.audio_effect | grep equalizer
```

Complete audio analysis:
```sh
#!/bin/bash
echo "=== Complete Audio Analysis ==="

# Audio hardware
echo "Audio hardware:"
adb shell cat /proc/asound/cards

# Audio streams
echo "Audio streams:"
adb shell dumpsys media.audio_flinger | head -15

# Audio routing
echo "Audio routing:"
adb shell dumpsys audio | head -10

echo "Audio analysis completed"
```

## Notes
- Low-level audio commands require root access
- Audio routing may affect system audio
- Some audio features depend on hardware support
- Use audio commands carefully in production
- Monitor audio system during debugging
- Some audio parameters may be reset on reboot
- Document audio configuration changes
- Consider user experience when modifying audio settings
