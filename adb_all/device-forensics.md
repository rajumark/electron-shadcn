# Device Forensics - ADB Commands

## Description
Commands for device forensics, data extraction, and forensic analysis.

### Basic Commands
Extract device information:
```sh
adb shell getprop > device_info.txt
```

List all files:
```sh
adb shell find / -type f > file_list.txt
```

Extract app data:
```sh
adb shell tar -czf /sdcard/app_data.tar.gz /data/data/com.example.app
```

Get system logs:
```sh
adb logcat -d > system_logs.txt
```

### Advanced Commands
Forensic image creation:
```sh
adb shell "dd if=/dev/block/data of=/sdcard/data.img"
```

Memory dump:
```sh
adb shell "cat /proc/kcore > memory_dump.bin"
```

Partition analysis:
```sh
adb shell "fdisk -l /dev/block/mmcblk0"
```

Deleted file recovery:
```sh
adb shell "find /data -name '*~' -o -name '*.tmp'"
```

Timeline analysis:
```sh
adb shell "find /data -printf '%T@ %p\n' | sort -n"
```

Network forensics:
```sh
adb shell "netstat -an > network_state.txt"
```

Process forensics:
```sh
adb shell "ps -aux > process_list.txt"
```

App usage forensics:
```sh
adb shell "dumpsys usagestats > usage_stats.txt"
```

Call log extraction:
```sh
adb shell "content query --uri content://call_log/calls > call_log.txt"
```

SMS extraction:
```sh
adb shell "content query --uri content://sms > sms_log.txt"
```

Browser history:
```sh
adb shell "find /data/data/com.android.browser -name '*.db' -exec sqlite3 {} '.dump' \;"
```

Location data:
```sh
adb shell "find /data/data -name '*location*' -o -name '*gps*'"
```

## Notes
- Forensics requires root access for most operations
- Chain of custody is important for forensic evidence
- Some data may be encrypted or protected
- Use read-only operations when possible
- Document all forensic procedures and findings
