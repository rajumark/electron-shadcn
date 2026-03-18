# Network Shaping - ADB Commands

## Description
Commands for network traffic shaping, bandwidth control, and network quality management.

### Basic Commands

Check network shaping status:
```sh
adb shell tc qdisc show
```

Check bandwidth limits:
```sh
adb shell tc class show
```

Monitor network queues:
```sh
adb shell tc -s qdisc show
```

Check network interfaces:
```sh
adb shell ip link show
```

Monitor network traffic:
```sh
adb shell cat /proc/net/dev
```

### Advanced Commands

Network bandwidth shaping:
```sh
#!/bin/bash
echo "=== Network Bandwidth Shaping ==="

# Set bandwidth limit for interface
interface="wlan0"
rate="1mbit"

echo "Setting bandwidth limit to $rate for $interface:"
adb shell tc qdisc add dev $interface root handle 1: htb default 30
adb shell tc class add dev $interface parent 1: classid 1:1 htb rate $rate
adb shell tc class add dev $interface parent 1:1 classid 1:10 htb rate 512kbit ceil 1mbit
adb shell tc class add dev $interface parent 1:1 classid 1:20 htb rate 256kbit ceil 512kbit
adb shell tc class add dev $interface parent 1:1 classid 1:30 htb rate 128kbit ceil 256kbit
```

Traffic classification:
```sh
# Classify traffic by port
adb shell tc filter add dev wlan0 parent 1: protocol ip prio 1 u32 match ip dport 80 0xffff flowid 1:10
adb shell tc filter add dev wlan0 parent 1: protocol ip prio 1 u32 match ip dport 443 0xffff flowid 1:10
adb shell tc filter add dev wlan0 parent 1: protocol ip prio 2 u32 match ip dport 8080 0xffff flowid 1:20
adb shell tc filter add dev wlan0 parent 1: protocol ip prio 3 u32 match ip protocol 1 0xff flowid 1:30
```

Network latency shaping:
```sh
# Add network delay
interface="wlan0"
delay="100ms"

echo "Adding $delay delay to $interface:"
adb shell tc qdisc add dev $interface root netem delay $delay

# Add jitter
adb shell tc qdisc change dev $interface root netem delay 100ms 20ms

# Add packet loss
adb shell tc qdisc change dev $interface root netem loss 1%
```

Application-specific shaping:
```sh
#!/bin/bash
echo "=== Application-Specific Shaping ==="

# Get app UID
app_uid=$(adb shell dumpsys package com.example.app | grep userId | awk '{print $2}')

# Shape traffic for specific app
echo "Shaping traffic for app UID $app_uid:"
adb shell tc filter add dev wlan0 parent 1: protocol ip prio 1 u32 match ip dst $app_uid 0xffffffff flowid 1:20
```

Network shaping monitoring:
```sh
while true; do
  echo "=== Network Shaping Status $(date) ==="
  adb shell tc -s qdisc show | grep -E "sent|bytes|packets"
  adb shell cat /proc/net/dev | grep wlan0
  sleep 10
done
```

Dynamic bandwidth adjustment:
```sh
#!/bin/bash
echo "=== Dynamic Bandwidth Adjustment ==="

# Adjust bandwidth based on time
for hour in {0..23}; do
  if [ $hour -ge 9 ] && [ $hour -le 17 ]; then
    # Business hours - higher bandwidth
    rate="2mbit"
  else
    # Off hours - lower bandwidth
    rate="500kbit"
  fi
  
  echo "Hour $hour: Setting bandwidth to $rate"
  adb shell tc class change dev wlan0 parent 1:1 classid 1:1 htb rate $rate
  sleep 3600  # Wait 1 hour
done
```

Network shaping for testing:
```sh
#!/bin/bash
echo "=== Network Shaping for Testing ==="

# Simulate slow network
echo "Simulating slow 3G network:"
adb shell tc qdisc add dev wlan0 root netem delay 200ms 50ms loss 2% duplicate 1%

# Test app performance
adb shell am start -n com.example.app/.MainActivity
sleep 10
adb shell am force-stop com.example.app

# Remove shaping
adb shell tc qdisc del dev wlan0 root
```

