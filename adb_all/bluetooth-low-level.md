# Bluetooth Low-Level - ADB Commands

## Description
Commands for low-level Bluetooth control, Bluetooth debugging, and advanced Bluetooth management.

### Basic Commands

Check Bluetooth status:
```sh
adb shell dumpsys bluetooth_manager
```

Check Bluetooth adapters:
```sh
adb shell hciconfig -a
```

Check Bluetooth devices:
```sh
adb shell dumpsys bluetooth_manager | grep -E "device|bonded"
```

Monitor Bluetooth logs:
```sh
adb shell logcat | grep -E "bluetooth|BT"
```

Check Bluetooth services:
```sh
adb shell dumpsys bluetooth_manager | grep -E "service|profile"
```

### Advanced Commands

Bluetooth hardware analysis:
```sh
#!/bin/bash
echo "=== Bluetooth Hardware Analysis ==="

# Check Bluetooth adapters
echo "Bluetooth adapters:"
adb shell hciconfig -a

# Check Bluetooth chipset
echo "Bluetooth chipset info:"
adb shell cat /sys/class/bluetooth/hci0/device/uevent

# Check Bluetooth firmware
echo "Bluetooth firmware:"
adb shell find /system -name "*bluetooth*" -o -name "*bt*" | head -10

# Check Bluetooth power
echo "Bluetooth power state:"
adb shell cat /sys/class/bluetooth/hci0/power/control
```

Bluetooth protocol debugging:
```sh
#!/bin/bash
echo "=== Bluetooth Protocol Debugging ==="

# Enable Bluetooth debugging
echo "Enabling Bluetooth debugging..."
adb shell setprop log.tag.Bluetooth VERBOSE
adb shell setprop log.tag.BluetoothAdapterService VERBOSE

# Monitor Bluetooth protocols
echo "Monitoring Bluetooth protocols..."
adb shell logcat | grep -E "L2CAP|RFCOMM|SDP|HCI" | tail -20

# Check protocol statistics
echo "Protocol statistics:"
adb shell cat /proc/bluetooth/l2cap
adb shell cat /proc/bluetooth/rfcomm
```

Bluetooth low energy (BLE) control:
```sh
#!/bin/bash
echo "=== Bluetooth Low Energy Control ==="

# Check BLE adapter
echo "BLE adapter status:"
adb shell dumpsys bluetooth_manager | grep -E "BLE|low.*energy"

# Start BLE scanning
echo "Starting BLE scan..."
adb shell service call bluetooth_manager 7

# Monitor BLE devices
echo "Monitoring BLE devices..."
for i in {1..30}; do
  echo "BLE scan $i:"
  adb shell dumpsys bluetooth_manager | grep -E "BLE|scan|adv" | tail -5
  sleep 2
done

# Stop BLE scan
echo "Stopping BLE scan..."
adb shell service call bluetooth_manager 8
```

Bluetooth profile management:
```sh
#!/bin/bash
echo "=== Bluetooth Profile Management ==="

# Check available profiles
echo "Available Bluetooth profiles:"
adb shell dumpsys bluetooth_manager | grep -E "profile|service" | head -10

# Enable A2DP profile
echo "Enabling A2DP profile..."
adb shell service call bluetooth_manager 12 i32 0

# Enable HFP profile
echo "Enabling HFP profile..."
adb shell service call bluetooth_manager 13 i32 0

# Check profile status
echo "Profile status:"
adb shell dumpsys bluetooth_manager | grep -E "profile|connected"
```

Bluetooth security debugging:
```sh
#!/bin/bash
echo "=== Bluetooth Security Debugging ==="

# Check security settings
echo "Bluetooth security settings:"
adb shell dumpsys bluetooth_manager | grep -E "security|encryption|auth"

# Monitor pairing events
echo "Monitoring pairing events..."
adb shell logcat | grep -E "pair|bond|auth|encrypt" | tail -15

# Check trusted devices
echo "Trusted devices:"
adb shell dumpsys bluetooth_manager | grep -E "trusted|bonded"
```

