# Startup Control - ADB Commands

## Description
Commands for managing device startup, boot processes, and controlling applications that launch at boot time.

### Basic Commands

Check boot completed status:
```sh
adb shell getprop sys.boot_completed
```

List startup apps:
```sh
adb shell dumpsys activity services | grep -E "boot|startup"
```

Check boot animation:
```sh
adb shell getprop init.svc.bootanim
```

Disable boot animation:
```sh
adb shell setprop debug.sf.nobootanimation 1
```

Enable boot animation:
```sh
adb shell setprop debug.sf.nobootanimation 0
```

### Advanced Commands

Check boot time:
```sh
adb shell cat /proc/uptime
```

Monitor boot process:
```sh
adb shell logcat | grep -E "boot|startup|init"
```

Check startup services:
```sh
adb shell getprop | grep init.svc
```

Disable app auto-start:
```sh
adb shell pm disable-user com.example.app
```

Enable app auto-start:
```sh
adb shell pm enable com.example.app
```

Check boot receiver apps:
```sh
adb shell dumpsys package | grep -A 5 -B 5 "BOOT_COMPLETED"
```

Monitor boot performance:
```sh
adb shell dumpsys meminfo system | grep -E "Total|PSS"
```

Check boot reasons:
```sh
adb shell getprop ro.boot.bootreason
```

Control startup apps via settings:
```sh
adb shell settings put secure enabled_accessibility_services ""
```

Check boot log:
```sh
adb shell logcat -d | grep -E "Boot|boot|BOOT"
```

Monitor boot sequence:
```sh
adb shell dmesg | grep -E "Android|kernel|init"
```

### Examples

Check if device is fully booted:
```sh
adb shell getprop sys.boot_completed
# Output: 1 = booted, 0 = booting
```

Monitor boot process:
```sh
adb reboot && adb logcat | grep -E "boot|system.*ready"
```

Disable app from starting at boot:
```sh
adb shell pm disable-user com.example.app
```

Check boot performance:
```sh
adb shell dumpsys activity top | grep -E "TASK|ACTIVITY"
```

Get boot time statistics:
```sh
adb shell cat /proc/uptime && adb shell getprop ro.boot.bootreason
```

Monitor boot animation:
```sh
adb shell watch -n 1 "getprop init.svc.bootanim"
```

## Notes
- Startup control requires system permissions
- Some apps may ignore startup restrictions
- Boot animation changes may not persist
- Boot time varies by device and Android version
- Use `getprop sys.boot_completed` to check boot status
- Disabling system apps may cause instability
- Boot monitoring may impact boot performance
- Some startup controls require root access
