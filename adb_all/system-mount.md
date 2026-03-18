# System Mount - ADB Commands

## Description
Commands for mounting and unmounting system partitions, managing filesystem access, and storage operations on Android devices.

### Basic Commands

Mount system partition (root required):
```sh
adb shell su -c "mount -o rw,remount /system"
```

Unmount system partition:
```sh
adb shell su -c "umount /system"
```

Mount system read-only:
```sh
adb shell su -c "mount -o ro,remount /system"
```

Check mount status:
```sh
adb shell mount | grep system
```

List all mounted partitions:
```sh
adb shell mount
```

### Advanced Commands

Mount data partition:
```sh
adb shell su -c "mount -o rw,remount /data"
```

Mount vendor partition:
```sh
adb shell su -c "mount -o rw,remount /vendor"
```

Mount system with specific options:
```sh
adb shell su -c "mount -t ext4 -o rw,remount /dev/block/bootdevice/by-name/system /system"
```

Check filesystem type:
```sh
adb shell mount | grep -E "system|data|vendor"
```

Mount with bind:
```sh
adb shell su -c "mount --bind /source /target"
```

Check available block devices:
```sh
adb shell ls -la /dev/block/by-name/
```

Mount system temporarily:
```sh
adb shell su -c "mount -o rw,remount,noatime /system"
```

Check mount options:
```sh
adb shell cat /proc/mounts | grep system
```

Unmount multiple partitions:
```sh
adb shell su -c "umount /system /data /vendor"
```

Mount with specific flags:
```sh
adb shell su -c "mount -o rw,sync,noatime /system"
```

Check disk space:
```sh
adb shell df -h
```

### Examples

Mount system for modification:
```sh
adb shell su -c "mount -o rw,remount /system"
adb shell ls /system/app
# Make changes
adb shell su -c "mount -o ro,remount /system"
```

Check current mount status:
```sh
adb shell mount | grep -E "system|data|vendor|cache"
```

Mount all system partitions read-write:
```sh
adb shell su -c "mount -o rw,remount /system"
adb shell su -c "mount -o rw,remount /vendor"
adb shell su -c "mount -o rw,remount /product"
```

Check available storage space:
```sh
adb shell df -h | grep -E "system|data|sdcard"
```

Mount system with debug flags:
```sh
adb shell su -c "mount -o rw,remount,debug /system"
```

## Notes
- Most mount operations require root access
- System partition is typically mounted read-only for security
- Remounting system may trigger security warnings
- Filesystem types vary by device (ext4, f2fs, etc.)
- Use `mount` without arguments to see all mounts
- Some partitions may be encrypted and require special handling
- Mount operations may be restricted on some Android versions
- Always remount read-only after making changes to system
