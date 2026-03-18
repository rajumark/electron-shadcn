# Storage Advanced - ADB Commands

## Description
Commands for advanced storage management, storage debugging, and low-level storage operations.

### Basic Commands

Check storage devices:
```sh
adb shell ls -la /dev/block/
```

Check storage usage:
```sh
adb shell df -h
```

Check storage partitions:
```sh
adb shell cat /proc/partitions
```

Monitor storage I/O:
```sh
adb shell iostat 1 5
```

Check storage performance:
```sh
adb shell cat /proc/diskstats
```

### Advanced Commands

Storage device analysis:
```sh
#!/bin/bash
echo "=== Storage Device Analysis ==="

# Check block devices
echo "Block devices:"
adb shell ls -la /dev/block/

# Check storage partitions
echo "Storage partitions:"
adb shell cat /proc/partitions

# Check storage geometry
echo "Storage geometry:"
adb shell cat /sys/block/mmcblk0/size 2>/dev/null
adb shell cat /sys/block/mmcblk0/queue/physical_block_size 2>/dev/null

# Check storage type
echo "Storage type:"
adb shell cat /sys/block/mmcblk0/device/type 2>/dev/null
```

Storage performance testing:
```sh
#!/bin/bash
echo "=== Storage Performance Testing ==="

# Sequential read test
echo "Sequential read test:"
time adb shell dd if=/dev/block/mmcblk0 of=/dev/null bs=1M count=100

# Sequential write test
echo "Sequential write test:"
time adb shell dd if=/dev/zero of=/sdcard/test_write bs=1M count=100

# Random read test
echo "Random read test:"
adb shell fio --name=randread --rw=randread --bs=4k --size=100M --filename=/sdcard/test_randread

# Random write test
echo "Random write test:"
adb shell fio --name=randwrite --rw=randwrite --bs=4k --size=100M --filename=/sdcard/test_randwrite
```

Storage filesystem analysis:
```sh
#!/bin/bash
echo "=== Storage Filesystem Analysis ==="

# Check mounted filesystems
echo "Mounted filesystems:"
adb shell cat /proc/mounts | head -10

# Check filesystem types
echo "Filesystem types:"
adb shell cat /proc/filesystems | head -10

# Check ext4 filesystem
echo "Ext4 filesystem:"
adb shell tune2fs -l /dev/block/mmcblk0p28 2>/dev/null

# Check f2fs filesystem
echo "F2FS filesystem:"
adb shell dump.f2fs -s /dev/block/mmcblk0p28 2>/dev/null
```

Storage debugging:
```sh
#!/bin/bash
echo "=== Storage Debugging ==="

# Check storage errors
echo "Storage errors:"
adb shell dmesg | grep -E "mmc|sd|storage|error" | tail -10

# Check storage I/O errors
echo "Storage I/O errors:"
adb shell cat /proc/diskstats | grep -E "mmc|sd"

# Monitor storage activity
echo "Storage activity monitoring:"
for i in {1..10}; do
  echo "Storage check $i:"
  adb shell iostat 1 1 | tail -5
  sleep 2
done
```

Storage optimization:
```sh
#!/bin/bash
echo "=== Storage Optimization ==="

# Optimize I/O scheduler
echo "Optimizing I/O scheduler..."
adb shell echo cfq > /sys/block/mmcblk0/queue/scheduler

# Optimize read-ahead
echo "Optimizing read-ahead..."
adb shell echo 256 > /sys/block/mmcblk0/queue/read_ahead_kb

# Optimize nr_requests
echo "Optimizing nr_requests..."
adb shell echo 128 > /sys/block/mmcblk0/queue/nr_requests

# Verify optimization
echo "Optimization verification:"
adb shell cat /sys/block/mmcblk0/queue/scheduler
adb shell cat /sys/block/mmcblk0/queue/read_ahead_kb
```

