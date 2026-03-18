# Network Optimization - ADB Commands

## Description
Commands for network optimization, performance tuning, and network efficiency improvement.

### Basic Commands

Check network performance:
```sh
adb shell dumpsys connectivity | grep -E "performance|speed|quality"
```

Optimize network settings:
```sh
adb shell settings put global tcp_default_init_rwnd 10
```

Check network buffers:
```sh
adb shell cat /proc/sys/net/ipv4/tcp_rmem
```

Monitor network efficiency:
```sh
adb shell dumpsys netstats | grep -E "rx|tx|bytes"
```

Check network configuration:
```sh
adb shell getprop | grep -E "network|tcp|udp"
```

### Advanced Commands

Network buffer optimization:
```sh
#!/bin/bash
echo "=== Network Buffer Optimization ==="

# Optimize TCP buffers
adb shell echo "4096 87380 6291456" > /proc/sys/net/ipv4/tcp_rmem
adb shell echo "4096 65536 6291456" > /proc/sys/net/ipv4/tcp_wmem

# Optimize UDP buffers
adb shell echo "4096 65536 6291456" > /proc/sys/net/ipv4/udp_rmem_min
adb shell echo "4096 65536 6291456" > /proc/sys/net/ipv4/udp_wmem_min

# Verify changes
echo "TCP receive buffer:"
adb shell cat /proc/sys/net/ipv4/tcp_rmem
echo "TCP send buffer:"
adb shell cat /proc/sys/net/ipv4/tcp_wmem
```

TCP parameter optimization:
```sh
#!/bin/bash
echo "=== TCP Parameter Optimization ==="

# Optimize TCP congestion control
adb shell echo "bbr" > /proc/sys/net/ipv4/tcp_congestion_control

# Optimize TCP window scaling
adb shell echo "1" > /proc/sys/net/ipv4/tcp_window_scaling

# Optimize TCP timestamps
adb shell echo "1" > /proc/sys/net/ipv4/tcp_timestamps

# Optimize TCP selective acknowledgments
adb shell echo "1" > /proc/sys/net/ipv4/tcp_sack

# Optimize TCP keepalive
adb shell echo "600" > /proc/sys/net/ipv4/tcp_keepalive_time
adb shell echo "60" > /proc/sys/net/ipv4/tcp_keepalive_intvl
adb shell echo "20" > /proc/sys/net/ipv4/tcp_keepalive_probes

# Verify optimizations
echo "TCP optimizations:"
adb shell cat /proc/sys/net/ipv4/tcp_congestion_control
adb shell cat /proc/sys/net/ipv4/tcp_window_scaling
```

Network interface optimization:
```sh
#!/bin/bash
echo "=== Network Interface Optimization ==="

# Optimize interface queues
interface="wlan0"

# Set queue length
adb shell echo "1000" > /sys/class/net/$interface/tx_queue_len

# Enable GRO/GSO
adb shell echo "1" > /proc/sys/net/ipv4/conf/$interface/gro_receive
adb shell echo "1" > /proc/sys/net/ipv4/conf/$interface/gso_enabled

# Optimize interface MTU
adb shell ip link set dev $interface mtu 1500

# Verify settings
echo "Interface settings for $interface:"
adb shell cat /sys/class/net/$interface/tx_queue_len
adb shell cat /proc/sys/net/ipv4/conf/$interface/gro_receive
```

DNS optimization:
```sh
#!/bin/bash
echo "=== DNS Optimization ==="

# Set fast DNS servers
adb shell setprop net.dns1 8.8.8.8
adb shell setprop net.dns2 8.8.4.4
adb shell setprop net.dns3 1.1.1.1

# Optimize DNS cache
adb shell settings put global dns_cache_timeout 1800
adb shell settings put global dns_cache_expiry 3600

# Clear DNS cache
adb shell ndc flushdefaultif

# Verify DNS settings
echo "DNS servers:"
adb shell getprop net.dns1
adb shell getprop net.dns2
```

Network performance tuning:
```sh
#!/bin/bash
echo "=== Network Performance Tuning ==="

# Optimize network scheduler
adb shell echo "fq" > /proc/sys/net/core/default_qdisc

# Optimize network backlog
adb shell echo "3000" > /proc/sys/net/core/netdev_max_backlog
adb shell echo "1000" > /proc/sys/net/core/somaxconn

# Optimize network memory
adb shell echo "16777216" > /proc/sys/net/core/wmem_max
adb shell echo "16777216" > /proc/sys/net/core/rmem_max

# Verify settings
echo "Network scheduler:"
adb shell cat /proc/sys/net/core/default_qdisc
echo "Network backlog:"
adb shell cat /proc/sys/net/core/netdev_max_backlog
```

