# Directory Operations - ADB Commands

## Description
Commands for creating, managing, and navigating directories on Android devices through ADB shell.

### Basic Commands

Create directory:
```sh
adb shell mkdir /sdcard/new_directory
```

List directory contents:
```sh
adb shell ls /sdcard/
```

Remove empty directory:
```sh
adb shell rmdir /sdcard/empty_directory
```

Change directory:
```sh
adb shell cd /sdcard/Documents
```

Show current directory:
```sh
adb shell pwd
```

### Advanced Commands

Create directory with parents:
```sh
adb shell mkdir -p /sdcard/parent/child/grandchild
```

Create multiple directories:
```sh
adb shell mkdir dir1 dir2 dir3
```

Remove directory and contents:
```sh
adb shell rm -rf directory/
```

Copy directory recursively:
```sh
adb shell cp -r source_dir/ destination_dir/
```

Move directory:
```sh
adb shell mv old_directory/ new_directory/
```

List directory with details:
```sh
adb shell ls -la /sdcard/
```

List directory tree:
```sh
adb shell find /sdcard/ -type d
```

Get directory size:
```sh
adb shell du -sh /sdcard/Documents/
```

Count files in directory:
```sh
adb shell find /sdcard/Documents/ -type f | wc -l
```

List hidden directories:
```sh
adb shell ls -a /sdcard/
```

Create directory with specific permissions:
```sh
adb shell mkdir -m 755 /sdcard/new_directory
```

Check directory permissions:
```sh
adb shell stat -c "%a %n" /sdcard/directory
```

### Examples

Directory structure creation script:
```sh
#!/bin/bash

echo "=== Creating Directory Structure ==="

# Create project directory structure
echo "Creating project directories..."
adb shell mkdir -p /sdcard/Projects/{web,mobile,desktop}/{src,docs,assets,tests}

# Create media directories
echo "Creating media directories..."
adb shell mkdir -p /sdcard/Media/{Images/{Screenshots,Photos,Camera},Videos/{Recorded,Downloaded},Audio/{Music,Podcasts,Recordings}}

# Create backup directories
echo "Creating backup directories..."
adb shell mkdir -p /sdcard/Backups/{daily,weekly,monthly}/{apps,data,system}

echo "Directory structure created successfully"
```

Directory cleanup script:
```sh
#!/bin/bash

echo "=== Directory Cleanup ==="

# Remove empty directories
echo "Removing empty directories..."
adb shell find /sdcard/ -type d -empty -delete

# Remove temporary directories
echo "Removing temporary directories..."
adb shell find /sdcard/ -name "*tmp*" -type d -exec rm -rf {} + 2>/dev/null

# Clean cache directories
echo "Cleaning cache directories..."
adb shell find /sdcard/ -name "cache" -type d -exec rm -rf {} + 2>/dev/null

echo "Directory cleanup completed"
```

Directory backup script:
```sh
#!/bin/bash
BACKUP_BASE="/sdcard/Backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$BACKUP_BASE/backup_$DATE"

echo "=== Directory Backup ==="

# Create backup directory
adb shell mkdir -p "$BACKUP_DIR"

# Backup important directories
echo "Backing up directories..."
DIRECTORIES=("/sdcard/Documents" "/sdcard/DCIM" "/sdcard/Download" "/sdcard/Music")

for dir in "${DIRECTORIES[@]}"; do
    DIR_NAME=$(basename "$dir")
    echo "Backing up $DIR_NAME..."
    adb shell cp -r "$dir" "$BACKUP_DIR/"
done

# Create backup manifest
adb shell echo "Backup created: $DATE" > "$BACKUP_DIR/manifest.txt"
adb shell echo "Directories: ${DIRECTORIES[*]}" >> "$BACKUP_DIR/manifest.txt"

echo "Backup completed: $BACKUP_DIR"
```

Directory analysis script:
```sh
#!/bin/bash

echo "=== Directory Analysis ==="

# Get storage usage by directory
echo "Storage usage by directory:"
adb shell du -sh /sdcard/*/ 2>/dev/null | sort -hr

# Count directories
echo -e "\nDirectory counts:"
echo "Total directories: $(adb shell find /sdcard/ -type d | wc -l)"
echo "Empty directories: $(adb shell find /sdcard/ -type d -empty | wc -l)"

# Find largest directories
echo -e "\nLargest directories:"
adb shell du -sh /sdcard/*/ 2>/dev/null | sort -hr | head -10

# Directory depth analysis
echo -e "\nMaximum directory depth:"
adb shell find /sdcard/ -type d | awk -F'/' '{print NF-1}' | sort -nr | head -1
```

Directory synchronization script:
```sh
#!/bin/bash
SOURCE_DIR="/sdcard/Source"
DEST_DIR="/sdcard/Destination"

echo "=== Directory Synchronization ==="

# Create destination if it doesn't exist
adb shell mkdir -p "$DEST_DIR"

# Sync directories
echo "Synchronizing directories..."
adb shell rsync -av "$SOURCE_DIR/" "$DEST_DIR/" 2>/dev/null || {
    echo "rsync not available, using cp..."
    adb shell cp -r "$SOURCE_DIR/"* "$DEST_DIR/"
}

# Verify synchronization
SOURCE_COUNT=$(adb shell find "$SOURCE_DIR" -type f | wc -l)
DEST_COUNT=$(adb shell find "$DEST_DIR" -type f | wc -l)

echo "Source files: $SOURCE_COUNT"
echo "Destination files: $DEST_COUNT"

if [ "$SOURCE_COUNT" -eq "$DEST_COUNT" ]; then
    echo "✓ Synchronization successful"
else
    echo "⚠ File count mismatch"
fi
```

Directory permissions script:
```sh
#!/bin/bash

echo "=== Directory Permissions Management ==="

# Set standard permissions
echo "Setting standard directory permissions..."
adb shell find /sdcard/ -type d -exec chmod 755 {} \;

# Set secure permissions for private directories
echo "Setting secure permissions..."
adb shell find /sdcard/Private/ -type d -exec chmod 700 {} \; 2>/dev/null

# Fix ownership (requires root)
adb shell su -c "find /sdcard/ -type d -exec chown shell:shell {} \;" 2>/dev/null

# Check permissions
echo "Checking directory permissions..."
adb shell find /sdcard/ -maxdepth 2 -type d -exec stat -c "%a %n" {} \;

echo "Directory permissions updated"
```

Batch directory operations:
```sh
#!/bin/bash

echo "=== Batch Directory Operations ==="

# Create timestamped directories
echo "Creating timestamped directories..."
TIMESTAMP=$(date +%Y%m%d)
adb shell mkdir -p "/sdcard/Logs_$TIMESTAMP" "/sdcard/Reports_$TIMESTAMP" "/sdcard/Exports_$TIMESTAMP"

# Rename directories with prefix
echo "Adding prefix to directories..."
adb shell for dir in /sdcard/Project*; do mv "$dir" "Old_$dir"; done 2>/dev/null

# Move directories to archive
echo "Archiving old directories..."
adb shell mkdir -p /sdcard/Archive
adb shell mv /sdcard/Old_* /sdcard/Archive/ 2>/dev/null

echo "Batch operations completed"
```

## Notes
- Directory paths are case-sensitive
- Use absolute paths for reliable operations
- Some operations require root access
- Large directory operations may take time
- Be careful with rm -rf command
- Check available space before copying large directories
- Use mkdir -p to create parent directories automatically
- Directory permissions affect file access
- Some system directories are protected
- Always backup important directories before major operations
