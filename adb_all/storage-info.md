# Storage Information - ADB Commands

## Description
Commands for analyzing and monitoring Android device storage, including internal storage, SD card, and partition information.

### Basic Commands

Check storage usage:
```sh
adb shell df
```

Check SD card storage:
```sh
adb shell df /sdcard/
```

Get storage details:
```sh
adb shell df -h
```

List storage partitions:
```sh
adb shell mount | grep -E "(ext4|vfat|fuse)"
```

### Advanced Commands

Get detailed storage info:
```sh
adb shell dumpsys diskstats
```

Check app storage usage:
```sh
adb shell dumpsys diskstats | grep com.example.app
```

Get internal storage info:
```sh
adb shell df /data/
```

Check external storage:
```sh
adb shell df /storage/
```

Get storage block size:
```sh
adb shell stat -fc %s /sdcard/
```

Check available inodes:
```sh
adb shell df -i /sdcard/
```

Get storage filesystem type:
```sh
adb shell mount | grep /sdcard/
```

Check storage health:
```sh
adb shell cat /sys/block/mmcblk0/device/health
```

Get storage temperature:
```sh
adb shell cat /sys/class/thermal/thermal_zone*/temp
```

Check storage wear level:
```sh
adb shell cat /sys/block/mmcblk0/device/life_time
```

Get storage serial number:
```sh
adb shell cat /sys/block/mmcblk0/device/serial
```

Check storage performance:
```sh
adb shell cat /proc/diskstats | grep mmcblk0
```

### Examples

Storage analysis script:
```sh
#!/bin/bash

echo "=== Storage Analysis ==="

# General storage info
echo "Storage overview:"
adb shell df -h

# Internal storage details
echo -e "\nInternal storage:"
adb shell df -h /data/

# External storage details
echo -e "\nExternal storage:"
adb shell df -h /sdcard/

# Storage usage by category
echo -e "\nStorage usage by category:"
adb shell du -sh /sdcard/* 2>/dev/null | sort -hr
```

Storage monitoring script:
```sh
#!/bin/bash

echo "=== Storage Monitoring ==="

# Get storage thresholds
TOTAL_SPACE=$(adb shell df /sdcard/ | tail -1 | awk '{print $2}')
USED_SPACE=$(adb shell df /sdcard/ | tail -1 | awk '{print $3}')
AVAILABLE_SPACE=$(adb shell df /sdcard/ | tail -1 | awk '{print $4}')

# Convert to GB
TOTAL_GB=$((TOTAL_SPACE / 1024 / 1024))
USED_GB=$((USED_SPACE / 1024 / 1024))
AVAILABLE_GB=$((AVAILABLE_SPACE / 1024 / 1024))
USAGE_PERCENT=$((USED_SPACE * 100 / TOTAL_SPACE))

echo "Total space: ${TOTAL_GB}GB"
echo "Used space: ${USED_GB}GB"
echo "Available space: ${AVAILABLE_GB}GB"
echo "Usage percentage: ${USAGE_PERCENT}%"

# Check storage warnings
if [ "$USAGE_PERCENT" -gt 90 ]; then
    echo "⚠ WARNING: Storage usage above 90%"
elif [ "$USAGE_PERCENT" -gt 80 ]; then
    echo "⚠ CAUTION: Storage usage above 80%"
else
    echo "✓ Storage usage is normal"
fi
```

App storage analysis:
```sh
#!/bin/bash

echo "=== App Storage Analysis ==="

# Get top storage consuming apps
echo "Top storage consuming apps:"
adb shell dumpsys diskstats | grep -E "Package|Data" | head -20

# Analyze specific app
PACKAGE="com.example.app"
if adb shell pm list packages | grep -q "$PACKAGE"; then
    echo -e "\nStorage usage for $PACKAGE:"
    adb shell dumpsys package "$PACKAGE" | grep -A 5 "storage"
    
    # Get app data size
    if adb shell run-as "$PACKAGE" test -d /data/data/"$PACKAGE" 2>/dev/null; then
        DATA_SIZE=$(adb shell run-as "$PACKAGE" du -sh /data/data/"$PACKAGE" 2>/dev/null | cut -f1)
        echo "App data size: $DATA_SIZE"
    fi
else
    echo "App $PACKAGE not found"
fi
```

Storage health check:
```sh
#!/bin/bash

echo "=== Storage Health Check ==="

# Check storage temperature
echo "Storage temperature:"
adb shell cat /sys/class/thermal/thermal_zone*/temp 2>/dev/null | awk '{print "Temperature: " $1/1000 "°C"}'

# Check storage wear (if available)
echo -e "\nStorage wear level:"
adb shell cat /sys/block/mmcblk0/device/life_time 2>/dev/null || echo "Wear level not available"

# Check storage errors
echo -e "\nStorage errors:"
adb shell dmesg | grep -i "mmc\|storage\|error" | tail -5

# Check storage performance
echo -e "\nStorage performance:"
adb shell cat /proc/diskstats | grep mmcblk0 | awk '{print "Reads: " $4 ", Writes: " $8}'
```

Storage cleanup recommendations:
```sh
#!/bin/bash

echo "=== Storage Cleanup Recommendations ==="

# Check available space
AVAILABLE_SPACE=$(adb shell df /sdcard/ | tail -1 | awk '{print $4}')
AVAILABLE_GB=$((AVAILABLE_SPACE / 1024 / 1024))

echo "Available space: ${AVAILABLE_GB}GB"

if [ "$AVAILABLE_GB" -lt 2 ]; then
    echo -e "\nRecommendations for cleanup:"
    
    # Large files
    echo "Large files to consider removing:"
    adb shell find /sdcard/ -type f -size +100M -exec ls -lh {} \; 2>/dev/null | head -10
    
    # Old downloads
    echo -e "\nOld downloads:"
    adb shell find /sdcard/Download/ -mtime +30 -exec ls -lh {} \; 2>/dev/null | head -5
    
    # Cache directories
    echo -e "\nCache directories:"
    adb shell find /sdcard/ -name "cache" -type d -exec du -sh {} \; 2>/dev/null | head -5
    
    # Unused apps
    echo -e "\nConsider uninstalling unused apps"
    adb shell pm list packages -3 | head -10
else
    echo "✓ Storage space is sufficient"
fi
```

Complete storage report:
```sh
#!/bin/bash
REPORT_FILE="storage_report_$(date +%Y%m%d_%H%M%S).txt"

echo "=== Complete Storage Report ==="

{
    echo "Storage Report - $(date)"
    echo "================================"
    
    echo -e "\n--- General Storage Info ---"
    adb shell df -h
    
    echo -e "\n--- Partition Information ---"
    adb shell mount | grep -E "(ext4|vfat|fuse)"
    
    echo -e "\n--- Storage Statistics ---"
    adb shell dumpsys diskstats
    
    echo -e "\n--- Large Files ---"
    adb shell find /sdcard/ -type f -size +50M -exec ls -lh {} \; 2>/dev/null | head -20
    
    echo -e "\n--- Directory Usage ---"
    adb shell du -sh /sdcard/*/ 2>/dev/null | sort -hr | head -15
    
} > "$REPORT_FILE"

echo "Storage report saved to $REPORT_FILE"
```

## Notes
- Storage information varies between Android versions
- Some storage details require root access
- External storage may not be available on all devices
- Storage temperature sensors may not be present on all devices
- Wear level information is device-specific
- Storage performance can be affected by many factors
- Use human-readable format (-h) for easier interpretation
- Storage usage can fluctuate during file operations
- Consider storage type (eMMC, UFS) when analyzing performance
- Regular monitoring helps prevent storage issues
