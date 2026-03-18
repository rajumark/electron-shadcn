# Mesh Networking - ADB Commands

## Description
Commands for managing mesh networks, peer-to-peer connections, and mesh network topology testing.

### Basic Commands

Check mesh network support:
```sh
adb shell pm list features | grep -E "mesh|wifi.*aware|nan"
```

List mesh networks:
```sh
adb shell dumpsys connectivity | grep -E "mesh|aware|nan"
```

Check WiFi Aware status:
```sh
adb shell dumpsys wifi_aware
```

Monitor mesh connections:
```sh
adb shell logcat | grep -E "mesh|aware|nan"
```

Check peer discovery:
```sh
adb shell dumpsys wifi_aware | grep -E "peer|discovery"
```

### Advanced Commands

Mesh network setup:
```sh
#!/bin/bash
echo "=== Mesh Network Setup ==="

# Enable WiFi Aware
adb shell svc wifi disable
adb shell svc wifi enable
sleep 2

# Start WiFi Aware service
adb shell am startservice -n com.android.server.wifiaware/.WifiAwareService
sleep 3

# Check service status
adb shell dumpsys wifi_aware | head -10
```

Peer discovery testing:
```sh
# Start peer discovery
adb shell am broadcast -a com.example.START_PEER_DISCOVERY

# Monitor discovered peers
while true; do
  echo "=== Discovered Peers $(date) ==="
  adb shell dumpsys wifi_aware | grep -E "peer|discovery|nan"
  sleep 5
done
```

Mesh network performance:
```sh
#!/bin/bash
echo "=== Mesh Network Performance Test ==="

# Test peer-to-peer latency
for i in {1..10}; do
  echo "Test $i:"
  time adb shell am broadcast -a com.example.PEER_PING -e peer_id "peer_$i"
  sleep 1
done

# Test data transfer
adb shell am broadcast -a com.example.TRANSFER_DATA -e peer_id "peer_1" -e data "test_data_$i"
```

Mesh topology analysis:
```sh
# Analyze mesh topology
echo "=== Mesh Topology Analysis ==="

# Get network graph
adb shell dumpsys wifi_aware | grep -E "peer|node|link"

# Calculate network metrics
adb shell dumpsys wifi_aware | grep -E "strength|quality|signal"

# Monitor topology changes
while true; do
  echo "=== Topology $(date) ==="
  adb shell dumpsys wifi_aware | grep -E "peer|discovery" | wc -l
  sleep 30
done
```

Mesh network security:
```sh
# Test mesh security
echo "=== Mesh Network Security Test ==="

# Check encryption
adb shell dumpsys wifi_aware | grep -E "encrypt|security|auth"

# Test secure peer connection
adb shell am broadcast -a com.example.SECURE_CONNECT -e peer_id "secure_peer" -e encryption "WPA3"

# Monitor security events
adb shell logcat | grep -E "security|auth|encrypt"
```

Mesh network debugging:
```sh
# Enable mesh debugging
adb shell setprop log.tag.WifiAware VERBOSE
adb shell logcat | grep WifiAware

# Monitor mesh events
adb shell logcat | grep -E "mesh|aware|nan|peer"
```

Multi-device mesh testing:
```sh
#!/bin/bash
echo "=== Multi-Device Mesh Test ==="

devices=($(adb devices | grep -v "List" | awk '{print $1}'))

for device in "${devices[@]}"; do
  echo "Setting up mesh on $device:"
  adb -s $device shell am broadcast -a com.example.START_MESH
  sleep 2
done

# Monitor mesh formation
for i in {1..30}; do
  echo "=== Mesh Check $i ==="
  for device in "${devices[@]}"; do
    echo "$device:"
    adb -s $device shell dumpsys wifi_aware | grep -E "peer|discovery" | wc -l
  done
  sleep 5
done
```

