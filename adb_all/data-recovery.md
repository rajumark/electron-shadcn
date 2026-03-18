# Data Recovery - ADB Commands

## Description
Commands for data recovery, file restoration, and data salvage operations.

### Basic Commands
Recover deleted files:
```sh
adb shell find /data -name "*.tmp" -o -name "*~"
```

Check recycle bin:
```sh
adb shell ls -la /data/.trash
```

Recover app data:
```sh
adb shell cp -r /data/data/com.example.app /sdcard/backup/
```

Check lost+found:
```sh
adb shell ls -la /data/lost+found
```

### Advanced Commands
File system recovery:
```sh
adb shell fsck /data
```

Partition recovery:
```sh
adb shell testdisk /dev/block/data
```

Photo recovery:
```sh
adb shell find /sdcard -name "*.jpg" -size +10k
```

Contact recovery:
```sh
adb shell content query --uri content://contacts/people
```

SMS recovery:
```sh
adb shell content query --uri content://sms
```

Call log recovery:
```sh
adb shell content query --uri content://call_log/calls
```

Database recovery:
```sh
adb shell sqlite3 /data/data/com.example.app/databases/db.db ".dump"
```

SD card recovery:
```sh
adb shell photorec /dev/block/mmcblk1
```

Memory dump recovery:
```sh
adb shell cat /proc/kcore > memory_dump.bin
```

## Notes
- Data recovery may require root access
- Recovery success depends on data overwrite
- Always backup before recovery attempts
- Some recovery tools may not be available on all devices
