# Bandwidth Monitoring - ADB Commands

## Description
Commands for monitoring network bandwidth usage, tracking data transfer rates, and analyzing network performance.

### Basic Commands

Check network bandwidth:
```sh
adb shell cat /proc/net/dev
```

Monitor data usage:
```sh
adb shell dumpsys netstats | grep com.example.app
```

Check network interfaces:
```sh
adb shell ip addr show
```

Monitor real-time bandwidth:
```sh
adb shell watch -n 1 "cat /proc/net/dev | grep -E wlan|rmnet"
```

Check data transfer rates:
```sh
adb shell cat /proc/net/dev | grep -E "wlan|rmnet"
```

### Advanced Commands

Comprehensive bandwidth monitoring:
```sh
#!/bin/bash
echo "=== Bandwidth Monitor ==="
while true; do
  echo "$(date):"
  adb shell cat /proc/net/dev | grep -E "wlan|rmnet" | awk '{print $1": RX "$8" bytes, TX "$12" bytes"}'
  sleep 5
done
```

App-specific bandwidth monitoring:
```sh
# Monitor specific app bandwidth
for app in com.example.app com.example.browser; do
  echo "=== $app ==="
  adb shell dumpsys netstats | grep -A 5 "$app"
done
```

Network interface bandwidth:
```sh
# Monitor specific interface
interface="wlan0"
while true; do
  rx1=$(adb shell cat /proc/net/dev | grep $interface | awk '{print $2}')
  tx1=$(adb shell cat /proc/net/dev | grep $interface | awk '{print $10}')
  sleep 1
  rx2=$(adb shell cat /proc/net/dev | grep $interface | awk '{print $2}')
  tx2=$(adb shell cat /proc/net/dev | grep $interface | awk '{print $10}')
  
  rx_rate=$((rx2 - rx1))
  tx_rate=$((tx2 - tx1))
  
  echo "$(date): $interface - RX: $rx_rate B/s, TX: $tx_rate B/s"
done
```

Bandwidth usage history:
```sh
# Get historical bandwidth data
adb shell dumpsys netstats detail | grep -E "uid|rx|tx"
```

Network bandwidth alerts:
```sh
#!/bin/bash
# Alert on high bandwidth usage
threshold=1000000  # 1MB/s

while true; do
  rx=$(adb shell cat /proc/net/dev | grep wlan0 | awk '{print $2}')
  tx=$(adb shell cat /proc/net/dev | grep wlan0 | awk '{print $10}')
  
  if [ $rx -gt $threshold ] || [ $tx -gt $threshold ]; then
    echo "ALERT: High bandwidth usage detected - RX: $rx, TX: $tx"
  fi
  sleep 5
done
```

Bandwidth testing:
```sh
# Test download bandwidth
time adb shell curl -o /dev/null http://speedtest.net/10mb.test

# Test upload bandwidth
time adb shell dd if=/dev/zero bs=1M count=10 | nc server.com 1234
```

Network bandwidth analysis:
```sh
# Analyze bandwidth patterns
adb shell dumpsys netstats | grep -E "foreground|background" | awk '{print $1,$2,$3}'
```

Mobile data bandwidth:
```sh
# Monitor mobile data usage
adb shell cat /proc/net/dev | grep rmnet
adb shell dumpsys netstats | grep -E "mobile|cellular"
```

WiFi bandwidth optimization:
```sh
# Check WiFi bandwidth settings
adb shell dumpsys connectivity | grep -E "wifi|bandwidth|channel"
```

Bandwidth usage by process:
```sh
# Bandwidth by PID
for pid in $(adb shell ps -A | awk '{print $2}'); do
  uid=$(adb shell cat /proc/$pid/status 2>/dev/null | grep Uid | awk '{print $2}')
  echo "PID $pid (UID $uid):"
  adb shell dumpsys netstats | grep "uid=$uid" | tail -1
done
```

Bandwidth performance metrics:
```sh
# Calculate bandwidth efficiency
adb shell dumpsys netstats | grep -E "bytes|packets" | awk '{bytes=$2; packets=$3; print "Efficiency:", bytes/packets, "bytes/packet"}'
```

### Examples

Real-time bandwidth monitoring:
```sh
while true; do
  clear
  echo "Network Bandwidth Monitor - $(date)"
  adb shell cat /proc/net/dev | grep -E "wlan|rmnet" | awk '{print $1": RX "$8" B, TX "$12" B}'
  sleep 2
done
```

App bandwidth monitoring:
```sh
adb shell dumpsys netstats | grep com.example.app
```

Bandwidth testing:
```sh
echo "Testing download bandwidth..."
time adb shell curl -o /dev/null http://example.com/10mb.test
```

Complete bandwidth analysis:
```sh
#!/bin/bash
echo "=== Bandwidth Analysis ==="

# Current usage
echo "Current bandwidth usage:"
adb shell cat /proc/net/dev | grep -E "wlan|rmnet"

# App usage
echo "App-specific usage:"
adb shell dumpsys netstats | grep -E "com.example|foreground"

# Historical data
echo "Historical patterns:"
adb shell dumpsys netstats detail | tail -10

echo "Bandwidth analysis completed"
```

## Notes
- Bandwidth monitoring may require root for detailed data
- Network interfaces vary by device and connection type
- Bandwidth usage affects battery life
- Monitor during different usage patterns
- Some carriers limit bandwidth monitoring
- Use bandwidth data for network optimization
- Consider privacy when monitoring network usage
- Bandwidth measurements may vary by network conditions