Mesh network resilience:
```sh
#!/bin/bash
echo "=== Mesh Network Resilience Test ==="

# Establish mesh network
adb shell am broadcast -a com.example.START_MESH
sleep 10

# Remove nodes and test resilience
for i in {1..5}; do
  echo "Removing peer_$i:"
  adb shell am broadcast -a com.example.REMOVE_PEER -e peer_id "peer_$i"
  sleep 3
  
  # Test network still works
  adb shell am broadcast -a com.example.TEST_MESH
  adb shell logcat | grep -E "mesh|test" | tail -3
done
```

Mesh network optimization:
```sh
# Optimize mesh parameters
adb shell am broadcast -a com.example.OPTIMIZE_MESH -e parameter "routing" -e value "optimal"
adb shell am broadcast -a com.example.OPTIMIZE_MESH -e parameter "power" -e value "low"

# Monitor optimization results
adb shell dumpsys wifi_aware | grep -E "optimize|performance|efficiency"
```

Mesh network data flow:
```sh
# Test data flow through mesh
echo "=== Mesh Data Flow Test ==="

# Send data through multiple hops
adb shell am broadcast -a com.example.ROUTE_DATA -e source "peer_1" -e destination "peer_5" -e data "test_data"

# Monitor routing
adb shell logcat | grep -E "route|hop|path"
```

Mesh network scaling:
```sh
#!/bin/bash
echo "=== Mesh Network Scaling Test ==="

# Add nodes gradually
for i in {1..20}; do
  echo "Adding peer_$i:"
  adb shell am broadcast -a com.example.ADD_PEER -e peer_id "peer_$i"
  sleep 2
  
  # Test network performance
  adb shell am broadcast -a com.example.TEST_PERFORMANCE
  adb shell logcat | grep -E "performance|latency|throughput" | tail -1
done
```

Mesh network interference:
```sh
# Test interference handling
echo "=== Mesh Network Interference Test ==="

# Simulate interference
adb shell am broadcast -a com.example.SIMULATE_INTERFERENCE -e type "wifi" -e strength "high"

# Monitor network adaptation
adb shell dumpsys wifi_aware | grep -E "interference|adapt|adjust"

# Test recovery
adb shell am broadcast -a com.example.RECOVER_FROM_INTERFERENCE
```

### Examples

Basic mesh setup:
```sh
adb shell svc wifi enable
adb shell am broadcast -a com.example.START_MESH
sleep 5
adb shell dumpsys wifi_aware | grep -E "peer|discovery"
```

Peer discovery:
```sh
adb shell am broadcast -a com.example.START_PEER_DISCOVERY
while true; do
  echo "Discovered peers:"
  adb shell dumpsys wifi_aware | grep -E "peer|discovery" | wc -l
  sleep 10
done
```

Mesh network performance:
```sh
for i in {1..5}; do
  echo "Performance test $i:"
  time adb shell am broadcast -a com.example.PEER_PING -e peer_id "peer_$i"
done
```

Complete mesh test:
```sh
#!/bin/bash
echo "=== Complete Mesh Network Test ==="

# Check mesh support
echo "Checking mesh support:"
adb shell pm list features | grep -E "mesh|aware|nan"

# Start mesh network
echo "Starting mesh network:"
adb shell am broadcast -a com.example.START_MESH
sleep 5

# Discover peers
echo "Discovering peers:"
adb shell dumpsys wifi_aware | grep -E "peer|discovery"

# Test connectivity
echo "Testing connectivity:"
adb shell am broadcast -a com.example.TEST_MESH

# Monitor performance
echo "Monitoring performance:"
adb shell dumpsys wifi_aware | grep -E "performance|quality"

echo "Mesh network test completed"
```

## Notes
- Mesh networking requires WiFi Aware support
- Not all Android devices support mesh networking
- Mesh networks are ad-hoc and decentralized
- Mesh performance varies by device and environment
- Test mesh networks in controlled environments
- Monitor mesh logs for troubleshooting
- Mesh networks can be affected by interference
- Consider security implications for mesh communications
