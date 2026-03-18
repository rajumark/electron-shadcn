# Fastboot - ADB Commands

## Description
Commands for managing fastboot operations, flashing partitions, and bootloader-level device management.

### Basic Commands

Reboot to fastboot:
```sh
adb reboot bootloader
```

List fastboot devices:
```sh
fastboot devices
```

Reboot from fastboot:
```sh
fastboot reboot
```

Unlock bootloader:
```sh
fastboot flashing unlock
```

Lock bootloader:
```sh
fastboot flashing lock
```

### Advanced Commands

Flash system partition:
```sh
fastboot flash system system.img
```

Flash boot partition:
```sh
fastboot flash boot boot.img
```

Flash recovery partition:
```sh
fastboot flash recovery recovery.img
```

Flash vendor partition:
```sh
fastboot flash vendor vendor.img
```

Wipe data partition:
```sh
fastboot -w
```

Format data partition:
```sh
fastboot format data
```

Get fastboot variables:
```sh
fastboot getvar all
```

Check device variant:
```sh
fastboot getvar variant
```

Check unlocked status:
```sh
fastboot getvar unlocked
```

Flash boot image with custom kernel:
```sh
fastboot flash boot custom_boot.img
```

Erase cache partition:
```sh
fastboot erase cache
```

### Examples

Flash custom ROM:
```sh
adb reboot bootloader
fastboot flashing unlock
fastboot flash system system.img
fastboot flash boot boot.img
fastboot reboot
```

Wipe device completely:
```sh
adb reboot bootloader
fastboot -w
fastboot reboot
```

Check device information:
```sh
adb reboot bootloader
fastboot getvar all
```

Flash multiple partitions:
```sh
adb reboot bootloader
fastboot flash boot boot.img
fastboot flash system system.img
fastboot flash vendor vendor.img
fastboot reboot
```

Unlock bootloader for development:
```sh
adb reboot bootloader
fastboot flashing unlock
# Confirm on device screen
fastboot reboot
```

Backup partitions before flashing:
```sh
adb reboot bootloader
fastboot boot recovery.img
# Use recovery to backup
```

## Notes
- Fastboot requires unlocked bootloader on most devices
- Flashing wrong partitions can brick device
- Always verify images are for your device model
- Some devices have different fastboot commands
- Bootloader unlock may void warranty
- Use `fastboot getvar` to check device state
- Some commands require OEM unlocking enabled
- Fastboot operations are irreversible in most cases
