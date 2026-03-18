# Shutdown Operations - ADB Commands

## Description
Commands for shutting down Android devices, managing power off operations, and controlling device shutdown procedures.

### Basic Commands

Shutdown device:
```sh
adb shell reboot -p
```

Power off device:
```sh
adb shell su -c "reboot -p"
```

Check shutdown reason:
```sh
adb shell getprop sys.power.off
```

Force immediate shutdown:
```sh
adb shell su -c "poweroff"
```

Schedule shutdown:
```sh
adb shell su -c "shutdown -h +5"
```

### Advanced Commands

Check battery before shutdown:
```sh
adb shell dumpsys battery | grep level
```

Graceful shutdown with timeout:
```sh
adb shell am broadcast -a android.intent.action.ACTION_SHUTDOWN
```

Monitor shutdown process:
```sh
adb shell logcat | grep -E "shutdown|power.*off"
```

Check shutdown logs:
```sh
adb shell logcat -d | grep -E "Shutdown|shutdown"
```

Force shutdown (no waiting):
```sh
adb shell su -c "echo 1 > /sys/power/state"
```

Check power management state:
```sh
adb shell dumpsys power | grep -E "mWakefulness|mPowerState"
```

Shutdown with specific reason:
```sh
adb shell su -c "reboot -p shutdown_reason"
```

Check last shutdown time:
```sh
adb shell getprop ro.boot.shutdown_reason
```

Monitor power events:
```sh
adb shell logcat | grep -E "POWER|power|shutdown"
```

Check system readiness for shutdown:
```sh
adb shell dumpsys activity | grep -E "mSleeping|mSleeping"
```

Emergency shutdown:
```sh
adb shell su -c "echo o > /proc/sysrq-trigger"
```

### Examples

Graceful shutdown:
```sh
adb shell am broadcast -a android.intent.action.ACTION_SHUTDOWN
sleep 5
adb shell reboot -p
```

Check battery before shutdown:
```sh
adb shell dumpsys battery | grep level
adb shell reboot -p
```

Monitor shutdown sequence:
```sh
adb shell logcat | grep -E "shutdown|power.*off" &
adb shell reboot -p
```

Force shutdown if hung:
```sh
adb shell su -c "reboot -p"
```

Check shutdown history:
```sh
adb shell logcat -d | grep -E "shutdown|power.*off" | tail -10
```

Emergency power off:
```sh
adb shell su -c "echo 1 > /sys/power/state"
```

## Notes
- Shutdown commands may require root access
- Some shutdown methods may not work on all devices
- Force shutdown may cause data loss
- Always save data before shutting down
- Use `reboot -p` for standard shutdown
- Emergency shutdown should be last resort
- Some devices have custom shutdown procedures
- Monitor shutdown process to ensure proper completion
