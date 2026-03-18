# Battery Information - ADB Commands

## Description
Commands for monitoring battery status, health, charging information, and power consumption on Android devices.

### Basic Commands

Get battery status:
```sh
adb shell dumpsys battery
```

Get battery level:
```sh
adb shell dumpsys battery | grep level
```

Check if device is charging:
```sh
adb shell dumpsys battery | grep -E "AC|USB|Wireless"
```

Get battery health:
```sh
adb shell dumpsys battery | grep health
```

Get battery temperature:
```sh
adb shell dumpsys battery | grep temperature
```

### Advanced Commands

Set battery level (for testing):
```sh
adb shell dumpsys battery set level 50
```

Set charging state:
```sh
adb shell dumpsys battery set ac 1
```

Reset battery stats:
```sh
adb shell dumpsys batterystats --reset
```

Get detailed battery stats:
```sh
adb shell dumpsys batterystats
```

Monitor battery usage:
```sh
adb shell dumpsys batterystats | grep -E "Uid|Power"
```

Get battery technology:
```sh
adb shell dumpsys battery | grep technology
```

Check battery voltage:
```sh
adb shell dumpsys battery | grep voltage
```

Get battery capacity:
```sh
adb shell cat /sys/class/power_supply/battery/capacity
```

Monitor battery current:
```sh
adb shell cat /sys/class/power_supply/battery/current_now
```

### Examples

Check battery percentage:
```sh
adb shell dumpsys battery | grep "level:" | awk '{print $2}'
```

Monitor battery temperature:
```sh
adb shell watch -n 5 "dumpsys battery | grep temperature"
```

Get battery usage by app:
```sh
adb shell dumpsys batterystats --charged
```

Simulate low battery:
```sh
adb shell dumpsys battery set level 5
```

Reset battery simulation:
```sh
adb shell dumpsys battery reset
```

## Notes
- Some battery modification commands require root access
- Battery stats reset requires root on newer Android versions
- Temperature is usually reported in tenths of degrees Celsius
- Current values may be positive (charging) or negative (discharging)
- Use `adb shell dumpsys batterystats` for detailed app-by-app usage
- Battery simulation is for development/testing only
