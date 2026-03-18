# App Backup - ADB Commands

## Description
Commands for backing up and restoring Android applications, their data, and settings using ADB backup functionality.

### Basic Commands

Backup single app with data:
```sh
adb backup -apk -shared -all -f app_backup.ab com.example.app
```

Backup app without APK:
```sh
adb backup -noapk -shared -all -f app_data_backup.ab com.example.app
```

Restore app backup:
```sh
adb restore app_backup.ab
```

### Advanced Commands

Backup multiple apps:
```sh
adb backup -apk -shared -all -f multiple_apps.ab com.app1 com.app2 com.app3
```

Backup all apps:
```sh
adb backup -apk -shared -all -f all_apps_backup.ab
```

Backup with encryption:
```sh
adb backup -apk -shared -all -f encrypted_backup.ab -encrypt com.example.app
```

Backup excluding system apps:
```sh
adb backup -apk -shared -all -f user_apps.ab com.example.app
```

Backup shared storage only:
```sh
adb backup -shared -f shared_storage.ab
```

Backup with specific compression:
```sh
adb backup -apk -shared -all -f backup.ab com.example.app
```

Backup to specific directory:
```sh
adb backup -apk -shared -all -f /path/to/backup/backup.ab com.example.app
```

Verify backup integrity:
```sh
adb backup -apk -shared -all -f test_backup.ab com.example.app
```

Backup with obb files:
```sh
adb backup -apk -shared -obb -all -f backup_with_obb.ab com.example.app
```

Create incremental backup:
```sh
adb backup -apk -shared -all -f incremental_backup.ab com.example.app
```

Backup with custom file name:
```sh
adb backup -apk -shared -all -f "backup_$(date +%Y%m%d).ab" com.example.app
```

List backup file contents:
```sh
dd if=backup.ab bs=24 skip=1 | python -c "import zlib,sys; sys.stdout.write(zlib.decompress(sys.stdin.read()))"
```

### Examples

Automated backup script:
```sh
#!/bin/bash
PACKAGE="com.example.app"
BACKUP_DIR="backups"
DATE=$(date +%Y%m%d_%H%M%S)

echo "=== Automated Backup for $PACKAGE ==="

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Create backup filename
BACKUP_FILE="$BACKUP_DIR/${PACKAGE}_${DATE}.ab"

# Perform backup
echo "Creating backup: $BACKUP_FILE"
adb backup -apk -shared -all -f "$BACKUP_FILE" "$PACKAGE"

# Verify backup exists
if [ -f "$BACKUP_FILE" ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "✓ Backup completed successfully"
    echo "Backup size: $BACKUP_SIZE"
else
    echo "✗ Backup failed"
fi
```

Batch backup script:
```sh
#!/bin/bash
BACKUP_DIR="batch_backups"
DATE=$(date +%Y%m%d_%H%M%S)

echo "=== Batch App Backup ==="
mkdir -p "$BACKUP_DIR"

# Get list of user apps
APPS=$(adb shell pm list packages -3 | sed 's/package://')

for app in $APPS; do
    echo "Backing up $app..."
    BACKUP_FILE="$BACKUP_DIR/${app}_${DATE}.ab"
    
    adb backup -apk -shared -all -f "$BACKUP_FILE" "$app"
    
    if [ -f "$BACKUP_FILE" ]; then
        SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
        echo "✓ $app backed up ($SIZE)"
    else
        echo "✗ Failed to backup $app"
    fi
done

echo "Batch backup completed"
```

Backup verification script:
```sh
#!/bin/bash
BACKUP_FILE="app_backup.ab"

echo "=== Backup Verification ==="

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Check file size
SIZE=$(stat -f%z "$BACKUP_FILE" 2>/dev/null || stat -c%s "$BACKUP_FILE" 2>/dev/null)
echo "Backup file size: $SIZE bytes"

# Check if file is not empty
if [ "$SIZE" -lt 100 ]; then
    echo "⚠ Backup file seems too small, may be corrupted"
else
    echo "✓ Backup file size looks reasonable"
fi

# Try to read backup header
echo "Backup header information:"
hexdump -C "$BACKUP_FILE" | head -5
```

Restore script with validation:
```sh
#!/bin/bash
BACKUP_FILE="app_backup.ab"

echo "=== App Restore ==="

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Check device connection
if ! adb devices | grep -q "device$"; then
    echo "No device connected"
    exit 1
fi

# Perform restore
echo "Restoring from $BACKUP_FILE..."
adb restore "$BACKUP_FILE"

# Check restore result
if [ $? -eq 0 ]; then
    echo "✓ Restore completed successfully"
    
    # Verify app is installed
    PACKAGE=$(echo "$BACKUP_FILE" | sed 's/.*\///; s/_.*//')
    if adb shell pm list packages | grep -q "$PACKAGE"; then
        echo "✓ App is installed after restore"
    else
        echo "⚠ App not found after restore"
    fi
else
    echo "✗ Restore failed"
fi
```

Complete backup management:
```sh
#!/bin/bash
BACKUP_DIR="app_backups"
PACKAGE="com.example.app"

echo "=== Complete Backup Management ==="
mkdir -p "$BACKUP_DIR"

# Create backup
echo "Creating backup..."
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/${PACKAGE}_${DATE}.ab"
adb backup -apk -shared -all -f "$BACKUP_FILE" "$PACKAGE"

# List existing backups
echo -e "\nExisting backups:"
ls -la "$BACKUP_DIR"/${PACKAGE}_*.ab 2>/dev/null || echo "No previous backups found"

# Clean old backups (keep last 5)
echo -e "\nCleaning old backups..."
cd "$BACKUP_DIR"
ls -t ${PACKAGE}_*.ab | tail -n +6 | xargs -r rm
echo "Old backups cleaned up"

echo "Backup management completed"
```

## Notes
- Backup files (.ab) are compressed and may be encrypted
- Some apps may prevent backup of sensitive data
- Android 6.0+ apps can opt-out of backup
- Backup requires user confirmation on device
- Large backups may take significant time
- Backup files can be extracted with Android Backup Extractor
- System app backup may require root
- Always test restore functionality on non-critical data first
- Some app data may not be backupable due to security restrictions
