# Audio Routing - ADB Commands

## Description
Commands for managing audio output routing, switching between speakers/headphones, and audio device selection on Android devices.

### Basic Commands

Get audio routing info:
```sh
adb shell dumpsys audio | grep -E "Routing|Device"
```

Force speaker output:
```sh
adb shell service call audio 6 i32 2 i32 0
```

Force headphone output:
```sh
adb shell service call audio 6 i32 4 i32 0
```

Get connected audio devices:
```sh
adb shell dumpsys audio | grep -E "mAvailableOutputDevices|mConnectedDevice"
```

Check current audio output:
```sh
adb shell dumpsys audio | grep -E "mOutputDevice|mPreferredDevice"
```

### Advanced Commands

List all audio devices:
```sh
adb shell dumpsys audio | grep -A 20 "Devices:"
```

Force Bluetooth audio:
```sh
adb shell service call audio 6 i32 8 i32 0
```

Force earpiece output:
```sh
adb shell service call audio 6 i32 1 i32 0
```

Get audio policy info:
```sh
adb shell dumpsys media.audio_policy | grep -E "device|output"
```

Monitor audio routing changes:
```sh
adb shell logcat | grep -E "AudioFlinger|audio_policy"
```

Check audio focus:
```sh
adb shell dumpsys audio | grep -i focus
```

Force USB audio output:
```sh
adb shell service call audio 6 i32 16 i32 0
```

Get audio stream routing:
```sh
adb shell dumpsys audio | grep -E "STREAM_.*Device"
```

Reset audio routing:
```sh
adb shell service call audio 6 i32 0 i32 0
```

Check HDMI audio status:
```sh
adb shell dumpsys audio | grep -i hdmi
```

### Examples

Force speaker for media:
```sh
adb shell service call audio 6 i32 2 i32 0
```

Switch to headphones when connected:
```sh
adb shell service call audio 6 i32 4 i32 0
```

Check current audio device:
```sh
adb shell dumpsys audio | grep -E "mOutputDevice|mSelectedOutputDevice"
```

Force Bluetooth audio:
```sh
adb shell service call audio 6 i32 8 i32 0
```

Monitor audio device connections:
```sh
adb shell logcat | grep -E "audio.*device.*connect|audio.*device.*disconnect"
```

Reset to automatic routing:
```sh
adb shell service call audio 6 i32 0 i32 0
```

## Notes
- Audio routing requires system permissions
- Device codes may vary between Android versions
- Some routing changes may not work on all devices
- Audio routing affects all audio streams
- Use `dumpsys audio` for comprehensive routing info
- Device types: 1=earpiece, 2=speaker, 4=headphones, 8=Bluetooth, 16=USB
- Audio routing may reset when devices are connected/disconnected
- Some devices have custom audio routing implementations
