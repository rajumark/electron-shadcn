# Network Monitoring - ADB Commands

## Description
Commands for monitoring network traffic, analyzing network performance, and debugging network connectivity issues.

### Basic Commands

Monitor network interfaces:
```sh
adb shell cat /proc/net/dev
```

Check network connections:
```sh
adb shell netstat -an
```

Monitor network statistics:
```sh
adb shell cat /proc/net/netstat
```

Check network routing:
```sh
adb shell ip route
```

Monitor network traffic:
```sh
adb shell tcpdump -i any
```

### Advanced Commands

Monitor app network usage:
```sh
adb shell dumpsys netstats | grep com.example.app
```

Monitor network latency:
```sh
adb shell ping -c 10 -i 0.5 8.8.8.8
```

Check network bandwidth:
```sh
adb shell cat /proc/net/dev | grep -E "wlan|rmnet"
```

Monitor DNS queries:
```sh
adb shell logcat | grep -E "dns|DNS"
```

Track network events:
```sh
adb shell logcat | grep -E "network|connectivity"
```

Monitor network by UID:
```sh
adb shell cat /proc/net/xt_qtaguid/stats | grep UID
```

Check network quality:
```sh
adb shell dumpsys connectivity | grep -E "NetworkAgentInfo|LinkProperties"
```

Monitor network packets:
```sh
adb shell tcpdump -i wlan0 -c 100
```

Track network errors:
```sh
adb shell cat /proc/net/netstat | grep -E "error|drop"
```

Monitor network buffers:
```sh
adb shell cat /proc/net/snmp
```

Check network socket usage:
```sh
adb shell cat /proc/net/sockstat
```

Monitor network by interface:
```sh
adb shell watch -n 1 "cat /proc/net/dev | grep -E wlan|rmnet"
```

Track network bandwidth over time:
```sh
for i in {1..10}; do
  echo "$(date): $(cat /proc/net/dev | grep wlan0)"
  sleep 30
done
```

### Examples

Monitor network traffic:
```sh
adb shell tcpdump -i wlan0 -c 50
```

Check network statistics:
```sh
adb shell cat /proc/net/dev | grep -E "wlan|rmnet"
```

Monitor app network usage:
```sh
adb shell dumpsys netstats | grep com.example.app
```

Track network events:
```sh
adb shell logcat | grep -E "network.*connect|connectivity.*change"
```

Monitor network latency:
```sh
adb shell ping -c 20 -i 1 8.8.8.8
```

Check network connections:
```sh
adb shell netstat -an | grep -E "ESTABLISHED|LISTEN"
```

Monitor bandwidth over time:
```sh
while true; do
  echo "$(date): $(cat /proc/net/dev | grep wlan0)"
  sleep 60
done
```

## Notes
- Network monitoring may require root access
- tcpdump may not be available on all Android versions
- Network monitoring can impact device performance
- Use `dumpsys netstats` for app-specific network data
- Some network features vary by device manufacturer
- Network monitoring may require additional packages
- Use caution when monitoring network traffic
- Some network data may be restricted for privacy
