# QoS Management - ADB Commands

## Description
Commands for Quality of Service (QoS) management, network priority control, and traffic prioritization.

### Basic Commands

Check QoS status:
```sh
adb shell dumpsys connectivity | grep -E "qos|QoS|priority"
```

List network classes:
```sh
adb shell tc class show
```

Check traffic priorities:
```sh
adb shell tc filter show
```

Monitor QoS policies:
```sh
adb shell settings get global network_priority_policy
```

Check network capabilities:
```sh
adb shell dumpsys connectivity | grep -E "capability|priority"
```

### Advanced Commands

QoS policy management:
```sh
#!/bin/bash
echo "=== QoS Policy Management ==="

# Set QoS policy
adb shell settings put global network_priority_policy enabled
adb shell settings put global qos_class_realtime 1
adb shell settings put global qos_class_interactive 2
adb shell settings put global qos_class_standard 3
adb shell settings put global qos_class_background 4

# Verify policies
adb shell settings get global network_priority_policy
adb shell settings get global qos_class_realtime
```

Traffic prioritization:
```sh
#!/bin/bash
echo "=== Traffic Prioritization ==="

# Set up traffic classes
adb shell tc qdisc add dev wlan0 root handle 1: htb default 40

# Real-time traffic (VoIP, video calls)
adb shell tc class add dev wlan0 parent 1: classid 1:1 htb rate 1mbit ceil 2mbit prio 1
adb shell tc filter add dev wlan0 parent 1: protocol ip prio 1 u32 match ip dport 5060 0xffff flowid 1:1
adb shell tc filter add dev wlan0 parent 1: protocol ip prio 1 u32 match ip dport 5004 0xffff flowid 1:1

# Interactive traffic (web browsing, gaming)
adb shell tc class add dev wlan0 parent 1: classid 1:2 htb rate 512kbit ceil 1mbit prio 2
adb shell tc filter add dev wlan0 parent 1: protocol ip prio 2 u32 match ip dport 80 0xffff flowid 1:2
adb shell tc filter add dev wlan0 parent 1: protocol ip prio 2 u32 match ip dport 443 0xffff flowid 1:2

# Standard traffic (file downloads)
adb shell tc class add dev wlan0 parent 1: classid 1:3 htb rate 256kbit ceil 512kbit prio 3
adb shell tc filter add dev wlan0 parent 1: protocol ip prio 3 u32 match ip dport 8080 0xffff flowid 1:3

# Background traffic (updates, sync)
adb shell tc class add dev wlan0 parent 1: classid 1:4 htb rate 128kbit ceil 256kbit prio 4
adb shell tc filter add dev wlan0 parent 1: protocol ip prio 4 u32 match ip dport 21 0xffff flowid 1:4
```

Application QoS:
```sh
#!/bin/bash
echo "=== Application QoS ==="

# Get app UID for QoS
app_uid=$(adb shell dumpsys package com.example.voip | grep userId | awk '{print $2}')

# Prioritize VoIP app traffic
echo "Prioritizing VoIP app traffic (UID: $app_uid):"
adb shell tc filter add dev wlan0 parent 1: protocol ip prio 1 u32 match ip uid $app_uid 0xffffffff flowid 1:1

# Get gaming app UID
game_uid=$(adb shell dumpsys package com.example.game | grep userId | awk '{print $2}')

# Prioritize gaming app traffic
echo "Prioritizing gaming app traffic (UID: $game_uid):"
adb shell tc filter add dev wlan0 parent 1: protocol ip prio 2 u32 match ip uid $game_uid 0xffffffff flowid 1:2
```

QoS monitoring:
```sh
while true; do
  echo "=== QoS Status $(date) ==="
  adb shell tc -s class show | grep -E "Sent|bytes|packets"
  adb shell dumpsys connectivity | grep -E "priority|qos" | tail -5
  sleep 30
done
```

Dynamic QoS adjustment:
```sh
#!/bin/bash
echo "=== Dynamic QoS Adjustment ==="

# Monitor network conditions and adjust QoS
while true; do
  # Get network quality
  quality=$(adb shell ping -c 1 8.8.8.8 | grep -E "time=" | grep -o "[0-9.]*" | head -1)
  
  if [ ! -z "$quality" ]; then
    if (( $(echo "$quality > 100" | bc -l) )); then
      # Poor network - prioritize essential traffic
      echo "Poor network detected (${quality}ms) - adjusting QoS"
      adb shell tc class change dev wlan0 parent 1:1 classid 1:1 htb rate 512kbit ceil 1mbit
      adb shell tc class change dev wlan0 parent 1:2 classid 1:2 htb rate 256kbit ceil 512kbit
    else
      # Good network - restore normal QoS
      echo "Good network detected (${quality}ms) - restoring QoS"
      adb shell tc class change dev wlan0 parent 1:1 classid 1:1 htb rate 1mbit ceil 2mbit
      adb shell tc class change dev wlan0 parent 1:2 classid 1:2 htb rate 512kbit ceil 1mbit
    fi
  fi
  
  sleep 60
done
```

