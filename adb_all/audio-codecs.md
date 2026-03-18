# Audio Codecs - ADB Commands

## Description
Commands for checking audio codec support, managing audio formats, and codec information on Android devices.

### Basic Commands

Get supported audio codecs:
```sh
adb shell dumpsys media.audio_flinger | grep -E "codec|format"
```

Check audio hardware capabilities:
```sh
adb shell dumpsys media.audio_policy | grep -E "codec|sample|bit"
```

Get audio format info:
```sh
adb shell dumpsys media.audio_flinger | grep -E "PCM|format|bit"
```

Check supported sample rates:
```sh
adb shell dumpsys media.audio_policy | grep -E "sample.*rate|rate.*sample"
```

Get audio buffer configuration:
```sh
adb shell dumpsys media.audio_flinger | grep -E "buffer|frame"
```

### Advanced Commands

List all audio profiles:
```sh
adb shell dumpsys media.audio_policy | grep -A 10 -B 5 "Profile"
```

Check codec support for specific format:
```sh
adb shell dumpsys media.audio_policy | grep -E "AAC|MP3|FLAC|OPUS"
```

Get audio HAL information:
```sh
adb shell dumpsys media.audio_policy | grep -A 20 "Audio HAL"
```

Check Bluetooth codec support:
```sh
adb shell dumpsys bluetooth_manager | grep -i codec
```

Get audio device codec info:
```sh
adb shell dumpsys media.audio_flinger | grep -E "device.*codec|codec.*device"
```

Monitor audio codec usage:
```sh
adb shell logcat | grep -E "codec|AudioCodec"
```

Check AAC codec support:
```sh
adb shell dumpsys media.audio_policy | grep -A 5 -B 5 "AAC"
```

Get audio compression info:
```sh
adb shell dumpsys media.audio_flinger | grep -E "compress|bitrate"
```

Check surround sound support:
```sh
adb shell dumpsys media.audio_policy | grep -E "surround|5.1|7.1"
```

Get audio session codec info:
```sh
adb shell dumpsys media.audio_flinger | grep -E "session.*codec|codec.*session"
```

### Examples

Check if device supports FLAC:
```sh
adb shell dumpsys media.audio_policy | grep -i flac
```

Get all supported audio formats:
```sh
adb shell dumpsys media.audio_policy | grep -E "format|codec" | sort | uniq
```

Check high-resolution audio support:
```sh
adb shell dumpsys media.audio_policy | grep -E "24.*bit|96.*kHz|192.*kHz"
```

Monitor audio codec initialization:
```sh
adb shell logcat | grep -E "AudioCodec.*init|codec.*open"
```

Check Bluetooth audio codecs:
```sh
adb shell settings get global bluetooth_a2dp_codec_config
```

Get audio hardware sample rates:
```sh
adb shell dumpsys media.audio_policy | grep -E "sample.*rate.*Hz"
```

## Notes
- Codec support varies by device manufacturer
- Some codec information requires root access
- Audio HAL implementation affects available codecs
- Bluetooth codec support may be separate from local codecs
- Use `dumpsys media.audio_policy` for comprehensive codec info
- Codec capabilities may depend on hardware limitations
- Some codecs may require specific Android versions
- Audio codec selection may be automatic based on content
