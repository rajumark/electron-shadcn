# Recovery Mode - ADB Commands

## Description
Commands for managing recovery mode operations, accessing recovery partitions, and recovery-related functions on Android devices.

### Basic Commands

Reboot to recovery:
```sh
adb reboot recovery
```

Access recovery shell:
```sh
adb shell
```

Check recovery partition:
```sh
adb shell cat /proc/mtd | grep recovery
```

Mount system in recovery:
```sh
adb shell mount /system
```

Apply update from ADB:
```sh
adb sideload update.zip
```

### Advanced Commands

Check recovery version:
```sh
adb shell getprop ro.recovery.version
```

Wipe data in recovery:
```sh
adb shell wipe data
```

Wipe cache partition:
```sh
adb shell wipe cache
```

Mount all partitions:
```sh
adb shell mount -a
```

Check recovery logs:
```sh
adb shell cat /cache/recovery/log
```

Check recovery last log:
```sh
adb shell cat /cache/recovery/last_log
```

Format data partition:
```sh
adb shell format data
```

Install update from storage:
```sh
adb shell install /sdcard/update.zip
```

Check recovery mode status:
```sh
adb shell getprop ro.boot.recovery
```

Backup system in recovery:
```sh
adb shell backup_system
```

Restore system in recovery:
```sh
adb shell restore_system
```

### Examples

Reboot to recovery and apply update:
```sh
adb reboot recovery
# Wait for device to enter recovery
adb sideload update.zip
```

Check recovery logs:
```sh
adb reboot recovery
adb shell cat /cache/recovery/last_log
```

Wipe device in recovery:
```sh
adb reboot recovery
adb shell wipe data
adb shell wipe cache
```

Mount system in recovery:
```sh
adb reboot recovery
adb shell mount /system
adb shell ls /system/app
```

Install custom recovery:
```sh
adb reboot bootloader
fastboot flash recovery recovery.img
fastboot reboot recovery
```

Check recovery version:
```sh
adb shell getprop | grep recovery
```

## Notes
- Recovery mode operations may wipe device data
- Some recovery commands require custom recovery
- Stock recovery has limited functionality
- Use `adb sideload` for OTA updates
- Recovery access may be restricted on some devices
- Always backup data before recovery operations
- Custom recovery (TWRP) provides more features
- Recovery partition size varies by device
