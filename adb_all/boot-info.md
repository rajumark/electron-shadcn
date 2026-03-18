# Boot Information - ADB Commands

## Description
Commands for retrieving boot information, startup processes, bootloader details, and system boot timing on Android devices.

### Basic Commands

Get boot time:
```sh
adb shell cat /proc/uptime
```

Check boot animation status:
```sh
adb shell getprop init.svc.bootanim
```

Get kernel boot time:
```sh
adb shell dmesg | grep -i boot
```

Check system boot complete:
```sh
adb shell getprop sys.boot_completed
```

Get boot loader version:
```sh
adb shell getprop ro.bootloader
```

### Advanced Commands

Get detailed boot log:
```sh
adb shell logcat -d | grep -i boot
```

Check startup services:
```sh
adb shell dumpsys activity services | grep -i boot
```

Get boot reason:
```sh
adb shell getprop ro.boot.bootreason
```

Monitor boot process:
```sh
adb shell logcat | grep -E "boot|startup"
```

Get init process info:
```sh
adb shell ps -A | grep init
```

Check boot partition info:
```sh
adb shell cat /proc/cmdline
```

Get system startup time:
```sh
adb shell dumpsys meminfo system | grep -E "Total|PSS"
```

Check boot mode:
```sh
adb shell getprop ro.bootmode
```

Get boot configuration:
```sh
adb shell getprop | grep boot
```

### Examples

Check if boot completed:
```sh
adb shell getprop sys.boot_completed
# Output: 1 (booted) or 0 (booting)
```

Get device uptime:
```sh
adb shell cat /proc/uptime
# Output: 123456.78 987654.32 (uptime, idle time)
```

Monitor boot animation:
```sh
adb shell watch -n 1 "getprop init.svc.bootanim"
```

Check boot reason:
```sh
adb shell getprop ro.boot.bootreason
# Output: reboot, recovery, etc.
```

Get kernel boot messages:
```sh
adb shell dmesg | grep -E "Linux version|Boot CPU"
```

## Notes
- Some boot information requires root access
- Boot logs may be limited on newer Android versions
- Boot animation control may require system permissions
- Kernel boot messages may be truncated on some devices
- Use `adb shell getprop` for boot-related properties
- Boot timing information varies by device manufacturer