Quality of Service (QoS) shaping:
```sh
# Set up QoS classes
adb shell tc qdisc add dev wlan0 root handle 1: htb default 30
adb shell tc class add dev wlan0 parent 1: classid 1:1 htb rate 1mbit

# High priority (VoIP, video)
adb shell tc class add dev wlan0 parent 1:1 classid 1:10 htb rate 512kbit ceil 1mbit prio 1
adb shell tc filter add dev wlan0 parent 1: protocol ip prio 1 u32 match ip dport 5060 0xffff flowid 1:10
adb shell tc filter add dev wlan0 parent 1: protocol ip prio 1 u32 match ip dport 443 0xffff flowid 1:10

# Medium priority (web browsing)
adb shell tc class add dev wlan0 parent 1:1 classid 1:20 htb rate 256kbit ceil 512kbit prio 2
adb shell tc filter add dev wlan0 parent 1: protocol ip prio 2 u32 match ip dport 80 0xffff flowid 1:20

# Low priority (background)
adb shell tc class add dev wlan0 parent 1:1 classid 1:30 htb rate 128kbit ceil 256kbit prio 3
```

Network shaping validation:
```sh
#!/bin/bash
echo "=== Network Shaping Validation ==="

# Test bandwidth limits
echo "Testing bandwidth limits:"
time adb shell curl -o /dev/null http://httpbin.org/bytes/1048576

# Test latency
echo "Testing latency:"
adb shell ping -c 5 8.8.8.8 | grep -E "min|avg|max"

# Test packet loss
echo "Testing packet loss:"
adb shell ping -c 100 8.8.8.8 | grep -E "packet loss|received"
```

Network shaping cleanup:
```sh
#!/bin/bash
echo "=== Network Shaping Cleanup ==="

# Remove all qdiscs
for interface in $(adb shell ip link show | grep -E "^[0-9]" | awk '{print $2}' | sed 's/://g'); do
  echo "Cleaning up $interface:"
  adb shell tc qdisc del dev $interface root 2>/dev/null
done

# Verify cleanup
echo "Verifying cleanup:"
adb shell tc qdisc show
```

Network shaping automation:
```sh
#!/bin/bash
echo "=== Automated Network Shaping ==="

# Profile selection
case "$1" in
  "slow")
    delay="500ms"
    loss="5%"
    ;;
  "mobile")
    delay="200ms"
    loss="2%"
    ;;
  "fast")
    delay="50ms"
    loss="0.5%"
    ;;
  *)
    echo "Usage: $0 [slow|mobile|fast]"
    exit 1
    ;;
esac

echo "Applying $1 profile (delay: $delay, loss: $loss)"
adb shell tc qdisc add dev wlan0 root netem delay $delay loss $loss
```

### Examples

Basic bandwidth shaping:
```sh
adb shell tc qdisc add dev wlan0 root handle 1: htb default 30
adb shell tc class add dev wlan0 parent 1:1 classid 1:1 htb rate 1mbit
```

Network delay simulation:
```sh
adb shell tc qdisc add dev wlan0 root netem delay 200ms
echo "Testing with 200ms delay:"
time adb shell ping -c 5 8.8.8.8
```

Complete network shaping:
```sh
#!/bin/bash
echo "=== Complete Network Shaping ==="

# Set up bandwidth control
adb shell tc qdisc add dev wlan0 root handle 1: htb default 30
adb shell tc class add dev wlan0 parent 1:1 classid 1:1 htb rate 1mbit

# Add delay
adb shell tc qdisc add dev wlan0 root netem delay 100ms

# Verify configuration
echo "Current shaping configuration:"
adb shell tc qdisc show
adb shell tc class show

echo "Network shaping completed"
```

## Notes
- Network shaping requires root access
- tc (traffic control) may not be available on all Android versions
- Network shaping affects all network traffic
- Use shaping for testing and simulation
- Monitor performance impact of shaping
- Remove shaping rules when done
- Some apps may bypass shaping
- Consider battery impact of complex shaping rules
