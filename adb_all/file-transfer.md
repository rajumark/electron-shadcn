# File Transfer - ADB Commands

## Description
Commands for transferring files between computer and Android device using ADB push and pull operations.

### Basic Commands

Push file to device:
```sh
adb push local_file.txt /sdcard/
```

Pull file from device:
```sh
adb pull /sdcard/device_file.txt
```

Push file to specific directory:
```sh
adb push local_file.txt /sdcard/Documents/
```

Pull file with specific name:
```sh
adb pull /sdcard/device_file.txt local_copy.txt
```

### Advanced Commands

Push multiple files:
```sh
adb push file1.txt file2.txt /sdcard/
```

Push directory recursively:
```sh
adb push local_directory/ /sdcard/remote_directory/
```

Pull directory recursively:
```sh
adb pull /sdcard/remote_directory/ local_directory/
```

Push file with progress:
```sh
adb push -p local_file.txt /sdcard/
```

Pull file with progress:
```sh
adb pull -p /sdcard/device_file.txt
```

Sync directories:
```sh
adb sync /sdcard/
```

Push file to app data (requires root):
```sh
adb shell su -c "cp /sdcard/file.txt /data/data/com.example.app/"
```

Pull from app data (requires root):
```sh
adb shell su -c "cp /data/data/com.example.app/file.txt /sdcard/"
adb pull /sdcard/file.txt
```

Push with specific permissions:
```sh
adb push local_file.txt /sdcard/ && adb shell chmod 644 /sdcard/local_file.txt
```

Transfer files over WiFi:
```sh
adb connect <device_ip>:5555
adb push large_file.zip /sdcard/
```

Resume interrupted transfer:
```sh
adb push --sync local_file.txt /sdcard/
```

Check file transfer progress:
```sh
adb shell ls -la /sdcard/ | grep local_file.txt
```

### Examples

Batch file transfer script:
```sh
#!/bin/bash

echo "=== Batch File Transfer ==="

# Push multiple files
echo "Pushing multiple files..."
for file in *.txt; do
    echo "Pushing $file..."
    adb push "$file" /sdcard/Documents/
done

# Pull all images
echo "Pulling all images..."
adb shell mkdir -p /sdcard/backup_images
adb shell mv /sdcard/DCIM/Camera/*.jpg /sdcard/backup_images/
adb pull /sdcard/backup_images/ ./images/

echo "Batch transfer completed"
```

Directory synchronization script:
```sh
#!/bin/bash
LOCAL_DIR="./local_data"
REMOTE_DIR="/sdcard/remote_data"

echo "=== Directory Synchronization ==="

# Create remote directory if it doesn't exist
adb shell mkdir -p "$REMOTE_DIR"

# Push local directory
echo "Syncing local to remote..."
adb push "$LOCAL_DIR/" "$REMOTE_DIR/"

# Verify transfer
echo "Verifying transfer..."
LOCAL_COUNT=$(find "$LOCAL_DIR" -type f | wc -l)
REMOTE_COUNT=$(adb shell find "$REMOTE_DIR" -type f | wc -l)

echo "Local files: $LOCAL_COUNT"
echo "Remote files: $REMOTE_COUNT"

if [ "$LOCAL_COUNT" -eq "$REMOTE_COUNT" ]; then
    echo "✓ Synchronization successful"
else
    echo "⚠ File count mismatch"
fi
```

Large file transfer script:
```sh
#!/bin/bash
LARGE_FILE="large_video.mp4"
REMOTE_PATH="/sdcard/Videos/"

echo "=== Large File Transfer ==="

# Check available space
AVAILABLE_SPACE=$(adb shell df /sdcard | tail -1 | awk '{print $4}')
FILE_SIZE=$(stat -f%z "$LARGE_FILE" 2>/dev/null || stat -c%s "$LARGE_FILE" 2>/dev/null)

echo "Available space: $AVAILABLE_SPACE KB"
echo "File size: $((FILE_SIZE / 1024)) KB"

if [ "$FILE_SIZE" -gt "$((AVAILABLE_SPACE * 1024))" ]; then
    echo "✗ Not enough space"
    exit 1
fi

# Transfer with progress
echo "Starting transfer..."
adb push -p "$LARGE_FILE" "$REMOTE_PATH"

# Verify file integrity
LOCAL_MD5=$(md5sum "$LARGE_FILE" | cut -d' ' -f1)
REMOTE_MD5=$(adb shell md5sum "$REMOTE_PATH/$LARGE_FILE" | cut -d' ' -f1)

if [ "$LOCAL_MD5" = "$REMOTE_MD5" ]; then
    echo "✓ Transfer successful, file integrity verified"
else
    echo "⚠ Transfer completed but checksum mismatch"
fi
```

App data backup script:
```sh
#!/bin/bash
PACKAGE="com.example.app"
BACKUP_DIR="app_backup"

echo "=== App Data Backup ==="
mkdir -p "$BACKUP_DIR"

# Check if app is accessible
if adb shell run-as "$PACKAGE" ls /data/data/"$PACKAGE" >/dev/null 2>&1; then
    echo "Backing up app data..."
    
    # Backup internal data
    adb shell run-as "$PACKAGE" tar -c /data/data/"$PACKAGE" > "$BACKUP_DIR/internal_data.tar"
    
    # Backup external data
    if adb shell test -d "/sdcard/Android/data/$PACKAGE"; then
        adb pull "/sdcard/Android/data/$PACKAGE" "$BACKUP_DIR/external_data"
    fi
    
    echo "✓ App data backup completed"
else
    echo "⚠ Cannot access app data (app not debuggable or requires root)"
fi
```

File transfer verification script:
```sh
#!/bin/bash
LOCAL_FILE="test.txt"
REMOTE_FILE="/sdcard/test.txt"

echo "=== File Transfer Verification ==="

# Push file
echo "Pushing file..."
adb push "$LOCAL_FILE" "$REMOTE_FILE"

# Verify file exists
if adb shell test -f "$REMOTE_FILE"; then
    echo "✓ File exists on device"
    
    # Compare file sizes
    LOCAL_SIZE=$(stat -f%z "$LOCAL_FILE" 2>/dev/null || stat -c%s "$LOCAL_FILE" 2>/dev/null)
    REMOTE_SIZE=$(adb shell stat -c%s "$REMOTE_FILE")
    
    echo "Local size: $LOCAL_SIZE bytes"
    echo "Remote size: $REMOTE_SIZE bytes"
    
    if [ "$LOCAL_SIZE" -eq "$REMOTE_SIZE" ]; then
        echo "✓ File sizes match"
    else
        echo "⚠ File size mismatch"
    fi
else
    echo "✗ File not found on device"
fi
```

## Notes
- File transfer speed depends on USB connection quality
- Large files may take significant time to transfer
- WiFi transfers are slower than USB
- Some directories require root access
- File permissions may need to be set after transfer
- Use `-p` flag for progress indication on large files
- Check available space before transferring large files
- Some Android versions have file size limitations
- Always verify important file transfers with checksums
