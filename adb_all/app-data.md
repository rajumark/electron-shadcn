# App Data - ADB Commands

## Description
Commands for managing application data, cache, storage, and user data directories for Android applications.

### Basic Commands

Clear app data and cache:
```sh
adb shell pm clear com.example.app
```

Clear app cache only:
```sh
adb shell pm clear com.example.app
```

Get app data directory:
```sh
adb shell run-as com.example.app ls /data/data/com.example.app
```

### Advanced Commands

Backup app data:
```sh
adb backup -apk -shared -all -f backup.ab com.example.app
```

Restore app data:
```sh
adb restore backup.ab
```

Copy app data directory (requires root):
```sh
adb shell su -c "cp -r /data/data/com.example.app /sdcard/backup/"
```

Get app data size:
```sh
adb shell du -sh /data/data/com.example.app
```

List app data directories:
```sh
adb shell run-as com.example.app ls -la /data/data/com.example.app
```

Copy specific app file:
```sh
adb shell run-as com.example.app cat /data/data/com.example.app/files/config.json > config.json
```

Push file to app data:
```sh
adb shell run-as com.example.app cp /sdcard/config.json /data/data/com.example.app/files/
```

Check app external data:
```sh
adb shell ls -la /sdcard/Android/data/com.example.app
```

Get app database files:
```sh
adb shell run-as com.example.app ls /data/data/com.example.app/databases/
```

Copy app database:
```sh
adb shell run-as com.example.app cat /data/data/com.example.app/databases/app.db > app.db
```

Clear app databases only:
```sh
adb shell run-as com.example.app rm /data/data/com.example.app/databases/*
```

Get app shared preferences:
```sh
adb shell run-as com.example.app ls /data/data/com.example.app/shared_prefs/
```

Copy shared preferences:
```sh
adb shell run-as com.example.app cat /data/data/com.example.app/shared_prefs/prefs.xml > prefs.xml
```

Monitor app data usage:
```sh
adb shell dumpsys diskstats | grep com.example.app
```

### Examples

Complete app data backup script:
```sh
#!/bin/bash
PACKAGE="com.example.app"
BACKUP_DIR="backup_$PACKAGE"

echo "=== Backing up data for $PACKAGE ==="
mkdir -p "$BACKUP_DIR"

# Backup APK
adb shell pm path "$PACKAGE" | cut -d: -f2 | xargs -I {} adb pull {} "$BACKUP_DIR/app.apk"

# Backup app data
adb backup -apk -shared -all -f "$BACKUP_DIR/data.ab" "$PACKAGE"

# Backup external data
if adb shell ls -la /sdcard/Android/data/"$PACKAGE" >/dev/null 2>&1; then
    adb pull /sdcard/Android/data/"$PACKAGE" "$BACKUP_DIR/external_data"
fi

echo "Backup completed in $BACKUP_DIR"
```

App data analysis script:
```sh
#!/bin/bash
PACKAGE="com.example.app"

echo "=== Data Analysis for $PACKAGE ==="

# Check if app has debuggable data
if adb shell run-as "$PACKAGE" ls /data/data/"$PACKAGE" >/dev/null 2>&1; then
    echo "✓ App data is accessible"
    
    # Get data size
    DATA_SIZE=$(adb shell run-as "$PACKAGE" du -sh /data/data/"$PACKAGE" 2>/dev/null | cut -f1)
    echo "Data size: $DATA_SIZE"
    
    # List directories
    echo "Data directories:"
    adb shell run-as "$PACKAGE" ls -la /data/data/"$PACKAGE"
else
    echo "✗ App data is not accessible (app not debuggable or requires root)"
fi

# Check external data
if adb shell ls -la /sdcard/Android/data/"$PACKAGE" >/dev/null 2>&1; then
    echo "✓ External data exists"
    EXTERNAL_SIZE=$(adb shell du -sh /sdcard/Android/data/"$PACKAGE" 2>/dev/null | cut -f1)
    echo "External data size: $EXTERNAL_SIZE"
else
    echo "✗ No external data found"
fi
```

Selective data clearing:
```sh
#!/bin/bash
PACKAGE="com.example.app"

echo "=== Selective Data Clearing for $PACKAGE ==="

# Clear cache only
echo "Clearing cache..."
adb shell run-as "$PACKAGE" rm -rf /data/data/"$PACKAGE"/cache 2>/dev/null

# Keep databases but clear other data
echo "Preserving databases, clearing other data..."
adb shell run-as "$PACKAGE" find /data/data/"$PACKAGE" -mindepth 1 -not -name "databases" -not -name "shared_prefs" -exec rm -rf {} + 2>/dev/null

echo "Selective clearing completed"
```

Database extraction script:
```sh
#!/bin/bash
PACKAGE="com.example.app"

echo "=== Extracting databases for $PACKAGE ==="

if adb shell run-as "$PACKAGE" ls /data/data/"$PACKAGE"/databases >/dev/null 2>&1; then
    mkdir -p databases
    
    for db in $(adb shell run-as "$PACKAGE" ls /data/data/"$PACKAGE"/databases); do
        echo "Extracting $db..."
        adb shell run-as "$PACKAGE" cat "/data/data/$PACKAGE/databases/$db" > "databases/$db"
    done
    
    echo "Databases extracted to ./databases/"
else
    echo "No databases accessible"
fi
```

## Notes
- `run-as` only works for debuggable apps
- Production apps require root access for data manipulation
- App data is stored in `/data/data/<package>` for internal storage
- External data is stored in `/sdcard/Android/data/<package>`
- Backup files (.ab) can be extracted with Android Backup Extractor
- Some apps may encrypt their data
- Always backup data before clearing or modifying
- Database files may be locked while app is running
