# Latency Testing - ADB Commands

## Description
Commands for testing network latency, measuring response times, and analyzing network performance delays.

### Basic Commands

Ping test:
```sh
adb shell ping -c 4 8.8.8.8
```

Check DNS latency:
```sh
adb shell nslookup google.com
```

Test HTTP latency:
```sh
adb shell curl -w "%{time_total}\n" -o /dev/null http://google.com
```

Check network latency:
```sh
adb shell ping -c 10 -i 0.5 8.8.8.8
```

Test connection latency:
```sh
adb shell time nc -zv google.com 80
```

### Advanced Commands

Comprehensive latency testing:
```sh
#!/bin/bash
echo "=== Latency Test Suite ==="

# Ping latency
echo "Ping latency to 8.8.8.8:"
adb shell ping -c 10 8.8.8.8 | tail -1

# DNS latency
echo "DNS lookup latency:"
time adb shell nslookup google.com

# HTTP latency
echo "HTTP request latency:"
adb shell curl -w "DNS: %{time_namelookup}s\nConnect: %{time_connect}s\nTotal: %{time_total}s\n" -o /dev/null http://google.com
```

Multi-server latency comparison:
```sh
servers=("8.8.8.8" "1.1.1.1" "208.67.222.222")
for server in "${servers[@]}"; do
  echo "=== Testing $server ==="
  adb shell ping -c 5 $server | tail -1
done
```

Application latency testing:
```sh
# Test app-specific latency
adb shell am start -W -n com.example.app/.MainActivity
adb shell dumpsys activity top | grep -E "TIME|LATENCY"
```

Network path latency:
```sh
# Trace route latency
adb shell traceroute 8.8.8.8
adb shell traceroute google.com
```

Real-time latency monitoring:
```sh
while true; do
  latency=$(adb shell ping -c 1 8.8.8.8 | grep -E "time=" | grep -o "[0-9.]* ms" | head -1)
  echo "$(date): Latency = $latency"
  sleep 5
done
```

Latency under load:
```sh
#!/bin/bash
echo "=== Latency Under Load Test ==="

# Start background load
adb shell monkey -p com.example.app --throttle 50 1000 &

# Test latency during load
for i in {1..20}; do
  latency=$(adb shell ping -c 1 8.8.8.8 | grep -E "time=" | grep -o "[0-9.]*" | head -1)
  echo "Load test $i: ${latency}ms"
  sleep 2
done
```

Connection latency analysis:
```sh
# TCP connection latency
for port in 80 443 8080; do
  echo "Port $port latency:"
  time adb shell nc -zv google.com $port
done
```

WebSocket latency testing:
```sh
# WebSocket handshake latency
time adb shell curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" http://echo.websocket.org
```

Cellular latency testing:
```sh
# Test cellular network latency
adb shell ping -c 5 1.1.1.1
adb shell traceroute 1.1.1.1
```

WiFi latency optimization:
```sh
# Test WiFi latency optimization
adb shell ping -c 5 192.168.1.1
adb shell traceroute 192.168.1.1
```

Latency benchmarking:
```sh
#!/bin/bash
echo "=== Latency Benchmark ==="

targets=("8.8.8.8" "1.1.1.1" "google.com" "cloudflare.com")

for target in "${targets[@]}"; do
  echo "=== $target ==="
  adb shell ping -c 10 $target | grep -E "min|avg|max"
done
```

Latency alert system:
```sh
#!/bin/bash
threshold=100  # 100ms threshold

while true; do
  latency=$(adb shell ping -c 1 8.8.8.8 | grep -E "time=" | grep -o "[0-9.]*" | head -1)
  
  if [ ! -z "$latency" ] && [ $latency -gt $threshold ]; then
    echo "ALERT: High latency detected: ${latency}ms"
  fi
  
  sleep 30
done
```

### Examples

Basic latency test:
```sh
adb shell ping -c 4 8.8.8.8
```

HTTP latency test:
```sh
adb shell curl -w "Total time: %{time_total}s\n" -o /dev/null http://example.com
```

Real-time latency monitoring:
```sh
while true; do
  latency=$(adb shell ping -c 1 8.8.8.8 | grep -E "time=" | grep -o "[0-9.]* ms")
  echo "$(date): $latency"
  sleep 10
done
```

Multi-server comparison:
```sh
for server in 8.8.8.8 1.1.1.1 208.67.222.222; do
  echo "=== $server ==="
  adb shell ping -c 5 $server | tail -1
done
```

Complete latency analysis:
```sh
#!/bin/bash
echo "=== Complete Latency Analysis ==="

# Network latency
echo "Network latency:"
adb shell ping -c 10 8.8.8.8 | grep -E "min|avg|max"

# DNS latency
echo "DNS latency:"
time adb shell nslookup google.com

# HTTP latency
echo "HTTP latency:"
adb shell curl -w "Total: %{time_total}s\n" -o /dev/null http://google.com

echo "Latency analysis completed"
```

## Notes
- Latency varies by network conditions
- Test multiple times for accurate measurements
- Network congestion affects latency
- Different protocols have different latency characteristics
- Consider geographic distance in latency testing
- Use latency data for network optimization
- Some networks may block certain tests
- Monitor latency during peak and off-peak hours
