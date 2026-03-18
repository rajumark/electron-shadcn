# Root Access - ADB Commands

## Description
Commands for managing root access, checking root status, and performing superuser operations on Android devices.

### Basic Commands

Check if device is rooted:
```sh
adb shell su -c "id"
```

Test root access:
```sh
adb shell su -c "whoami"
```

Check su binary:
```sh
adb shell which su
```

Check root permissions:
```sh
adb shell su -c "ls -la /system/bin/su"
```

Get root shell:
```sh
adb shell su
```

### Advanced Commands

Check root management apps:
```sh
adb shell pm list packages | grep -E "root|super|su"
```

Check SELinux context:
```sh
adb shell su -c "id -Z"
```

Test root file access:
```sh
adb shell su -c "cat /proc/version"
```

Check system partition mount:
```sh
adb shell su -c "mount | grep system"
```

Remount system as read-write:
```sh
adb shell su -c "mount -o rw,remount /system"
```

Check root capabilities:
```sh
adb shell su -c "capsh --print"
```

Monitor root access attempts:
```sh
adb shell logcat | grep -E "su|root|superuser"
```

Check for rootkits:
```sh
adb shell su -c "ps -A | grep -E su|root"
```

Test sudo functionality:
```sh
adb shell su -c "echo 'root test'"
```

Check root directory permissions:
```sh
adb shell su -c "ls -la /"
```

Verify root shell:
```sh
adb shell su -c "echo $USER"
```

Check for Magisk:
```sh
adb shell getprop ro.magisk.version
```

### Examples

Test if device is rooted:
```sh
adb shell su -c "id" 2>/dev/null && echo "Rooted" || echo "Not rooted"
```

Get root shell and run commands:
```sh
adb shell su -c "mount -o rw,remount /system && ls /system/app"
```

Check for root management apps:
```sh
adb shell pm list packages | grep -i "super\|su\|root"
```

Remount system partition:
```sh
adb shell su -c "mount -o rw,remount /system"
# Make changes
adb shell su -c "mount -o ro,remount /system"
```

Check Magisk installation:
```sh
adb shell getprop | grep magisk
adb shell ls -la /sbin/
```

Monitor root usage:
```sh
adb shell logcat | grep -E "su.*granted|root.*access"
```

## Notes
- Root access requires rooted device
- Some commands may not work on all root methods
- Root access voids device warranty
- Use root access with caution
- Different root methods (Magisk, SuperSU) have different behaviors
- Some apps may detect root access
- Root permissions may be revoked by security apps
- Always backup device before root operations
