# Microphone Control - ADB Commands

## Description
Commands for controlling Android microphone hardware, managing audio recording, and microphone feature testing.

### Basic Commands

Check microphone availability:
```sh
adb shell pm list features | grep microphone
```

Check audio recording permissions:
```sh
adb shell dumpsys package com.example.app | grep -E "microphone|RECORD_AUDIO"
```

Grant recording permission:
```sh
adb shell pm grant com.example.app android.permission.RECORD_AUDIO
```

Check microphone status:
```sh
adb shell dumpsys audio | grep -E "mic|microphone"
```

Test audio recording:
```sh
adb shell tinycap /sdcard/test.wav -D 0 -d 0 -c 1 -r 44100 -t 5
```

### Advanced Commands

Audio hardware info:
```sh
adb shell dumpsys media.audio_flinger | grep -E "input|mic|microphone"
```

Microphone array info:
```sh
adb shell dumpsys audio | grep -A 5 "Input devices"
```

Test microphone quality:
```sh
adb shell tinycap /sdcard/mic_test.wav -D 0 -d 0 -c 2 -r 48000 -t 10
```

Microphone gain control:
```sh
adb shell service call audio 23 i32 0 i32 100  # Set gain to 100
```

Noise reduction test:
```sh
adb shell tinycap /sdcard/noise_test.wav -D 0 -d 0 -c 1 -r 16000 -t 5
```

Microphone calibration:
```sh
adb shell cat /sys/class/sound/card0/input_mic/calibration
```

Audio routing to microphone:
```sh
adb shell service call audio 20 i32 0 i32 1  # Route to primary mic
```

Test stereo recording:
```sh
adb shell tinycap /sdcard/stereo_test.wav -D 0 -d 0 -c 2 -r 44100 -t 10
```

Microphone sensitivity test:
```sh
adb shell service call audio 24 i32 0 i32 80  # Set sensitivity
```

Check audio buffer:
```sh
adb shell cat /proc/asound/card0/pcm0p/sub0/status
```

Microphone mute control:
```sh
adb shell service call audio 25 i32 0 i32 1  # Mute microphone
adb shell service call audio 25 i32 0 i32 0  # Unmute microphone
```

Audio latency test:
```sh
adb shell tinycap /sdcard/latency_test.wav -D 0 -d 0 -c 1 -r 44100 -t 1
```

Microphone hardware test:
```sh
adb shell cat /sys/class/sound/card0/codec#0/mic_detect
```

### Examples

Check microphone hardware:
```sh
adb shell pm list features | grep microphone
adb shell dumpsys audio | grep -E "mic|input"
```

Test basic recording:
```sh
adb shell tinycap /sdcard/basic_test.wav -D 0 -d 0 -c 1 -r 44100 -t 5
adb pull /sdcard/basic_test.wav
```

Microphone gain adjustment:
```sh
adb shell service call audio 23 i32 0 i32 150
adb shell tinycap /sdcard/gain_test.wav -D 0 -d 0 -c 1 -r 44100 -t 5
```

Stereo recording test:
```sh
adb shell tinycap /sdcard/stereo_test.wav -D 0 -d 0 -c 2 -r 48000 -t 10
```

Microphone mute test:
```sh
adb shell service call audio 25 i32 0 i32 1  # Mute
adb shell tinycap /sdcard/muted_test.wav -D 0 -d 0 -c 1 -r 44100 -t 3
adb shell service call audio 25 i32 0 i32 0  # Unmute
```

## Notes
- Microphone operations require RECORD_AUDIO permission
- Some devices have multiple microphones
- Audio recording may be affected by system settings
- Test microphone quality for audio-dependent apps
- Microphone hardware varies by device
- Some commands require specific Android versions
- Audio recording consumes battery and storage
- Consider privacy implications when testing microphones
