# SD Card - ADB Commands

## Description
Commands for managing SD card operations, including mounting, formatting, and SD card storage management on Android devices.

### Basic Commands

Check SD card status:
```sh
adb shell ls /sdcard/
```

Mount SD card:
```sh
adb shell mount /sdcard/
```

Unmount SD card:
```sh
adb shell umount /sdcard/
```

Check SD card storage:
```sh
adb shell df -h /sdcard/
```

### Advanced Commands

Format SD card:
```sh
adb shell sm format /sdcard/
```

Check SD card filesystem:
```sh
adb shell mount | grep sdcard
```

Get SD card details:
```sh
adb shell sm list-volumes
```

Mount SD card as internal storage:
```sh
adb shell sm partition disk:179,64 private
```

Mount SD card as portable storage:
```sh
adb shell sm partition disk:179,64 public
```

Check SD card health:
```sh
adb shell cat /sys/block/mmcblk1/device/health
```

Get SD card serial number:
```sh
adb shell cat /sys/block/mmcblk1/device/serial
```

Check SD card speed class:
```sh
adb shell cat /sys/block/mmcblk1/device/speed_class
```

Benchmark SD card performance:
```sh
adb shell dd if=/dev/zero of=/sdcard/test bs=1M count=100
```

Check SD card wear level:
```sh
adb shell cat /sys/block/mmcblk1/device/life_time
```

Move app to SD card:
```sh
adb shell pm move-package com.example.app external
```

Move app back to internal storage:
```sh
adb shell pm move-package com.example.app internal
```

### Examples

SD card analysis script:
```sh
#!/bin/bash

echo "=== SD Card Analysis ==="

# Check if SD card is mounted
if adb shell mount | grep -q "/sdcard"; then
    echo "✓ SD card is mounted"
    
    # Get storage info
    echo "Storage information:"
    adb shell df -h /sdcard/
    
    # Get filesystem type
    echo "Filesystem type:"
    adb shell mount | grep /sdcard
    
    # Check SD card details
    echo "SD card details:"
    adb shell sm list-volumes
else
    echo "✗ SD card not mounted"
fi
```

SD card performance test:
```sh
#!/bin/bash

echo "=== SD Card Performance Test ==="

# Write test
echo "Write performance test..."
adb shell dd if=/dev/zero of=/sdcard/write_test bs=1M count=100 2>&1 | grep copied

# Read test
echo "Read performance test..."
adb shell dd if=/sdcard/write_test of=/dev/null bs=1M 2>&1 | grep copied

# Clean up test file
adb shell rm /sdcard/write_test

echo "Performance test completed"
```

SD card maintenance script:
```sh
#!/bin/bash

echo "=== SD Card Maintenance ==="

# Check available space
echo "Available space:"
adb shell df -h /sdcard/

# Find large files
echo -e "\nLarge files on SD card:"
adb shell find /sdcard/ -type f -size +100M -exec ls -lh {} \; 2>/dev/null | head -10

# Clean temporary files
echo -e "\nCleaning temporary files..."
adb shell find /sdcard/ -name "*.tmp" -delete
adb shell find /sdcard/ -name "*.cache" -delete

echo "SD card maintenance completed"
```

App migration to SD card:
```sh
#!/bin/bash

echo "=== App Migration to SD Card ==="

# List movable apps
echo "Checking movable apps..."
adb shell pm list packages -f | grep -E "(external|install_location=2)"

# Move specific app
PACKAGE="com.example.app"
if adb shell pm list packages | grep -q "$PACKAGE"; then
    echo "Moving $PACKAGE to SD card..."
    adb shell pm move-package "$PACKAGE" external
    
    # Verify move
    if adb shell pm path "$PACKAGE" | grep -q "/mnt/expand"; then
        echo "✓ App moved to SD card successfully"
    else
        echo "✗ Failed to move app to SD card"
    fi
else
    echo "App $PACKAGE not found"
fi
```

SD card backup script:
```sh
#!/bin/bash
BACKUP_DIR="/sdcard/sd_backup_$(date +%Y%m%d)"

echo "=== SD Card Backup ==="

# Create backup directory
adb shell mkdir -p "$BACKUP_DIR"

# Backup important directories
echo "Backing up SD card data..."
DIRECTORIES=("/sdcard/DCIM" "/sdcard/Download" "/sdcard/Documents" "/sdcard/Music")

for dir in "${DIRECTORIES[@]}"; do
    if adb shell test -d "$dir"; then
        DIR_NAME=$(basename "$dir")
        echo "Backing up $DIR_NAME..."
        adb shell cp -r "$dir" "$BACKUP_DIR/"
    fi
done

# Create backup manifest
adb shell echo "SD Card backup: $(date)" > "$BACKUP_DIR/backup_manifest.txt"
adb shell echo "Directories: ${DIRECTORIES[*]}" >> "$BACKUP_DIR/backup_manifest.txt"

echo "SD card backup completed: $BACKUP_DIR"
```

SD card health check:
```sh
#!/bin/bash

echo "=== SD Card Health Check ==="

# Check if SD card is present
if adb shell test -d /sdcard/; then
    echo "✓ SD card detected"
    
    # Check storage health
    echo "Storage information:"
    adb shell df -h /sdcard/
    
    # Check for errors
    echo -e "\nChecking for file system errors..."
    adb shell dmesg | grep -i "mmc\|sdcard\|error" | tail -5
    
    # Check card details (if available)
    echo -e "\nSD card details:"
    adb shell cat /sys/block/mmcblk1/device/health 2>/dev/null || echo "Health info not available"
    adb shell cat /sys/block/mmcblk1/device/serial 2>/dev/null || echo "Serial not available"
    
    # Check for corrupted files
    echo -e "\nChecking for corrupted files..."
    adb shell find /sdcard/ -type f -exec file {} \; 2>/dev/null | grep -v "JPEG\|PNG\|MP4\|MP3" | head -5
else
    echo "✗ SD card not detected"
fi
```

SD card format and setup:
```sh
#!/bin/bash

echo "=== SD Card Format and Setup ==="

# Warning message
echo "⚠ WARNING: This will format the SD card and erase all data!"
echo "Type 'yes' to continue:"
read -r confirmation

if [ "$confirmation" = "yes" ]; then
    echo "Formatting SD card..."
    adb shell sm format /sdcard/
    
    if [ $? -eq 0 ]; then
        echo "✓ SD card formatted successfully"
        
        # Create basic directory structure
        echo "Creating directory structure..."
        adb shell mkdir -p /sdcard/{DCIM,Download,Documents,Music,Videos,Pictures}
        
        echo "SD card setup completed"
    else
        echo "✗ Failed to format SD card"
    fi
else
    echo "Operation cancelled"
fi
```

## Notes
- SD card operations may require root on some devices
- Formatting SD card will erase all data
- Not all apps can be moved to SD card
- SD card performance varies by quality and class
- Some devices don't support external storage
- SD card mounting points vary between Android versions
- Use caution when formatting SD cards
- Backup important data before formatting
- Some SD card operations require specific permissions
- SD card health information may not be available on all devices
- Consider SD card speed class for performance requirements
- Adoptable storage (internal) makes SD card non-portable
