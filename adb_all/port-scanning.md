# Port Scanning - ADB Commands

## Description
Commands for port scanning Android devices, checking open ports, and network port security analysis.

### Basic Commands

Check open ports:
```sh
adb shell netstat -an
```

Scan listening ports:
```sh
adb shell netstat -ln
```

Check TCP ports:
```sh
adb shell netstat -atn
```

Check UDP ports:
```sh
adb shell netstat -aun
```

Monitor port connections:
```sh
adb shell netstat -anp
```

### Advanced Commands

Port range scanning:
```sh
#!/bin/bash
echo "=== Port Range Scanner ==="

# Scan common ports
ports=(20 21 22 23 25 53 80 110 143 443 993 995 8080 8443)

for port in "${ports[@]}"; do
  echo "Scanning port $port:"
  timeout 3 adb shell nc -zv localhost $port 2>&1 | grep -E "succeeded|failed"
done
```

Comprehensive port scan:
```sh
#!/bin/bash
echo "=== Comprehensive Port Scan ==="

# Scan all ports 1-1024
for port in {1..1024}; do
  if timeout 1 adb shell nc -z localhost $port 2>/dev/null; then
    echo "Port $port is OPEN"
  fi
done
```

Remote port scanning:
```sh
# Scan remote host
target="192.168.1.1"
ports=(22 80 443 8080)

for port in "${ports[@]}"; do
  echo "Scanning $target:$port"
  timeout 3 adb shell nc -zv $target $port 2>&1 | grep -E "succeeded|failed"
done
```

Port service identification:
```sh
# Identify services on ports
adb shell netstat -ln | grep LISTEN | while read line; do
  port=$(echo $line | awk '{print $4}' | cut -d: -f2)
  service=$(echo $line | awk '{print $7}')
  echo "Port $port: $service"
done
```

Port monitoring:
```sh
while true; do
  echo "=== Port Status $(date) ==="
  adb shell netstat -ln | grep LISTEN
  sleep 30
done
```

Application port mapping:
```sh
# Map ports to applications
adb shell netstat -anp | grep LISTEN | while read line; do
  port=$(echo $line | awk '{print $4}' | cut -d: -f2)
  pid=$(echo $line | awk '{print $9}' | cut -d/ -f1)
  if [ ! -z "$pid" ]; then
    app=$(adb shell ps -A | grep $pid | awk '{print $9}')
    echo "Port $port: PID $pid ($app)"
  fi
done
```

Port security analysis:
```sh
# Check for suspicious open ports
suspicious_ports=(1337 31337 12345 54321)

for port in "${suspicious_ports[@]}"; do
  if timeout 1 adb shell nc -z localhost $port 2>/dev/null; then
    echo "WARNING: Suspicious port $port is open"
  fi
done
```

Port vulnerability scanning:
```sh
# Check for vulnerable services
vulnerable_services=("telnet" "ftp" "rsh")

for service in "${vulnerable_services[@]}"; do
  port=$(adb shell grep -E "$service" /etc/services 2>/dev/null | head -1 | awk '{print $2}')
  if [ ! -z "$port" ]; then
    if timeout 1 adb shell nc -z localhost $port 2>/dev/null; then
      echo "WARNING: Vulnerable service $service running on port $port"
    fi
  fi
done
```

Port performance testing:
```sh
# Test port response times
ports=(80 443 8080)

for port in "${ports[@]}"; do
  echo "Testing port $port response time:"
  time adb shell nc -z localhost $port
done
```

Port connection tracking:
```sh
# Track port connections over time
for i in {1..10}; do
  echo "=== Check $i at $(date) ==="
  adb shell netstat -an | grep ESTABLISHED | wc -l
  sleep 30
done
```

Port firewall interaction:
```sh
# Check if ports are blocked by firewall
ports=(8080 9999 3128)

for port in "${ports[@]}"; do
  echo "Testing port $port firewall status:"
  adb shell iptables -L OUTPUT | grep $port
done
```

Port scanning automation:
```sh
#!/bin/bash
echo "=== Automated Port Scanner ==="

scan_host=$1
start_port=$2
end_port=$3

if [ -z "$scan_host" ]; then
  scan_host="localhost"
fi

if [ -z "$start_port" ]; then
  start_port=1
fi

if [ -z "$end_port" ]; then
  end_port=1024
fi

echo "Scanning $scan_host ports $start_port-$end_port..."

for port in $(seq $start_port $end_port); do
  if timeout 1 adb shell nc -z $scan_host $port 2>/dev/null; then
    echo "Port $port: OPEN"
  fi
done

echo "Port scan completed"
```

### Examples

Basic port scan:
```sh
adb shell netstat -ln | grep LISTEN
```

Port range scan:
```sh
for port in 80 443 8080 8443; do
  echo "Scanning port $port:"
  timeout 3 adb shell nc -zv localhost $port
done
```

Service identification:
```sh
adb shell netstat -lnp | grep LISTEN
```

Complete port analysis:
```sh
#!/bin/bash
echo "=== Complete Port Analysis ==="

# Listening ports
echo "Listening ports:"
adb shell netstat -ln | grep LISTEN

# Port to app mapping
echo "Port to application mapping:"
adb shell netstat -anp | grep LISTEN

# Suspicious ports check
echo "Suspicious ports check:"
for port in 1337 31337 12345; do
  if timeout 1 adb shell nc -z localhost $port 2>/dev/null; then
    echo "Port $port is open"
  fi
done

echo "Port analysis completed"
```

## Notes
- Port scanning may require root for complete visibility
- Some ports may be protected by system security
- Port scanning can be detected by security systems
- Use port scanning for security analysis
- Monitor ports for unauthorized access
- Consider network policies when scanning
- Some ports may be dynamically assigned
- Use timeout for unresponsive ports
