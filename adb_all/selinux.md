# SELinux - ADB Commands

## Description
Commands for managing SELinux policies, checking security contexts, and SELinux enforcement on Android devices.

### Basic Commands

Check SELinux status:
```sh
adb shell getenforce
```

Check SELinux mode:
```sh
adb shell getprop ro.boot.selinux
```

Set SELinux to permissive:
```sh
adb shell su -c "setenforce 0"
```

Set SELinux to enforcing:
```sh
adb shell su -c "setenforce 1"
```

Check SELinux context:
```sh
adb shell ls -Z /system/bin
```

### Advanced Commands

Check file SELinux context:
```sh
adb shell ls -Z /path/to/file
```

Change file context:
```sh
adb shell su -c "chcon u:object_r:system_file:s0 /path/to/file"
```

Check process context:
```sh
adb shell ps -Z
```

Check SELinux denials:
```sh
adb shell dmesg | grep -E "avc.*denied|SELinux"
```

Monitor SELinux messages:
```sh
adb shell logcat | grep -E "SELinux|avc"
```

Check SELinux policy:
```sh
adb shell sestatus
```

List all SELinux contexts:
```sh
adb shell su -c "find /system -exec ls -Z {} \;"
```

Check SELinux booleans:
```sh
adb shell su -c "getsebool -a"
```

Set SELinux boolean:
```sh
adb shell su -c "setsebool -P boolean_name 1"
```

Check SELinux audit logs:
```sh
adb shell cat /data/misc/audit/audit.log | tail -20
```

Restore default context:
```sh
adb shell su -c "restorecon /path/to/file"
```

Check SELinux version:
```sh
adb shell getprop ro.build.selinux
```

### Examples

Check current SELinux status:
```sh
adb shell getenforce
# Output: Enforcing, Permissive, or Disabled
```

Set SELinux to permissive temporarily:
```sh
adb shell su -c "setenforce 0"
```

Check SELinux denials:
```sh
adb shell dmesg | grep -E "avc.*denied" | tail -10
```

Check file security context:
```sh
adb shell ls -Z /system/app/Settings.apk
```

Monitor SELinux violations:
```sh
adb shell logcat | grep -E "avc.*denied|SELinux.*denied"
```

Restore file contexts:
```sh
adb shell su -c "restorecon -R /system"
```

Check all SELinux booleans:
```sh
adb shell su -c "getsebool -a"
```

## Notes
- SELinux commands require root access
- Changing SELinux mode affects device security
- Permissive mode logs violations but doesn't block them
- Enforcing mode blocks SELinux violations
- Context changes may reset on reboot
- Some SELinux policies are device-specific
- Use `restorecon` to reset file contexts
- SELinux violations are logged in dmesg and logcat