Storage wear leveling:
```sh
#!/bin/bash
echo "=== Storage Wear Leveling ==="

# Check eMMC wear
echo "eMMC wear level:"
adb shell cat /sys/block/mmcblk0/device/life_time 2>/dev/null

# Check UFS wear
echo "UFS wear level:"
adb shell cat /sys/block/sda/device/life_time 2>/dev/null

# Monitor wear over time
echo "Monitoring wear level..."
for i in {1..10}; do
  echo "Wear check $i:"
  adb shell cat /sys/block/mmcblk0/device/life_time 2>/dev/null
  sleep 10
done
```

Storage encryption analysis:
```sh
#!/bin/bash
echo "=== Storage Encryption Analysis ==="

# Check encryption status
echo "Encryption status:"
adb shell getprop ro.crypto.state
adb shell getprop ro.crypto.type

# Check encrypted directories
echo "Encrypted directories:"
adb shell find /data -type d -name "*encrypt*" | head -10

# Check encryption keys
echo "Encryption keys:"
adb shell ls -la /data/misc/vold/ 2>/dev/null

# Check encryption performance
echo "Encryption performance test:"
time adb shell dd if=/dev/zero of=/sdcard/encrypted_test bs=1M count=50
```

Storage quota management:
```sh
#!/bin/bash
echo "=== Storage Quota Management ==="

# Check storage quotas
echo "Storage quotas:"
adb shell quota -v /data 2>/dev/null

# Check app storage usage
echo "App storage usage:"
adb shell du -sh /data/app/* | head -10

# Check user storage usage
echo "User storage usage:"
adb shell du -sh /data/user/* 2>/dev/null

# Set storage limits
echo "Setting storage limits..."
adb shell quota -v /data 10000000 2>/dev/null
```

Storage health monitoring:
```sh
#!/bin/bash
echo "=== Storage Health Monitoring ==="

# Check storage health
echo "Storage health:"
adb shell cat /sys/block/mmcblk0/device/health 2>/dev/null

# Check bad blocks
echo "Bad blocks check:"
adb shell badblocks -s /dev/block/mmcblk0 2>/dev/null

# Monitor storage temperature
echo "Storage temperature:"
adb shell find /sys -name "*temp*" -exec grep -l "storage\|mmc" {} \; 2>/dev/null

# Monitor storage errors
echo "Storage errors monitoring:"
adb shell dmesg | grep -E "mmc.*error|storage.*error" | tail -10
```

Real-time storage monitoring:
```sh
#!/bin/bash
echo "=== Real-time Storage Monitoring ==="

# Monitor storage system in real-time
while true; do
  echo "=== Storage Monitor $(date) ==="
  
  # Storage usage
  echo "Storage usage:"
  adb shell df -h | head -5
  
  # Storage I/O
  echo "Storage I/O:"
  adb shell iostat 1 1 | tail -5
  
  # Storage errors
  echo "Storage errors:"
  adb shell dmesg | grep -E "mmc|sd|error" | tail -3
  
  sleep 30
done
```

### Examples

Basic storage analysis:
```sh
adb shell ls -la /dev/block/
adb shell df -h
adb shell cat /proc/partitions
adb shell iostat 1 3
```

Storage performance testing:
```sh
time adb shell dd if=/dev/zero of=/sdcard/test bs=1M count=100
time adb shell dd if=/sdcard/test of=/dev/null bs=1M count=100
adb shell rm /sdcard/test
```

Storage optimization:
```sh
adb shell echo cfq > /sys/block/mmcblk0/queue/scheduler
adb shell echo 256 > /sys/block/mmcblk0/queue/read_ahead_kb
adb shell cat /sys/block/mmcblk0/queue/scheduler
```

Complete storage analysis:
```sh
#!/bin/bash
echo "=== Complete Storage Analysis ==="

# Storage devices
echo "Storage devices:"
adb shell ls -la /dev/block/ | head -15

# Storage usage
echo "Storage usage:"
adb shell df -h | head -5

# Storage performance
echo "Storage performance:"
adb shell iostat 1 1 | tail -5

echo "Storage analysis completed"
```

## Notes
- Storage commands require root access for most operations
- Storage performance testing can affect device performance
- Some storage features depend on hardware support
- Use storage commands carefully in production
- Monitor storage system during debugging
- Some storage parameters may be reset on reboot
- Document storage configuration changes
- Consider data safety when modifying storage settings
