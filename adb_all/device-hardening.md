# Device Hardening - ADB Commands

## Description
Commands for device security hardening, system hardening, and security configuration.

### Basic Commands
Enable device encryption:
```sh
adb shell su -c "vdc cryptfs enablecrypto inplace password"
```

Set secure boot:
```sh
adb shell setprop ro.boot.verifiedbootstate green
```

Enable SELinux:
```sh
adb shell setenforce 1
```

Disable USB debugging:
```sh
adb shell settings put global adb_enabled 0
```

### Advanced Commands
Security hardening script:
```sh
#!/bin/bash
echo "Hardening device..."
adb shell setenforce 1
adb shell settings put global adb_enabled 0
adb shell settings put secure install_non_market_apps 0
adb shell settings put global development_settings_enabled 0
echo "Device hardened"
```

Remove debug tools:
```sh
adb shell su -c "rm -f /system/bin/su /system/xbin/su"
```

Secure file permissions:
```sh
adb shell "find /system -type f -perm /o+w -chmod 644"
```

Disable unnecessary services:
```sh
adb shell "stop telnetd && stop ftpd"
```

Hardening network settings:
```sh
adb shell settings put global private_dns_mode hostname
adb shell settings put global private_dns_specifier "dns.google"
```

App permission hardening:
```sh
for app in $(adb shell pm list packages -3 | cut -d: -f2); do
  adb shell pm revoke $app android.permission.ACCESS_FINE_LOCATION
done
```

Kernel hardening:
```sh
adb shell "echo 1 > /proc/sys/net/ipv4/ip_forward"
adb shell "echo 1 > /proc/sys/net/ipv4/tcp_syncookies"
```

Remove development apps:
```sh
adb shell "pm uninstall com.android.development"
```

Secure boot configuration:
```sh
adb shell "setprop ro.boot.verifiedbootstate green"
adb shell "setprop ro.boot.verifiedbootstate locked"
```

## Notes
- Hardening may affect device functionality
- Test hardening on non-production devices
- Some hardening requires specific Android versions
- Document all hardening changes
- Ensure device backup before hardening
