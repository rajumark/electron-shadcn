# Network Debugging - ADB Commands

## Description
Commands for debugging network issues, monitoring network traffic, and troubleshooting connectivity problems on Android devices.

### Basic Commands

Check network connectivity:
```sh
adb shell ping -c 4 8.8.8.8
```

Check DNS resolution:
```sh
adb shell nslookup google.com
```

Check network interfaces:
```sh
adb shell ip addr
```

Check routing table:
```sh
adb shell ip route
```

Check network statistics:
```sh
adb shell cat /proc/net/dev
```

### Advanced Commands

Monitor network traffic:
```sh
adb shell tcpdump -i any
```

Check network connections:
```sh
adb shell netstat -an
```

Monitor DNS queries:
```sh
adb shell logcat | grep -E "dns|DNS"
```

Check network latency:
```sh
adb shell ping -c 10 -i 0.5 8.8.8.8
```

Check HTTP connectivity:
```sh
adb shell curl -I http://google.com
```

Monitor network events:
```sh
adb shell logcat | grep -E "network|connectivity"
```

Check network configuration:
```sh
adb shell dumpsys connectivity
```

Trace network route:
```sh
adb shell traceroute 8.8.8.8
```

Check firewall rules:
```sh
adb shell iptables -L
```

Monitor bandwidth usage:
```sh
adb shell dumpsys netstats
```

Check network permissions:
```sh
adb shell dumpsys package | grep -E "network|internet"
```

Debug network stack:
```sh
adb shell dumpsys netd
```

### Examples

Test basic connectivity:
```sh
adb shell ping -c 4 8.8.8.8
adb shell ping -c 4 google.com
```

Check DNS resolution:
```sh
adb shell nslookup google.com
adb shell getprop net.dns1
```

Monitor network traffic:
```sh
adb shell tcpdump -i wlan0 -c 20
```

Check network configuration:
```sh
adb shell dumpsys connectivity | grep -E "NetworkAgentInfo|LinkProperties"
```

Trace network path:
```sh
adb shell traceroute 8.8.8.8
```

Check network statistics:
```sh
adb shell cat /proc/net/dev | grep -E "wlan|rmnet"
```

Monitor network events:
```sh
adb shell logcat | grep -E "network.*connect|connectivity.*change"
```

## Notes
- Network debugging may require root access for some commands
- tcpdump may not be available on all Android versions
- Some network commands require busybox installation
- Use `dumpsys connectivity` for comprehensive network info
- Network debugging may impact device performance
- Some network features vary by device manufacturer
- Use caution when monitoring network traffic
- Network debugging tools may require additional packages
