# Performance Tuning - ADB Commands

## Description
Commands for optimizing device performance, tuning system settings, and performance enhancement.

### Basic Commands
Check current performance:
```sh
adb shell dumpsys cpuinfo
```

Monitor memory usage:
```sh
adb shell free -m
```

Check storage performance:
```sh
adb shell df -h
```

Monitor battery usage:
```sh
adb shell dumpsys batterystats
```

Check GPU performance:
```sh
adb shell dumpsys gfxinfo
```

### Advanced Commands
Optimize memory:
```sh
adb shell am send-trim-memory com.example.app RUNNING_LOW
```

Force garbage collection:
```sh
adb shell am send-trim-memory com.example.app RUNNING_CRITICAL
```

Optimize database:
```sh
adb shell dumpsys activity provider | grep -E "database|cache"
```

Tune CPU governor:
```sh
adb shell echo performance > /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor
```

Optimize I/O scheduler:
```sh
adb shell echo noop > /sys/block/mmcblk0/queue/scheduler
```

Clean system cache:
```sh
adb shell echo 3 > /proc/sys/vm/drop_caches
```

Tune memory management:
```sh
adb shell echo 100 > /proc/sys/vm/swappiness
```

Optimize network settings:
```sh
adb shell settings put global tcp_default_init_rwnd 10
```

Disable animations:
```sh
adb shell settings put global window_animation_scale 0
adb shell settings put global transition_animation_scale 0
adb shell settings put global animator_duration_scale 0
```

Force GPU rendering:
```sh
adb shell settings put global debug.sf.hw 1
```

## Notes
- Performance tuning requires root access for many commands
- Changes may affect system stability
- Always backup before making performance changes
- Test tuning effects on non-production devices
