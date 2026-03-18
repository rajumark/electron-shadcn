# File Permissions - ADB Commands

## Description
Commands for viewing and modifying file and directory permissions on Android devices using ADB shell operations.

### Basic Commands

Check file permissions:
```sh
adb shell ls -l /path/to/file
```

Check directory permissions:
```sh
adb shell ls -ld /path/to/directory
```

Change file permissions (octal):
```sh
adb shell chmod 644 /path/to/file
```

Change directory permissions:
```sh
adb shell chmod 755 /path/to/directory
```

Change file owner:
```sh
adb shell chown user:group /path/to/file
```

### Advanced Commands

Recursive permission change:
```sh
adb shell chmod -R 755 /path/to/directory
```

Set executable permission:
```sh
adb shell chmod +x /path/to/script.sh
```

Remove write permission:
```sh
adb shell chmod -w /path/to/file
```

Change ownership recursively:
```sh
adb shell chown -R user:group /path/to/directory
```

View permission details in numeric format:
```sh
adb shell stat -c "%a %n" /path/to/file
```

Check SELinux context:
```sh
adb shell ls -Z /path/to/file
```

### Examples

Make script executable:
```sh
adb shell chmod +x /data/local/tmp/test.sh
```

Set read-only permissions:
```sh
adb shell chmod 444 /sdcard/readonly.txt
```

Grant full access to directory:
```sh
adb shell chmod 777 /data/local/tmp/temp_dir
```

Change ownership to system:
```sh
adb shell chown system:system /system/app/TestApp.apk
```

## Notes
- Root access required for modifying system file permissions
- Use octal notation (644, 755, 777) for precise permission control
- SELinux contexts may override traditional Unix permissions
- Be careful when modifying system partition permissions
- Some Android versions restrict permission changes on /sdcard
