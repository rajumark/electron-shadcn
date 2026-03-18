# Power Management - ADB Commands

## Description
Commands for managing device power settings, sleep modes, and power consumption control on Android devices.

### Basic Commands

Put device to sleep:
```sh
adb shell input keyevent KEYCODE_POWER
```

Wake up device:
```sh
adb shell input keyevent KEYCODE_POWER
```

Check screen state:
```sh
adb shell dumpsys power | grep -E "mScreenOn|Display Power"
```

Check battery status:
```sh
adb shell dumpsys battery
```

Enable airplane mode:
```sh
adb shell settings put global airplane_mode_on 1
```

### Advanced Commands

Disable sleep mode:
```sh
adb shell settings put system stay_on_while_plugged_in 7
```

Enable sleep mode:
```sh
adb shell settings put system stay_on_while_plugged_in 0
```

Check power save mode:
```sh
adb shell settings get global low_power
```

Enable power save mode:
```sh
adb shell settings put global low_power 1
```

Disable power save mode:
```sh
adb shell settings put global low_power 0
```

Check screen timeout:
```sh
adb shell settings get system screen_off_timeout
```

Set screen timeout:
```sh
adb shell settings put system screen_off_timeout 30000
```

Monitor power usage:
```sh
adb shell dumpsys batterystats | grep -E "Power|Battery"
```

Check doze mode:
```sh
adb shell dumpsys deviceidle | grep -E "mState|Idle"
```

Force doze mode:
```sh
adb shell dumpsys deviceidle force-idle
```

Check CPU power states:
```sh
adb shell cat /sys/devices/system/cpu/cpu*/cpuidle/state*/time
```

### Examples

Keep screen always on:
```sh
adb shell settings put system stay_on_while_plugged_in 7
```

Set screen timeout to 5 minutes:
```sh
adb shell settings put system screen_off_timeout 300000
```

Enable battery saver:
```sh
adb shell settings put global low_power 1
```

Check current power state:
```sh
adb shell dumpsys power | grep -E "mScreenOn|mWakefulness"
```

Monitor battery drain:
```sh
adb shell dumpsys batterystats --charged
```

Force device sleep:
```sh
adb shell input keyevent KEYCODE_POWER
sleep 2
adb shell input keyevent KEYCODE_POWER
```

## Notes
- Power management requires system permissions
- Some power settings reset on device reboot
- Screen timeout is in milliseconds
- Stay on values: 1=AC, 2=USB, 4=Wireless, 7=Any
- Power save mode affects performance
- Doze mode requires Android 6.0+
- Some power features vary by manufacturer
- Use `dumpsys power` for comprehensive power info
