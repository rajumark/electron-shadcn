# DNS Settings - ADB Commands

## Description
Commands for managing DNS configuration, changing DNS servers, and monitoring DNS resolution on Android devices.

### Basic Commands

Check current DNS servers:
```sh
adb shell getprop net.dns1
adb shell getprop net.dns2
```

Set custom DNS servers:
```sh
adb shell setprop net.dns1 8.8.8.8
adb shell setprop net.dns2 8.8.4.4
```

Check DNS resolution:
```sh
adb shell nslookup google.com
```

Test DNS connectivity:
```sh
adb shell ping -c 2 8.8.8.8
```

Check DNS search domains:
```sh
adb shell getprop net.dns.search
```

### Advanced Commands

Set DNS for specific interface:
```sh
adb shell setprop net.dns1.wlan0 8.8.8.8
adb shell setprop net.dns2.wlan0 8.8.4.4
```

Check DNS configuration:
```sh
adb shell dumpsys connectivity | grep -E "dns|DNS"
```

Monitor DNS queries:
```sh
adb shell logcat | grep -E "dns|DNS"
```

Check DNS cache:
```sh
adb shell dumpsys netd | grep -E "dns|cache"
```

Set DNS search domain:
```sh
adb shell setprop net.dns.search "example.com"
```

Check DNS servers for all interfaces:
```sh
adb shell getprop | grep dns
```

Flush DNS cache:
```sh
adb shell ndc flushdefaultif
```

Check DNS resolver:
```sh
adb shell getprop net.dnsresolver
```

Monitor DNS performance:
```sh
adb shell dig google.com | grep -E "Query time|Server"
```

Set private DNS:
```sh
adb shell settings put global private_dns_mode hostname
adb shell settings put global private_dns_specifier "dns.example.com"
```

Check private DNS status:
```sh
adb shell settings get global private_dns_mode
```

Reset DNS to default:
```sh
adb shell setprop net.dns1 ""
adb shell setprop net.dns2 ""
```

### Examples

Check current DNS configuration:
```sh
adb shell getprop | grep dns
```

Set Google DNS:
```sh
adb shell setprop net.dns1 8.8.8.8
adb shell setprop net.dns2 8.8.4.4
```

Test DNS resolution:
```sh
adb shell nslookup google.com
adb shell ping -c 2 google.com
```

Monitor DNS queries:
```sh
adb shell logcat | grep -E "dns|DNS"
```

Set private DNS:
```sh
adb shell settings put global private_dns_mode hostname
adb shell settings put global private_dns_specifier "dns.google"
```

Flush DNS cache:
```sh
adb shell ndc flushdefaultif
```

Check DNS performance:
```sh
adb shell dig google.com | grep "Query time"
```

## Notes
- DNS settings require appropriate permissions
- DNS changes may be reset by network changes
- Private DNS requires Android 9.0+ (API 28+)
- Some networks override custom DNS settings
- Use `getprop | grep dns` to check all DNS properties
- DNS changes affect all network connections
- Some apps may use hardcoded DNS servers
- Use caution when modifying DNS on production devices
