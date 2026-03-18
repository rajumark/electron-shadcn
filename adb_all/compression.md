# Compression - ADB Commands

## Description
Commands for compressing and decompressing files and directories on Android devices using ADB shell operations.

### Basic Commands

Create tar.gz archive:
```sh
adb shell tar -czf archive.tar.gz /path/to/directory
```

Extract tar.gz archive:
```sh
adb shell tar -xzf archive.tar.gz
```

Create zip archive:
```sh
adb shell zip -r archive.zip /path/to/directory
```

Extract zip archive:
```sh
adb shell unzip archive.zip
```

List archive contents:
```sh
adb shell tar -tzf archive.tar.gz
```

### Advanced Commands

Compress with specific level:
```sh
adb shell tar -czf -9 archive.tar.gz /path/to/directory
```

Extract to specific directory:
```sh
adb shell tar -xzf archive.tar.gz -C /target/directory
```

Compress excluding files:
```sh
adb shell tar -czf archive.tar.gz --exclude='*.log' /path/to/directory
```

Create split archives:
```sh
adb shell split -b 100M large_file.tar.gz part_
```

Compress with bzip2:
```sh
adb shell tar -cjf archive.tar.bz2 /path/to/directory
```

Extract with progress:
```sh
adb shell pv archive.tar.gz | tar -xzf -
```

Compress and transfer:
```sh
adb shell tar -czf - /path/to/directory | adb pull - ./local_archive.tar.gz
```

Verify archive integrity:
```sh
adb shell tar -tvf archive.tar.gz
```

### Examples

Compress app data:
```sh
adb shell tar -czf /sdcard/app_data.tar.gz /data/data/com.example.app
```

Extract system backup:
```sh
adb shell tar -xzf /sdcard/system_backup.tar.gz -C /system/
```

Create compressed log bundle:
```sh
adb shell tar -czf /sdcard/logs.tar.gz /data/log/*.log
```

Compress photos directory:
```sh
adb shell zip -r /sdcard/photos_backup.zip /sdcard/DCIM/Camera/
```

## Notes
- Some compression tools may not be available on all Android versions
- Large compression operations can impact device performance
- Ensure sufficient storage space for both source and compressed files
- Use `pv` command for progress monitoring if available
- Root access may be required for system file compression
- Consider using `adb pull/push` for large file transfers instead
