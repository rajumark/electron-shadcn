# VPN Advanced - ADB Commands

## Description
Commands for advanced VPN management, VPN configuration testing, and VPN performance optimization.

### Basic Commands

Check VPN status:
```sh
adb shell settings get secure vpn_enabled
```

Check VPN type:
```sh
adb shell settings get secure vpn_type
```

List VPN apps:
```sh
adb shell pm list packages | grep -i vpn
```

Check VPN connection:
```sh
adb shell dumpsys connectivity | grep -E "vpn|VPN"
```

Monitor VPN traffic:
```sh
adb shell dumpsys netstats | grep vpn
```

### Advanced Commands

VPN configuration testing:
```sh
#!/bin/bash
echo "=== Advanced VPN Configuration Test ==="

# Test different VPN types
vpn_types=("PPTP" "L2TP" "IPSec" "IKEv2" "OpenVPN")

for vpn_type in "${vpn_types[@]}"; do
  echo "Testing $vpn_type VPN..."
  adb shell settings put secure vpn_type $vpn_type
  adb shell am start -a android.intent.action.VPN_CONNECT
  sleep 5
  adb shell dumpsys connectivity | grep -E "vpn|VPN"
  adb shell am start -a android.intent.action.VPN_DISCONNECT
done
```

VPN performance testing:
```sh
#!/bin/bash
echo "=== VPN Performance Test ==="

# Test without VPN
echo "Without VPN:"
time adb shell ping -c 10 8.8.8.8
time adb shell curl -o /dev/null http://httpbin.org/bytes/1048576

# Connect VPN
adb shell am start -a android.intent.action.VPN_CONNECT
sleep 10

# Test with VPN
echo "With VPN:"
time adb shell ping -c 10 8.8.8.8
time adb shell curl -o /dev/null http://httpbin.org/bytes/1048576

# Disconnect VPN
adb shell am start -a android.intent.action.VPN_DISCONNECT
```

VPN security testing:
```sh
# Test VPN encryption
adb shell dumpsys connectivity | grep -E "encryption|cipher|tls"

# Test VPN DNS
adb shell nslookup google.com
adb shell am start -a android.intent.action.VPN_CONNECT
sleep 5
adb shell nslookup google.com
adb shell am start -a android.intent.action.VPN_DISCONNECT
```

VPN failover testing:
```sh
#!/bin/bash
echo "=== VPN Failover Test ==="

# Test multiple VPN servers
vpn_servers=("vpn1.example.com" "vpn2.example.com" "vpn3.example.com")

for server in "${vpn_servers[@]}"; do
  echo "Testing VPN server $server:"
  adb shell settings put secure vpn_server $server
  adb shell am start -a android.intent.action.VPN_CONNECT
  sleep 10
  
  if adb shell ping -c 3 8.8.8.8; then
    echo "VPN server $server is working"
    break
  else
    echo "VPN server $server failed"
    adb shell am start -a android.intent.action.VPN_DISCONNECT
  fi
done
```

VPN protocol testing:
```sh
# Test different VPN protocols
protocols=("udp" "tcp" "ssl")

for protocol in "${protocols[@]}"; do
  echo "Testing $protocol protocol:"
  adb shell settings put secure vpn_protocol $protocol
  adb shell am start -a android.intent.action.VPN_CONNECT
  sleep 5
  adb shell ping -c 3 8.8.8.8
  adb shell am start -a android.intent.action.VPN_DISCONNECT
done
```

VPN monitoring:
```sh
while true; do
  echo "=== VPN Status $(date) ==="
  adb shell settings get secure vpn_enabled
  adb shell dumpsys connectivity | grep -E "vpn|VPN"
  adb shell dumpsys netstats | grep vpn | tail -3
  sleep 30
done
```

VPN split tunneling:
```sh
# Test split tunneling
adb shell settings put secure vpn_split_tunneling 1
adb shell settings put secure vpn_split_tunneling_apps "com.example.app1,com.example.app2"

# Monitor split tunneling
adb shell dumpsys connectivity | grep -E "split|tunnel"
```

