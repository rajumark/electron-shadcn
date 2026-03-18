# Network ADB - ADB Commands

## Description
Network-based ADB operations for remote device management, WiFi debugging, and network configuration commands.

### Basic Commands

Connect to network device:
```sh
adb connect <ip_address>:5555
```

Disconnect network device:
```sh
adb disconnect <ip_address>:5555
```

List network connections:
```sh
adb devices
```

### Advanced Commands

Enable network debugging:
```sh
adb shell svc adb tcpip 5555
```

Set custom network port:
```sh
adb shell svc adb tcpip <port>
```

Check network interface status:
```sh
adb shell ip addr show
```

Get WiFi interface information:
```sh
adb shell ip addr show wlan0
```

Check network connectivity:
```sh
adb shell ping -c 4 8.8.8.8
```

Get network statistics:
```sh
adb shell cat /proc/net/dev
```

Check active network connections:
```sh
adb shell netstat -an
```

Get routing table:
```sh
adb shell ip route show
```

Check DNS settings:
```sh
adb shell getprop | grep dns
```

Set DNS servers:
```sh
adb shell setprop net.dns1 8.8.8.8
adb shell setprop net.dns2 8.8.4.4
```

Get network interface MAC address:
```sh
adb shell cat /sys/class/net/wlan0/address
```

Check WiFi signal strength:
```sh
adb shell dumpsys wifi | grep signal
```

Reset network settings:
```sh
adb shell svc wifi disable && adb shell svc wifi enable
```

### Examples

Network device discovery script:
```sh
#!/bin/bash
# Scan network for ADB devices
network="192.168.1"
for i in {1..254}; do
    (echo >/dev/tcp/$network.$i/5555) >/dev/null 2>&1 && echo "Device found: $network.$i:5555"
done
```

Complete network setup:
```sh
# Step 1: Connect via USB
adb devices

# Step 2: Enable TCP/IP mode
adb shell svc adb tcpip 5555

# Step 3: Get device IP
DEVICE_IP=$(adb shell ip addr show wlan0 | grep 'inet ' | awk '{print $2}' | cut -d'/' -f1)

# Step 4: Connect wirelessly
adb connect $DEVICE_IP:5555

# Step 5: Verify connection
adb devices
```

Network diagnostics:
```sh
echo "=== Network Diagnostics ==="
echo "Device IP: $(adb shell ip addr show wlan0 | grep 'inet ' | awk '{print $2}' | cut -d'/' -f1)"
echo "WiFi Status: $(adb shell dumpsys wifi | grep 'Wi-Fi is' | awk '{print $3}')"
echo "Network Interfaces:"
adb shell ip addr show
```

## Notes
- Device and computer must be on same network
- Some Android versions restrict network ADB without initial USB connection
- Default port is 5555 but can be customized
- Network ADB may be slower than USB connection
- Firewalls can block network ADB connections
- Android 11+ supports wireless debugging without USB using pairing codes