Bluetooth HCI commands:
```sh
#!/bin/bash
echo "=== Bluetooth HCI Commands ==="

# Check HCI version
echo "HCI version:"
adb shell hcitool -i hci0 cmd 0x04 0x01 0x00

# Read local name
echo "Local device name:"
adb shell hcitool -i hci0 cmd 0x03 0x14 0x00

# Read class of device
echo "Class of device:"
adb shell hcitool -i hci0 cmd 0x03 0x20 0x00

# Scan for devices
echo "Scanning for devices..."
adb shell hcitool -i hci0 scan
```

Bluetooth audio debugging:
```sh
#!/bin/bash
echo "=== Bluetooth Audio Debugging ==="

# Check audio profiles
echo "Bluetooth audio profiles:"
adb shell dumpsys bluetooth_manager | grep -E "A2DP|HFP|AVRCP"

# Monitor audio streaming
echo "Monitoring audio streaming..."
adb shell logcat | grep -E "a2dp|hfp|audio" | tail -15

# Check audio codec
echo "Audio codec information:"
adb shell dumpsys bluetooth_manager | grep -E "codec|sbc|aac|aptx"
```

Bluetooth power management:
```sh
#!/bin/bash
echo "=== Bluetooth Power Management ==="

# Check power consumption
echo "Bluetooth power consumption:"
adb shell cat /sys/class/power_supply/battery/current_now

# Enable power saving
echo "Enabling Bluetooth power saving..."
adb shell service call bluetooth_manager 20 i32 1

# Monitor power usage
echo "Monitoring power usage..."
for i in {1..10}; do
  echo "Power check $i:"
  adb shell cat /sys/class/power_supply/battery/current_now
  sleep 5
done

# Disable power saving
echo "Disabling Bluetooth power saving..."
adb shell service call bluetooth_manager 20 i32 0
```

Bluetooth network debugging:
```sh
#!/bin/bash
echo "=== Bluetooth Network Debugging ==="

# Check network interface
echo "Bluetooth network interface:"
adb shell ifconfig bnep0

# Check network connections
echo "Bluetooth network connections:"
adb shell netstat -anp | grep bnep

# Monitor network traffic
echo "Monitoring network traffic..."
adb shell tcpdump -i bnep0 -c 10
```

Real-time Bluetooth monitoring:
```sh
#!/bin/bash
echo "=== Real-time Bluetooth Monitoring ==="

# Monitor Bluetooth system in real-time
while true; do
  echo "=== Bluetooth Monitor $(date) ==="
  
  # Adapter status
  echo "Adapter status:"
  adb shell hciconfig -a | grep -E "UP|DOWN|PSCAN"
  
  # Connected devices
  echo "Connected devices:"
  adb shell dumpsys bluetooth_manager | grep -E "connected|bonded" | tail -3
  
  # Recent events
  echo "Recent events:"
  adb shell logcat -d | grep -E "bluetooth|BT" | tail -3
  
  sleep 30
done
```

### Examples

Basic Bluetooth analysis:
```sh
adb shell dumpsys bluetooth_manager
adb shell hciconfig -a
adb shell logcat | grep -E "bluetooth|BT" | tail -10
```

BLE scanning:
```sh
adb shell service call bluetooth_manager 7  # Start scan
sleep 10
adb shell dumpsys bluetooth_manager | grep -E "BLE|scan"
adb shell service call bluetooth_manager 8  # Stop scan
```

HCI commands:
```sh
adb shell hcitool -i hci0 scan
adb shell hcitool -i hci0 cmd 0x03 0x14 0x00  # Read local name
```

Complete Bluetooth analysis:
```sh
#!/bin/bash
echo "=== Complete Bluetooth Analysis ==="

# Adapter info
echo "Bluetooth adapter:"
adb shell hciconfig -a

# Service status
echo "Bluetooth service:"
adb shell dumpsys bluetooth_manager | head -15

# Connected devices
echo "Connected devices:"
adb shell dumpsys bluetooth_manager | grep -E "connected|bonded"

echo "Bluetooth analysis completed"
```

## Notes
- Low-level Bluetooth commands require root access
- Bluetooth debugging can affect connectivity
- Some Bluetooth features depend on hardware support
- Use Bluetooth commands carefully in production
- Monitor Bluetooth system during debugging
- Some Bluetooth parameters may be reset on reboot
- Document Bluetooth configuration changes
- Consider user experience when modifying Bluetooth settings