Mobile network optimization:
```sh
#!/bin/bash
echo "=== Mobile Network Optimization ==="

# Optimize mobile data settings
adb shell settings put global mobile_data_always_on 1
adb shell settings put global preferred_network_mode 9

# Optimize network switching
adb shell settings put global network_preference_wifi 0
adb shell settings put global network_preference_mobile 1

# Optimize roaming settings
adb shell settings put global data_roaming 1

# Verify settings
echo "Mobile data settings:"
adb shell settings get global mobile_data_always_on
adb shell settings get global preferred_network_mode
```

WiFi optimization:
```sh
#!/bin/bash
echo "=== WiFi Optimization ==="

# Optimize WiFi scan interval
adb shell settings put global wifi_scan_interval_p2p 15
adb shell settings put global wifi_scan_interval 15

# Optimize WiFi power saving
adb shell settings put global wifi_wakeup_enabled 1
adb shell settings put global wifi_suspend_optimizations_enabled 1

# Optimize WiFi band selection
adb shell settings put global wifi_band_2g_enable 1
adb shell settings put global wifi_band_5g_enable 1

# Verify settings
echo "WiFi optimization settings:"
adb shell settings get global wifi_scan_interval
adb shell settings get global wifi_wakeup_enabled
```

Network optimization monitoring:
```sh
while true; do
  echo "=== Network Optimization Status $(date) ==="
  echo "Network performance:"
  adb shell dumpsys connectivity | grep -E "performance|speed|quality" | tail -3
  echo "Network stats:"
  adb shell cat /proc/net/dev | grep -E "wlan|rmnet" | tail -2
  echo "TCP settings:"
  adb shell cat /proc/sys/net/ipv4/tcp_congestion_control
  sleep 60
done
```

Network optimization validation:
```sh
#!/bin/bash
echo "=== Network Optimization Validation ==="

# Test network speed before optimization
echo "Testing speed before optimization:"
time adb shell curl -o /dev/null http://httpbin.org/bytes/1048576

# Apply optimizations
echo "Applying optimizations..."
# (Include optimization commands from above)

# Test network speed after optimization
echo "Testing speed after optimization:"
time adb shell curl -o /dev/null http://httpbin.org/bytes/1048576

echo "Optimization validation completed"
```

Network optimization automation:
```sh
#!/bin/bash
echo "=== Network Optimization Automation ==="

# Profile-based optimization
case "$1" in
  "speed")
    echo "Optimizing for speed..."
    # Aggressive settings
    adb shell echo "fq_codel" > /proc/sys/net/core/default_qdisc
    adb shell echo "5000" > /proc/sys/net/core/netdev_max_backlog
    ;;
  "stability")
    echo "Optimizing for stability..."
    # Conservative settings
    adb shell echo "pfifo" > /proc/sys/net/core/default_qdisc
    adb shell echo "1000" > /proc/sys/net/core/netdev_max_backlog
    ;;
  "battery")
    echo "Optimizing for battery..."
    # Power-saving settings
    adb shell settings put global wifi_scan_interval 30
    adb shell settings put global wifi_wakeup_enabled 0
    ;;
  *)
    echo "Usage: $0 [speed|stability|battery]"
    exit 1
    ;;
esac

echo "Network optimization $1 completed"
```

### Examples

Basic network optimization:
```sh
adb shell settings put global tcp_default_init_rwnd 10
adb shell setprop net.dns1 8.8.8.8
adb shell setprop net.dns2 8.8.4.4
```

TCP optimization:
```sh
adb shell echo "bbr" > /proc/sys/net/ipv4/tcp_congestion_control
adb shell echo "1" > /proc/sys/net/ipv4/tcp_window_scaling
```

Complete network optimization:
```sh
#!/bin/bash
echo "=== Complete Network Optimization ==="

# DNS optimization
adb shell setprop net.dns1 8.8.8.8
adb shell setprop net.dns2 8.8.4.4

# TCP optimization
adb shell echo "bbr" > /proc/sys/net/ipv4/tcp_congestion_control
adb shell echo "1" > /proc/sys/net/ipv4/tcp_window_scaling

# Interface optimization
adb shell echo "fq" > /proc/sys/net/core/default_qdisc
adb shell echo "3000" > /proc/sys/net/core/netdev_max_backlog

echo "Network optimization completed"
```

## Notes
- Network optimization requires root access for some commands
- Optimization settings may be reset on device reboot
- Test optimizations before applying in production
- Monitor network performance after optimization
- Some optimizations may not work on all Android versions
- Consider impact on battery life
- Use appropriate optimizations for specific use cases
- Document optimization changes for future reference
