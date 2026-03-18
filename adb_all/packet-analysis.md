# Packet Analysis - ADB Commands

## Description
Commands for analyzing network packets, monitoring packet traffic, and network packet debugging on Android devices.

### Basic Commands

Monitor network packets:
```sh
adb shell tcpdump -i any
```

Check network interfaces:
```sh
adb shell ip link show
```

Monitor packet statistics:
```sh
adb shell cat /proc/net/netstat
```

Check packet routing:
```sh
adb shell ip route
```

Monitor active connections:
```sh
adb shell netstat -an
```

### Advanced Commands

Packet capture and analysis:
```sh
#!/bin/bash
echo "=== Packet Analysis ==="

# Start packet capture
adb shell tcpdump -i any -w /sdcard/capture.pcap &
CAPTURE_PID=$!

# Run for 30 seconds
sleep 30

# Stop capture
kill $CAPTURE_PID

# Pull capture file
adb pull /sdcard/capture.pcap

echo "Packet capture completed"
```

Protocol-specific packet monitoring:
```sh
# Monitor TCP packets
adb shell tcpdump -i any tcp

# Monitor UDP packets
adb shell tcpdump -i any udp

# Monitor HTTP packets
adb shell tcpdump -i any port 80

# Monitor HTTPS packets
adb shell tcpdump -i any port 443
```

App-specific packet analysis:
```sh
# Monitor packets for specific app
adb shell netstat -anp | grep com.example.app
adb shell tcpdump -i any host api.example.com
```

Packet filtering:
```sh
# Filter by source IP
adb shell tcpdump -i any src 192.168.1.100

# Filter by destination port
adb shell tcpdump -i any dst port 8080

# Filter by protocol
adb shell tcpdump -i any icmp

# Filter by packet size
adb shell tcpdump -i any greater 1000
```

Real-time packet monitoring:
```sh
while true; do
  echo "=== Packet Stats $(date) ==="
  adb shell cat /proc/net/dev | grep -E "wlan|rmnet"
  adb shell cat /proc/net/netstat | grep -E "Tcp|Udp"
  sleep 10
done
```

Packet loss analysis:
```sh
# Check packet loss
adb shell ping -c 100 8.8.8.8 | grep -E "packet loss|received"
adb shell cat /proc/net/netstat | grep -E "drop|error"
```

Packet size analysis:
```sh
# Analyze packet sizes
adb shell tcpdump -i any -nn -q | awk '{print $NF}' | sort | uniq -c | sort -nr
```

Network performance packet analysis:
```sh
# Monitor performance-related packets
adb shell tcpdump -i any -nn -v | grep -E "tcp.*flags|udp.*length"
```

Packet debugging:
```sh
# Enable packet debugging
adb shell setprop log.tag.PacketDumper VERBOSE
adb shell logcat | grep PacketDumper
```

Packet flow analysis:
```sh
# Track packet flow
adb shell tcpdump -i any -nn -vv | grep -E "IP.*>.*:.*flags"
```

Packet security analysis:
```sh
# Monitor suspicious packets
adb shell tcpdump -i any -nn | grep -E "port.*scan|flags.*S"
```

Mobile packet analysis:
```sh
# Monitor mobile data packets
adb shell tcpdump -i rmnet0
adb shell cat /proc/net/dev | grep rmnet
```

WiFi packet analysis:
```sh
# Monitor WiFi packets
adb shell tcpdump -i wlan0
adb shell cat /proc/net/wireless
```

### Examples

Basic packet capture:
```sh
adb shell tcpdump -i any -c 100
```

Protocol-specific monitoring:
```sh
adb shell tcpdump -i any tcp port 80
```

Packet statistics:
```sh
adb shell cat /proc/net/dev | grep -E "wlan|rmnet"
adb shell cat /proc/net/netstat | grep -E "Tcp|Udp"
```

Complete packet analysis:
```sh
#!/bin/bash
echo "=== Complete Packet Analysis ==="

# Interface statistics
echo "Interface statistics:"
adb shell cat /proc/net/dev | grep -E "wlan|rmnet"

# Protocol statistics
echo "Protocol statistics:"
adb shell cat /proc/net/netstat | grep -E "Tcp|Udp|Icmp"

# Packet capture (10 seconds)
echo "Capturing packets for 10 seconds..."
adb shell timeout 10 tcpdump -i any -c 50

echo "Packet analysis completed"
```

Packet loss testing:
```sh
adb shell ping -c 50 8.8.8.8 | grep -E "packet loss|transmitted|received"
```

## Notes
- Packet analysis may require root access
- tcpdump may not be available on all Android versions
- Packet capture can consume significant storage
- Network monitoring may impact device performance
- Use packet filtering for specific analysis
- Consider privacy when capturing packets
- Some networks encrypt all traffic
- Packet analysis helps debug network issues
