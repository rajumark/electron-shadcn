# Reboot Operations - ADB Commands

## Description
Commands for rebooting Android devices, managing restart operations, and controlling device boot sequences.

### Basic Commands

Reboot device:
```sh
adb reboot
```

Reboot to recovery:
```sh
adb reboot recovery
```

Reboot to bootloader:
```sh
adb reboot bootloader
```

Reboot to fastboot:
```sh
adb reboot fastboot
```

Force reboot (no waiting):
```sh
adb shell reboot -p
```

### Advanced Commands

Reboot to safe mode:
```sh
adb shell reboot -s
```

Reboot with specific reason:
```sh
adb shell reboot "ota_update"
```

Schedule reboot:
```sh
adb shell su -c "echo +5 > /sys/power/rtcwake"
```

Check last reboot reason:
```sh
adb shell getprop ro.boot.bootreason
```

Monitor reboot process:
```sh
adb logcat | grep -E "boot|reboot|shutdown"
```

Check uptime before reboot:
```sh
adb shell cat /proc/uptime
```

Reboot and wait for device:
```sh
adb reboot && adb wait-for-device
```

Force immediate reboot:
```sh
adb shell su -c "reboot -f"
```

Check boot animation status:
```sh
adb shell getprop init.svc.bootanim
```

Reboot to download mode (Samsung):
```sh
adb shell reboot download
```

### Examples

Reboot device and wait:
```sh
adb reboot && adb wait-for-device && echo "Device is ready"
```

Reboot to recovery mode:
```sh
adb reboot recovery
```

Check device uptime before reboot:
```sh
adb shell cat /proc/uptime
adb reboot
```

Reboot and check when ready:
```sh
adb reboot
while ! adb shell getprop sys.boot_completed | grep -q "1"; do
  sleep 2
  echo "Waiting for boot completion..."
done
```

Force reboot if hung:
```sh
adb shell su -c "reboot -f"
```

Monitor reboot process:
```sh
adb reboot && adb logcat | grep -E "boot|system.*ready"
```

## Notes
- Some reboot modes require root access
- Reboot to bootloader/fastboot requires unlocked bootloader
- Safe mode may not be available on all Android versions
- Reboot reasons may be logged for system analysis
- Use `wait-for-device` after reboot for automation
- Some devices have custom reboot modes
- Reboot may interrupt ongoing operations
- Always save data before rebooting devices
