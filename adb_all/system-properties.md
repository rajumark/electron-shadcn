# System Properties - ADB Commands

## Description
Commands for viewing and modifying Android system properties using ADB shell getprop and setprop operations.

### Basic Commands

List all system properties:
```sh
adb shell getprop
```

Get specific property:
```sh
adb shell getprop [property_name]
```

Set system property:
```sh
adb shell setprop [property_name] [value]
```

List properties with filter:
```sh
adb shell getprop | grep [filter]
```

Get persistent properties:
```sh
adb shell getprop persist.*
```

### Advanced Commands

Set persistent property:
```sh
adb shell setprop persist.[property_name] [value]
```

Get debug properties:
```sh
adb shell getprop debug.*
```

Get runtime properties:
```sh
adb shell getprop ro.runtime.*
```

Set debug property:
```sh
adb shell setprop debug.log.tags [value]
```

Get build properties:
```sh
adb shell getprop ro.build.*
```

Get telephony properties:
```sh
adb shell getprop ro.telephony.*
```

Set property for specific process:
```sh
adb shell setprop [property_name] [value] && adb shell stop && adb shell start
```

Monitor property changes:
```sh
adb shell watch -n 1 getprop [property_name]
```

Backup system properties:
```sh
adb shell getprop > /sdcard/properties_backup.txt
```

### Examples

Enable USB debugging via ADB:
```sh
adb shell setprop persist.adb.debug.port 5555
```

Check device encryption status:
```sh
adb shell getprop ro.crypto.state
```

Get current locale:
```sh
adb shell getprop persist.sys.locale
```

Set device timezone:
```sh
adb shell setprop persist.sys.timezone "America/New_York"
```

Check if device is in safe mode:
```sh
adb shell getprop persist.sys.safemode
```

## Notes
- Some properties require root access to modify
- Changes to non-persistent properties are lost on reboot
- Use `persist.` prefix for properties that should survive reboot
- Be careful when modifying system properties as it can affect device stability
- Some properties are read-only and cannot be changed
- Use `adb shell dumpsys` for more detailed system information
