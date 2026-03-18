# Ringtones - ADB Commands

## Description
Commands for managing ringtones, notification sounds, and audio alerts on Android devices.

### Basic Commands

Set custom ringtone:
```sh
adb shell content insert --uri content://settings/system --bind name:s:ringtone --bind value:s:content://media/external/audio/media/1
```

Get current ringtone:
```sh
adb shell settings get system ringtone
```

Set notification sound:
```sh
adb shell content insert --uri content://settings/system --bind name:s:notification_sound --bind value:s:content://media/external/audio/media/2
```

Set alarm sound:
```sh
adb shell content insert --uri content://settings/system --bind name:s:alarm_alert --bind value:s:content://media/external/audio/media/3
```

List available ringtones:
```sh
adb shell content query --uri content://media/external/audio/media --projection _data:_display_name --where "is_ringtone=1"
```

### Advanced Commands

Set ringtone by file path:
```sh
adb shell content insert --uri content://settings/system --bind name:s:ringtone --bind value:s:file:///sdcard/Ringtones/custom.mp3
```

Get ringtone volume:
```sh
adb shell settings get system ringtone_volume
```

Set ringtone volume:
```sh
adb shell settings put system ringtone_volume 8
``

List notification sounds:
```sh
adb shell content query --uri content://media/external/audio/media --projection _data:_display_name --where "is_notification=1"
```

List alarm sounds:
```sh
adb shell content query --uri content://media/external/audio/media --projection _data:_display_name --where "is_alarm=1"
```

Set default ringtone:
```sh
adb shell settings put system ringtone content://settings/system/ringtone_default
```

Check ringtone permissions:
```sh
adb shell dumpsys package com.android.settings | grep -E "READ_EXTERNAL_STORAGE|WRITE_SETTINGS"
```

Monitor ringtone changes:
```sh
adb shell logcat | grep -E "ringtone|Ringtone"
```

Set silent mode (no ringtone):
```sh
adb shell settings put system ringtone ""
```

Get ringtone manager info:
```sh
adb shell dumpsys media.audio_policy | grep -i ringtone
```

### Examples

Set custom MP3 as ringtone:
```sh
adb shell content insert --uri content://settings/system --bind name:s:ringtone --bind value:s:content://media/external/audio/media/100
```

List all ringtones with paths:
```sh
adb shell content query --uri content://media/external/audio/media --projection _id:_display_name:_data --where "is_ringtone=1"
```

Set notification sound:
```sh
adb shell content insert --uri content://settings/system --bind name:s:notification_sound --bind value:s:content://media/external/audio/media/50
```

Reset to default ringtone:
```sh
adb shell settings delete system ringtone
```

Check current ringtone info:
```sh
adb shell settings get system ringtone
adb shell settings get system ringtone_volume
```

## Notes
- Ringtone files must be in /sdcard/Ringtones/ or system media storage
- Content URIs may vary by device and Android version
- Some ringtone changes require WRITE_SETTINGS permission
- Ringtone volume is separate from media volume
- Use content provider operations for ringtone management
- Custom ringtones may need to be scanned by media scanner
- Some devices have restrictions on ringtone file formats
- Ringtone settings persist across reboots
