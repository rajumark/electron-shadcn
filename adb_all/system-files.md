# System Files - ADB Commands

## Description
Commands for accessing and managing Android system files, including system partitions, configuration files, and protected directories.

### Basic Commands

Access system directory:
```sh
adb shell ls /system/
```

List system apps:
```sh
adb shell ls /system/app/
```

View system properties file:
```sh
adb shell cat /system/build.prop
```

Check system partition:
```sh
adb shell mount | grep system
```

### Advanced Commands

Mount system as writable (requires root):
```sh
adb shell mount -o rw,remount /system
```

Mount system as read-only:
```sh
adb shell mount -o ro,remount /system
```

Copy system file:
```sh
adb shell cp /system/build.prop /sdcard/
```

Edit system file (requires root):
```sh
adb shell vi /system/build.prop
```

Check system partition size:
```sh
adb shell df -h /system
```

List system libraries:
```sh
adb shell ls /system/lib/
```

View system configuration:
```sh
adb shell getprop
```

Set system property (requires root):
```sh
adb shell setprop debug.test 1
```

Backup system partition:
```sh
adb shell dd if=/system of=/sdcard/system.img
```

Check system file permissions:
```sh
adb shell ls -la /system/bin/
```

Find system files by name:
```sh
adb shell find /system/ -name "*.apk"
```

Check system services:
```sh
adb shell ls /system/bin/
```

### Examples

System file backup script:
```sh
#!/bin/bash
BACKUP_DIR="/sdcard/system_backup_$(date +%Y%m%d)"

echo "=== System File Backup ==="

# Create backup directory
adb shell mkdir -p "$BACKUP_DIR"

# Backup important system files
echo "Backing up system files..."
adb shell cp /system/build.prop "$BACKUP_DIR/"
adb shell cp /system/etc/hosts "$BACKUP_DIR/"
adb shell cp -r /system/app/ "$BACKUP_DIR/system_app/"

# Create backup log
adb shell echo "System backup created: $(date)" > "$BACKUP_DIR/backup_log.txt"

echo "System backup completed: $BACKUP_DIR"
```

System file analysis:
```sh
#!/bin/bash

echo "=== System File Analysis ==="

# System partition info
echo "System partition information:"
adb shell df -h /system/

# System properties
echo -e "\nKey system properties:"
adb shell getprop | grep -E "(ro.build|ro.product|ro.hardware)"

# System apps count
echo -e "\nSystem apps count:"
adb shell ls /system/app/ | wc -l

# System libraries
echo -e "\nSystem libraries count:"
adb shell ls /system/lib/ | wc -l
```

System file modification (root required):
```sh
#!/bin/bash

echo "=== System File Modification ==="

# Check if root is available
if adb shell su -c "id" 2>/dev/null | grep -q "uid=0"; then
    echo "Root access available"
    
    # Mount system as writable
    echo "Mounting system as writable..."
    adb shell su -c "mount -o rw,remount /system"
    
    # Backup original file
    echo "Backing up hosts file..."
    adb shell su -c "cp /system/etc/hosts /system/etc/hosts.bak"
    
    # Add custom hosts entry
    echo "Adding custom hosts entry..."
    adb shell su -c "echo '127.0.0.1 test.local' >> /system/etc/hosts"
    
    # Mount system as read-only
    echo "Mounting system as read-only..."
    adb shell su -c "mount -o ro,remount /system"
    
    echo "System file modification completed"
else
    echo "Root access not available"
fi
```

System file recovery:
```sh
#!/bin/bash

echo "=== System File Recovery ==="

# Check for backup
BACKUP_DIR="/sdcard/system_backup_*"
if adb shell test -d $BACKUP_DIR; then
    echo "Found system backup"
    
    # Mount system as writable
    adb shell su -c "mount -o rw,remount /system" 2>/dev/null
    
    # Restore files
    echo "Restoring system files..."
    adb shell su -c "cp $BACKUP_DIR/build.prop /system/"
    adb shell su -c "cp $BACKUP_DIR/hosts /system/etc/"
    
    # Restore permissions
    adb shell su -c "chmod 644 /system/build.prop"
    adb shell su -c "chmod 644 /system/etc/hosts"
    
    # Mount as read-only
    adb shell su -c "mount -o ro,remount /system" 2>/dev/null
    
    echo "System file recovery completed"
else
    echo "No system backup found"
fi
```

System file integrity check:
```sh
#!/bin/bash

echo "=== System File Integrity Check ==="

# Check critical system files
CRITICAL_FILES=(
    "/system/build.prop"
    "/system/etc/hosts"
    "/system/framework/framework.jar"
    "/system/bin/sh"
)

for file in "${CRITICAL_FILES[@]}"; do
    echo "Checking $file..."
    if adb shell test -f "$file"; then
        echo "✓ File exists"
        
        # Check file size
        SIZE=$(adb shell stat -c%s "$file" 2>/dev/null)
        echo "Size: $SIZE bytes"
        
        # Check permissions
        PERMS=$(adb shell stat -c "%a" "$file" 2>/dev/null)
        echo "Permissions: $PERMS"
    else
        echo "✗ File missing"
    fi
    echo "---"
done
```

System partition management:
```sh
#!/bin/bash

echo "=== System Partition Management ==="

# Partition information
echo "System partition details:"
adb shell mount | grep system

# Space usage
echo -e "\nSystem partition usage:"
adb shell df -h /system/

# Check for modifications
echo -e "\nChecking for system modifications..."
adb shell find /system/ -name "*.bak" -o -name "*.orig" | head -10

# System file types
echo -e "\nSystem file types:"
adb shell find /system/ -type f | sed 's/.*\.//' | sort | uniq -c | sort -nr | head -10
```

## Notes
- System file access typically requires root
- Modifying system files can void warranty
- Always backup system files before modification
- System partition is usually mounted read-only
- Incorrect modifications can brick the device
- Some system files are protected by SELinux
- System file locations vary between Android versions
- Use caution when editing system configuration
- Some system apps cannot be easily removed
- Consider using custom recovery for system modifications
- Always test system modifications on non-critical devices first
- Keep original files for recovery purposes