QoS for video streaming:
```sh
#!/bin/bash
echo "=== QoS for Video Streaming ==="

# Prioritize video streaming traffic
adb shell tc class add dev wlan0 parent 1: classid 1:5 htb rate 2mbit ceil 3mbit prio 1

# Add video streaming ports
video_ports=(1935 1936 5004 5005 8080 8443)

for port in "${video_ports[@]}"; do
  adb shell tc filter add dev wlan0 parent 1: protocol ip prio 1 u32 match ip dport $port 0xffff flowid 1:5
done

# Prioritize video streaming apps
video_apps=("com.netflix.mediaclient" "com.youtube.tv" "com.amazon.avod.thirdpartyclient")

for app in "${video_apps[@]}"; do
  if adb shell pm list packages | grep -q $app; then
    uid=$(adb shell dumpsys package $app | grep userId | awk '{print $2}')
    echo "Prioritizing $app (UID: $uid)"
    adb shell tc filter add dev wlan0 parent 1: protocol ip prio 1 u32 match ip uid $uid 0xffffffff flowid 1:5
  fi
done
```

QoS for real-time applications:
```sh
#!/bin/bash
echo "=== QoS for Real-Time Applications ==="

# Configure low latency QoS
adb shell tc qdisc add dev wlan0 root handle 1: prio
adb shell tc qdisc add dev wlan0 parent 1:1 handle 10: netem delay 10ms

# Prioritize real-time traffic
adb shell tc filter add dev wlan0 parent 1: protocol ip prio 1 u32 match ip protocol 17 0xff flowid 10:1  # UDP
adb shell tc filter add dev wlan0 parent 1: protocol ip prio 2 u32 match ip protocol 6 0xff flowid 10:2  # TCP

# Set up TOS-based prioritization
adb shell tc filter add dev wlan0 parent 1: protocol ip prio 1 u32 match ip tos 0x10 0xff flowid 10:1  # Low delay
adb shell tc filter add dev wlan0 parent 1: protocol ip prio 2 u32 match ip tos 0x08 0xff flowid 10:2  # High throughput
```

QoS validation:
```sh
#!/bin/bash
echo "=== QoS Validation ==="

# Test prioritized traffic
echo "Testing prioritized traffic (port 5060):"
time adb shell nc -v google.com 5060

# Test deprioritized traffic
echo "Testing deprioritized traffic (port 21):"
time adb shell nc -v google.com 21

# Compare results
echo "QoS validation completed"
```

QoS cleanup:
```sh
#!/bin/bash
echo "=== QoS Cleanup ==="

# Remove all QoS rules
adb shell tc qdisc del dev wlan0 root 2>/dev/null

# Reset QoS settings
adb shell settings put global network_priority_policy disabled

# Verify cleanup
echo "Current QoS status:"
adb shell tc qdisc show
adb shell settings get global network_priority_policy
```

QoS automation:
```sh
#!/bin/bash
echo "=== QoS Automation ==="

# Profile-based QoS
case "$1" in
  "gaming")
    echo "Setting up gaming QoS profile..."
    # Prioritize gaming traffic
    adb shell tc qdisc add dev wlan0 root handle 1: htb default 30
    adb shell tc class add dev wlan0 parent 1: classid 1:1 htb rate 2mbit ceil 3mbit prio 1
    ;;
  "streaming")
    echo "Setting up streaming QoS profile..."
    # Prioritize streaming traffic
    adb shell tc qdisc add dev wlan0 root handle 1: htb default 30
    adb shell tc class add dev wlan0 parent 1: classid 1:1 htb rate 3mbit ceil 5mbit prio 1
    ;;
  "work")
    echo "Setting up work QoS profile..."
    # Prioritize work applications
    adb shell tc qdisc add dev wlan0 root handle 1: htb default 30
    adb shell tc class add dev wlan0 parent 1: classid 1:1 htb rate 1mbit ceil 2mbit prio 1
    ;;
  *)
    echo "Usage: $0 [gaming|streaming|work]"
    exit 1
    ;;
esac

echo "QoS profile $1 applied"
```

### Examples

Basic QoS setup:
```sh
adb shell tc qdisc add dev wlan0 root handle 1: htb default 30
adb shell tc class add dev wlan0 parent 1: classid 1:1 htb rate 1mbit ceil 2mbit prio 1
```

Application prioritization:
```sh
app_uid=$(adb shell dumpsys package com.example.app | grep userId | awk '{print $2}')
adb shell tc filter add dev wlan0 parent 1: protocol ip prio 1 u32 match ip uid $app_uid 0xffffffff flowid 1:1
```

Complete QoS configuration:
```sh
#!/bin/bash
echo "=== Complete QoS Configuration ==="

# Set up QoS classes
adb shell tc qdisc add dev wlan0 root handle 1: htb default 40
adb shell tc class add dev wlan0 parent 1: classid 1:1 htb rate 1mbit ceil 2mbit prio 1
adb shell tc class add dev wlan0 parent 1: classid 1:2 htb rate 512kbit ceil 1mbit prio 2
adb shell tc class add dev wlan0 parent 1: classid 1:3 htb rate 256kbit ceil 512kbit prio 3
adb shell tc class add dev wlan0 parent 1: classid 1:4 htb rate 128kbit ceil 256kbit prio 4

# Add filters
adb shell tc filter add dev wlan0 parent 1: protocol ip prio 1 u32 match ip dport 5060 0xffff flowid 1:1
adb shell tc filter add dev wlan0 parent 1: protocol ip prio 2 u32 match ip dport 80 0xffff flowid 1:2

echo "QoS configuration completed"
```

## Notes
- QoS management requires root access
- tc (traffic control) may not be available on all Android versions
- QoS affects network performance for all apps
- Use QoS for optimizing critical applications
- Monitor QoS impact on overall performance
- Remove QoS rules when no longer needed
- Some apps may bypass QoS settings
- Consider battery impact of complex QoS rules
