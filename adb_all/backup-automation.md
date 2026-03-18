# Backup Automation - ADB Commands

## Description
Commands for automated backup processes, scheduled backups, and backup management.

### Basic Commands
Automated full backup:
```sh
adb backup -apk -shared -all -f backup_$(date +%Y%m%d).ab
```

Automated app backup:
```sh
for app in $(adb shell pm list packages -3 | cut -d: -f2); do
  adb backup -f ${app}_backup.ab $app
done
```

Scheduled backup script:
```sh
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
adb backup -apk -shared -all -f /backups/backup_$DATE.ab
```

### Advanced Commands
Incremental backup:
```sh
adb backup -apk -shared -all -f incremental_backup.ab --include-shared
```

Selective category backup:
```sh
adb backup -apk -nosystem -f apps_backup.ab
```

Compressed backup:
```sh
adb backup -apk -shared -all -f - | gzip > backup.gz
```

Remote backup transfer:
```sh
adb backup -apk -shared -all -f - | ssh user@server "cat > backup.ab"
```

Backup verification:
```sh
for backup in *.ab; do
  echo "Checking $backup"
  ls -la $backup
done
```

Automated backup cleanup:
```sh
find /backups -name "*.ab" -mtime +7 -delete
```

Multi-device backup:
```sh
for device in $(adb devices | grep -v "List" | awk '{print $1}'); do
  adb -s $device backup -apk -shared -all -f ${device}_backup.ab
done
```

## Notes
- Backup requires confirmation on device screen
- Some backup types require root access
- Verify backup integrity before relying on it
- Use compression for large backups
