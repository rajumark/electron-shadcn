# Volume Control - ADB Commands

## Description
Commands for managing audio volume levels, volume streams, and audio output settings on Android devices.

### Basic Commands

Set media volume:
```sh
adb shell media volume --show --stream 3 --set 10
```

Set ring volume:
```sh
adb shell media volume --show --stream 2 --set 8
```

Set alarm volume:
```sh
adb shell media volume --show --stream 4 --set 10
```

Get current volume levels:
```sh
adb shell dumpsys audio | grep -E "STREAM_MUSIC|STREAM_RING|STREAM_ALARM"
```

Mute device:
```sh
adb shell service call audio 3 i32 3 i32 0 i32 1
```

### Advanced Commands

Set volume by percentage:
```sh
adb shell service call audio 3 i32 3 i32 0 i32 $((15 * 50 / 100))
```

Get volume range:
```sh
adb shell dumpsys audio | grep -E "mIndexMin|mIndexMax"
```

Set system volume:
```sh
adb shell media volume --stream 1 --set 5
```

Set notification volume:
```sh
adb shell media volume --stream 5 --set 8
```

Set voice call volume:
```sh
adb shell media volume --stream 0 --set 7
```

Check volume streams:
```sh
adb shell dumpsys audio | grep "STREAM_"
```

Monitor volume changes:
```sh
adb shell dumpsys audio | grep -E "mIndex|STREAM"
```

Set absolute volume:
```sh
adb shell service call audio 3 i32 3 i32 0 i32 10
```

Get mute status:
```sh
adb shell dumpsys audio | grep -i mute
```

Set Bluetooth volume:
```sh
adb shell service call audio 3 i32 6 i32 0 i32 12
```

### Examples

Set media volume to 50%:
```sh
adb shell service call audio 3 i32 3 i32 0 i32 $((15 * 50 / 100))
```

Mute all audio:
```sh
for stream in 0 1 2 3 4 5; do
  adb shell service call audio 3 i32 $stream i32 0 i32 0
done
```

Set maximum volume:
```sh
adb shell service call audio 3 i32 3 i32 0 i32 15
```

Check all volume levels:
```sh
adb shell dumpsys audio | grep -E "STREAM_.*mIndex"
```

Gradually increase volume:
```sh
for level in {1..15}; do
  adb shell service call audio 3 i32 3 i32 0 i32 $level
  sleep 0.5
done
```

## Notes
- Volume range typically 0-15 (varies by device)
- Stream types: 0=voice, 1=system, 2=ring, 3=media, 4=alarm, 5=notification
- Volume control may require system permissions
- Some devices have different volume ranges
- Audio routing may affect volume settings
- Use `dumpsys audio` for comprehensive audio information
- Volume settings persist across reboots
- Some apps may override system volume settings
