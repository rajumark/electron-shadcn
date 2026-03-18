# Bootloader - ADB Commands

## Description
Commands for managing bootloader operations, accessing boot modes, and bootloader-related functions on Android devices.

### Basic Commands

Reboot to bootloader:
```sh
adb reboot bootloader
```

Check bootloader version:
```sh
adb shell getprop ro.bootloader
```

Get bootloader info:
```sh
adb shell cat /proc/cmdline | grep -o 'androidboot.[^ ]*' | sort
```

Check bootloader unlock status:
```sh
adb shell getprop ro.boot.flash.locked
```

Reboot to download mode:
```sh
adb shell reboot download
```

### Advanced Commands

Check bootloader configuration:
```sh
adb shell getprop | grep boot
```

Get boot partition info:
```sh
adb shell cat /proc/mtd | grep -E "boot|bootloader"
```

Check secure boot status:
```sh
adb shell getprop ro.boot.verifiedbootstate
```

Get bootloader mode:
```sh
adb shell getprop ro.boot.mode
```

Check bootloader serial:
```sh
adb shell getprop ro.boot.serialno
```

Monitor bootloader messages:
```sh
adb shell dmesg | grep -i bootloader
```

Check bootloader variant:
```sh
adb shell getprop ro.boot.hardware
```

Get boot reason from bootloader:
```sh
adb shell getprop ro.boot.bootreason
```

Check bootloader security:
```sh
adb shell getprop ro.boot.veritymode
```

Get bootloader device tree:
```sh
adb shell cat /proc/device-tree/compatible
```

Check fastboot status:
```sh
adb shell getprop ro.boot.fastboot
```

### Examples

Reboot to bootloader and check status:
```sh
adb reboot bootloader
fastboot devices
```

Check bootloader information:
```sh
adb shell getprop | grep -E "boot|bootloader"
```

Verify bootloader lock status:
```sh
adb shell getprop ro.boot.flash.locked
```

Check secure boot state:
```sh
adb shell getprop ro.boot.verifiedbootstate
```

Get complete boot configuration:
```sh
adb shell cat /proc/cmdline
```

Monitor bootloader-related logs:
```sh
adb shell logcat | grep -E "bootloader|fastboot"
```

## Notes
- Bootloader access may require unlocked bootloader
- Some bootloader info is only available in fastboot mode
- Bootloader commands vary by device manufacturer
- Unlocking bootloader may void warranty
- Some devices have custom bootloader modes
- Bootloader properties are read-only
- Use `fastboot` commands when in bootloader mode
- Bootloader access may be restricted on carrier devices