VPN kill switch testing:
```sh
# Test kill switch
adb shell settings put secure vpn_kill_switch 1

# Test internet access when VPN disconnects
adb shell am start -a android.intent.action.VPN_CONNECT
sleep 5
adb shell ping -c 3 8.8.8.8
adb shell am start -a android.intent.action.VPN_DISCONNECT
sleep 2
adb shell ping -c 3 8.8.8.8
```

VPN DNS leak testing:
```sh
#!/bin/bash
echo "=== VPN DNS Leak Test ==="

# Get DNS servers before VPN
echo "DNS servers before VPN:"
adb shell getprop net.dns1
adb shell getprop net.dns2

# Connect VPN
adb shell am start -a android.intent.action.VPN_CONNECT
sleep 5

# Get DNS servers after VPN
echo "DNS servers after VPN:"
adb shell getprop net.dns1
adb shell getprop net.dns2

# Test DNS resolution
adb shell nslookup google.com

# Disconnect VPN
adb shell am start -a android.intent.action.VPN_DISCONNECT
```

VPN app integration:
```sh
# Test VPN app integration
vpn_apps=("com.openvpn.connect" "org.strongvpn" "com.expressvpn")

for app in "${vpn_apps[@]}"; do
  if adb shell pm list packages | grep -q $app; then
    echo "Testing VPN app $app:"
    adb shell am start -n $app/.MainActivity
    sleep 5
    adb shell dumpsys connectivity | grep -E "vpn|VPN"
    adb shell am force-stop $app
  fi
done
```

VPN debugging:
```sh
# Enable VPN debugging
adb shell setprop log.tag.VpnService VERBOSE
adb shell logcat | grep VpnService

# Monitor VPN events
adb shell logcat | grep -E "vpn|VPN|connectivity"
```

VPN stress testing:
```sh
#!/bin/bash
echo "=== VPN Stress Test ==="

# Connect/disconnect cycle
for i in {1..10}; do
  echo "Cycle $i:"
  adb shell am start -a android.intent.action.VPN_CONNECT
  sleep 3
  adb shell ping -c 2 8.8.8.8
  adb shell am start -a android.intent.action.VPN_DISCONNECT
  sleep 2
done
```

### Examples

Basic VPN test:
```sh
adb shell am start -a android.intent.action.VPN_CONNECT
sleep 5
adb shell ping -c 3 8.8.8.8
adb shell am start -a android.intent.action.VPN_DISCONNECT
```

VPN performance test:
```sh
echo "Without VPN:"
time adb shell ping -c 5 8.8.8.8

adb shell am start -a android.intent.action.VPN_CONNECT
sleep 5

echo "With VPN:"
time adb shell ping -c 5 8.8.8.8

adb shell am start -a android.intent.action.VPN_DISCONNECT
```

VPN DNS leak test:
```sh
echo "DNS before VPN:"
adb shell getprop net.dns1

adb shell am start -a android.intent.action.VPN_CONNECT
sleep 5

echo "DNS after VPN:"
adb shell getprop net.dns1

adb shell am start -a android.intent.action.VPN_DISCONNECT
```

Complete VPN test:
```sh
#!/bin/bash
echo "=== Complete VPN Test ==="

# Check VPN availability
echo "Checking VPN apps:"
adb shell pm list packages | grep -i vpn

# Test VPN connection
echo "Testing VPN connection:"
adb shell am start -a android.intent.action.VPN_CONNECT
sleep 10

# Test connectivity
echo "Testing connectivity through VPN:"
adb shell ping -c 5 8.8.8.8
adb shell curl -o /dev/null http://httpbin.org/ip

# Check VPN status
echo "VPN status:"
adb shell dumpsys connectivity | grep -E "vpn|VPN"

# Disconnect VPN
adb shell am start -a android.intent.action.VPN_DISCONNECT

echo "VPN test completed"
```

## Notes
- VPN testing requires VPN app availability
- Some VPN features may require specific Android versions
- VPN can significantly impact network performance
- Test VPN connectivity before deployment
- Monitor VPN logs for troubleshooting
- VPN settings may be controlled by device admin
- Consider battery impact of VPN usage
- Test VPN across different network conditions
