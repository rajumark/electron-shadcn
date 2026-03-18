# Sound Recording - ADB Commands

## Description
Commands for recording audio, managing sound capture, and audio recording operations on Android devices.

### Basic Commands

Start audio recording:
```sh
adb shell screenrecord --audio /sdcard/audio_video.mp4
```

Record audio only (requires root):
```sh
adb shell su -c "tinycap /sdcard/recording.wav -D 0 -d 0 -c 1 -r 44100 -b 16 -p 2000"
```

Check audio recording permissions:
```sh
adb shell dumpsys package com.android.soundrecorder | grep permission
```

Get microphone info:
```sh
adb shell dumpsys media.audio_flinger | grep -i microphone
```

Check recording quality settings:
```sh
adb shell settings get system audio_record_quality
```

### Advanced Commands

Record with specific format:
```sh
adb shell su -c "tinycap /sdcard/recording.wav -D 0 -d 0 -c 2 -r 48000 -b 24"
```

Monitor audio input levels:
```sh
adb shell dumpsys media.audio_flinger | grep -E "input|record"
```

Check available audio sources:
```sh
adb shell dumpsys media.audio_policy | grep -E "input|source"
```

Record from specific microphone:
```sh
adb shell su -c "tinycap /sdcard/mic1.wav -D 0 -d 1 -c 1 -r 44100"
```

Get audio hardware info:
```sh
adb shell dumpsys media.audio_policy | grep -A 10 "Audio HAL"
```

Monitor recording activity:
```sh
adb shell logcat | grep -E "AudioRecord|record|microphone"
```

Check audio buffer size:
```sh
adb shell dumpsys media.audio_flinger | grep -E "buffer|frame"
```

Set recording quality:
```sh
adb shell settings put system audio_record_quality high
```

Get supported sample rates:
```sh
adb shell dumpsys media.audio_policy | grep -E "sample|rate"
```

Test microphone functionality:
```sh
adb shell su -c "tinycap /sdcard/test.wav -D 0 -d 0 -c 1 -r 44100 -b 16 -t 3"
```

### Examples

Record 10 seconds of audio:
```sh
adb shell su -c "tinycap /sdcard/test_recording.wav -D 0 -d 0 -c 1 -r 44100 -b 16 -t 10"
```

Record high quality audio:
```sh
adb shell su -c "tinycap /sdcard/hq_recording.wav -D 0 -d 0 -c 2 -r 48000 -b 24"
```

Check if microphone is working:
```sh
adb shell dumpsys media.audio_flinger | grep -i input
```

Monitor recording sessions:
```sh
adb shell logcat | grep -E "AudioRecord|startRecording"
```

Test recording and transfer:
```sh
adb shell su -c "tinycap /sdcard/quick_test.wav -D 0 -d 0 -c 1 -r 44100 -t 5"
adb pull /sdcard/quick_test.wav
```

## Notes
- Audio recording typically requires root access
- tinycap may not be available on all Android versions
- Recording permissions are required for audio capture
- Audio quality depends on hardware capabilities
- Use `dumpsys media.audio_flinger` for audio system info
- Some devices may have different recording tools
- Audio recording may be blocked by privacy settings
- Recording from system audio may require additional setup
