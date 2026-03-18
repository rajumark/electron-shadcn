# Backup & Restore - ADB Commands

## Description
Commands for backing up and restoring device data, applications, and system partitions using ADB operations.

### Basic Commands

Full device backup:
```sh
adb backup -apk -shared -all -f backup.ab
```

Backup specific app:
```sh
adb backup -apk com.example.app -f app_backup.ab
```

Backup app data only:
```sh
adb backup -noapk com.example.app -f app_data.ab
```

Restore from backup:
```sh
adb restore backup.ab
```

Backup with system data:
```sh
adb backup -system -all -f full_backup.ab
```

### Advanced Commands

Backup with encryption:
```sh
adb backup -apk -shared -all -f encrypted_backup.ab -encrypt
```

Backup specific directories:
```sh
adb shell tar -czf /sdcard/backup.tar.gz /data/data/com.example.app
```

Backup to computer:
```sh
adb pull /sdcard/backup.tar.gz ./local_backup.tar.gz
```

Restore directory backup:
```sh
adb push ./local_backup.tar.gz /sdcard/
adb shell tar -xzf /sdcard/local_backup.tar.gz -C /
```

Backup partition image:
```sh
adb shell dd if=/dev/block/bootdevice/by-name/system of=/sdcard/system.img
```

Selective app backup:
```sh
adb backup -apk -shared -nosystem com.app1 com.app2 -f selective_backup.ab
```

### Examples

Backup all user apps:
```sh
adb backup -apk -nosystem -all -f user_apps_backup.ab
```

Restore specific app from backup:
```sh
adb restore app_backup.ab
```

Create compressed system backup:
```sh
adb shell su -c "tar -czf /sdcard/system_backup.tar.gz /system"
```

Backup SMS and contacts:
```sh
adb shell su -c "cp /data/data/com.android.providers.telephony/databases/* /sdcard/"
```

## Notes
- Backup requires confirmation on device screen
- Some backups need root access for complete data
- Backup files (.ab) may need password for decryption
- System partition backups typically require root
- Always verify backup integrity before relying on it
- Some apps may prevent backup of their data
- Use `-noshared` flag to exclude shared storage
