# Bug Report - ADB Commands

## Description
Commands for generating comprehensive bug reports, collecting system diagnostics, and debugging information from Android devices.

### Basic Commands

Generate bug report:
```sh
adb bugreport
```

Generate bug report to file:
```sh
adb bugreport bugreport.zip
```

Generate bug report with specific name:
```sh
adb bugreport /path/to/custom_report.zip
```

Check bug report progress:
```sh
adb shell dumpsys activity | grep -E "bugreport|report"
```

Get bug report status:
```sh
adb shell getprop ro.debuggable
```

### Advanced Commands

Generate detailed bug report:
```sh
adb shell dumpsys --all > detailed_report.txt
```

Generate bug report with screenshots:
```sh
adb shell screencap /sdcard/bugreport_screenshot.png
adb bugreport
```

Collect system logs:
```sh
adb logcat -d > system_logs.txt
adb shell dmesg > kernel_logs.txt
```

Get device information for bug report:
```sh
adb shell getprop > device_properties.txt
adb shell dumpsys battery > battery_info.txt
```

Generate app-specific bug report:
```sh
adb shell dumpsys package com.example.app > app_info.txt
adb shell dumpsys activity top > activity_info.txt
```

Collect network diagnostics:
```sh
adb shell dumpsys connectivity > network_info.txt
adb shell ip addr > network_config.txt
```

Get memory dump:
```sh
adb shell dumpsys meminfo > memory_info.txt
```

Collect storage information:
```sh
adb shell df -h > storage_info.txt
adb shell dumpsys mount > mount_info.txt
```

Generate performance report:
```sh
adb shell dumpsys cpuinfo > cpu_info.txt
adb shell top -n 1 > process_info.txt
```

Create comprehensive bug report:
```sh
mkdir bugreport_$(date +%Y%m%d_%H%M%S)
cd bugreport_*
adb bugreport ../bugreport.zip
adb logcat -d > logs.txt
adb shell getprop > properties.txt
```

Monitor bug report generation:
```sh
adb shell ps | grep bugreport
```

### Examples

Generate standard bug report:
```sh
adb bugreport device_bugreport.zip
```

Create comprehensive bug report folder:
```sh
mkdir bugreport_$(date +%Y%m%d_%H%M%S)
cd bugreport_*
adb bugreport ../full_report.zip
adb logcat -d > system_logs.txt
adb shell getprop > device_info.txt
adb shell dumpsys battery > battery_status.txt
```

Generate app-specific report:
```sh
adb shell dumpsys package com.example.app > app_package.txt
adb shell dumpsys activity top > current_activity.txt
adb logcat --pid=$(adb shell pidof com.example.app) > app_logs.txt
```

Collect network diagnostics:
```sh
adb shell dumpsys connectivity > network_status.txt
adb shell ip route > routing_table.txt
adb shell ping -c 4 8.8.8.8 > connectivity_test.txt
```

Monitor bug report creation:
```sh
adb shell ps | grep bugreport
adb shell ls -la /data/local/tmp/bugreports/
```

## Notes
- Bug report generation may take several minutes
- Bug reports contain sensitive device information
- Some bug report features require Android 7.0+
- Bug reports can be very large (hundreds of MB)
- Use appropriate permissions when sharing bug reports
- Bug reports include logs, system info, and configurations
- Some device information may be encrypted or protected
- Bug report generation may impact device performance
