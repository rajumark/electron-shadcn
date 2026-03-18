# File Management - ADB Commands

## Description
Commands for managing files on Android devices, including copy, move, delete, and file operations through ADB shell.

### Basic Commands

List files in directory:
```sh
adb shell ls /sdcard/
```

Copy file:
```sh
adb shell cp source.txt destination.txt
```

Move file:
```sh
adb shell mv old_name.txt new_name.txt
```

Delete file:
```sh
adb shell rm file.txt
```

Create directory:
```sh
adb shell mkdir /sdcard/new_folder
```

### Advanced Commands

List files with details:
```sh
adb shell ls -la /sdcard/
```

Copy directory recursively:
```sh
adb shell cp -r source_dir/ destination_dir/
```

Move directory:
```sh
adb shell mv old_dir/ new_dir/
```

Delete directory and contents:
```sh
adb shell rm -rf directory/
```

Create directory with parents:
```sh
adb shell mkdir -p /sdcard/parent/child/
```

Find files by name:
```sh
adb shell find /sdcard/ -name "*.txt"
```

Find files by type:
```sh
adb shell find /sdcard/ -type f
```

Get file size:
```sh
adb shell wc -c file.txt
```

Get file permissions:
```sh
adb shell ls -l file.txt
```

Change file permissions:
```sh
adb shell chmod 644 file.txt
```

Change file ownership (requires root):
```sh
adb shell chown user:group file.txt
```

Create symbolic link:
```sh
adb shell ln -s /sdcard/original.txt /sdcard/link.txt
```

### Examples

File cleanup script:
```sh
#!/bin/bash

echo "=== File Cleanup ==="

# Remove temporary files
echo "Removing temporary files..."
adb shell find /sdcard/ -name "*.tmp" -delete
adb shell find /sdcard/ -name "*.cache" -delete

# Clean download directory
echo "Cleaning downloads older than 7 days..."
adb shell find /sdcard/Download/ -mtime +7 -delete

# Remove empty directories
echo "Removing empty directories..."
adb shell find /sdcard/ -type d -empty -delete

echo "Cleanup completed"
```

File organization script:
```sh
#!/bin/bash

echo "=== File Organization ==="

# Create organized directories
echo "Creating directories..."
adb shell mkdir -p /sdcard/Documents/{Images,Videos,Audio,Archives}

# Move files to appropriate directories
echo "Organizing files..."
adb shell mv /sdcard/*.jpg /sdcard/Documents/Images/ 2>/dev/null
adb shell mv /sdcard/*.mp4 /sdcard/Documents/Videos/ 2>/dev/null
adb shell mv /sdcard/*.mp3 /sdcard/Documents/Audio/ 2>/dev/null
adb shell mv /sdcard/*.zip /sdcard/Documents/Archives/ 2>/dev/null

echo "File organization completed"
```

File backup script:
```sh
#!/bin/bash
BACKUP_DIR="/sdcard/backup_$(date +%Y%m%d)"

echo "=== File Backup ==="

# Create backup directory
adb shell mkdir -p "$BACKUP_DIR"

# Backup important directories
echo "Backing up Documents..."
adb shell cp -r /sdcard/Documents/ "$BACKUP_DIR/"

echo "Backing up DCIM..."
adb shell cp -r /sdcard/DCIM/ "$BACKUP_DIR/"

# Create backup log
adb shell echo "Backup created on $(date)" > "$BACKUP_DIR/backup_log.txt"

echo "Backup completed: $BACKUP_DIR"
```

File analysis script:
```sh
#!/bin/bash

echo "=== File Analysis ==="

# Get storage usage
echo "Storage usage:"
adb shell df -h /sdcard/

# Count file types
echo -e "\nFile type counts:"
echo "Images: $(adb shell find /sdcard/ -name '*.jpg' -o -name '*.png' | wc -l)"
echo "Videos: $(adb shell find /sdcard/ -name '*.mp4' -o -name '*.avi' | wc -l)"
echo "Audio: $(adb shell find /sdcard/ -name '*.mp3' -o -name '*.wav' | wc -l)"

# Find largest files
echo -e "\nLargest files:"
adb shell find /sdcard/ -type f -exec du -h {} + | sort -hr | head -10

# Find duplicate files
echo -e "\nChecking for duplicate files..."
adb shell find /sdcard/ -name "*copy*" -o -name "*duplicate*"
```

File repair script:
```sh
#!/bin/bash

echo "=== File Repair ==="

# Check for corrupted files
echo "Checking for corrupted files..."
adb shell find /sdcard/ -name "*.mp4" -exec file {} \; | grep -v "MPEG"

# Repair file permissions
echo "Repairing file permissions..."
adb shell find /sdcard/ -type f -name "*.jpg" -exec chmod 644 {} \;
adb shell find /sdcard/ -type f -name "*.mp4" -exec chmod 644 {} \;
adb shell find /sdcard/ -type d -exec chmod 755 {} \;

# Remove zero-byte files
echo "Removing zero-byte files..."
adb shell find /sdcard/ -type f -size 0 -delete

echo "File repair completed"
```

Batch file operations:
```sh
#!/bin/bash

echo "=== Batch File Operations ==="

# Rename files with timestamp
echo "Adding timestamps to files..."
adb shell for file in /sdcard/*.log; do mv "$file" "${file%.*}_$(date +%Y%m%d).log"; done

# Compress old files
echo "Compressing old files..."
adb shell find /sdcard/Logs/ -name "*.log" -mtime +30 -exec gzip {} \;

# Create file index
echo "Creating file index..."
adb shell find /sdcard/ -type f > /sdcard/file_index.txt

echo "Batch operations completed"
```

## Notes
- Some operations require root access
- File operations are case-sensitive
- Use wildcards carefully to avoid accidental deletions
- Large file operations may take time
- Always backup important files before bulk operations
- Check file permissions before operations
- Some Android versions have restrictions on system file access
- Use `-f` flag to force operations without confirmation
- File paths use forward slashes even on Windows
- Consider storage space when copying large files
