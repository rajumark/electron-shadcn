# Firewall Management - ADB Commands

## Description
Commands for managing Android firewall rules, network security policies, and firewall configuration.

### Basic Commands

Check firewall status:
```sh
adb shell iptables -L
```

List firewall rules:
```sh
adb shell iptables -S
```

Check firewall chains:
```sh
adb shell iptables -L -n
```

Monitor firewall logs:
```sh
adb shell logcat | grep -E "firewall|iptables|netfilter"
```

Check network security:
```sh
adb shell dumpsys connectivity | grep -E "firewall|security"
```

### Advanced Commands

Firewall rule management:
```sh
#!/bin/bash
echo "=== Firewall Management ==="

# List current rules
echo "Current firewall rules:"
adb shell iptables -L -n

# Add new rule
echo "Adding rule to block port 8080:"
adb shell iptables -A OUTPUT -p tcp --dport 8080 -j DROP

# Verify rule
echo "Verifying new rule:"
adb shell iptables -L OUTPUT | grep 8080
```

Application firewall:
```sh
# Block app network access
adb shell iptables -A OUTPUT -m owner --uid-pid $(adb shell pidof com.example.app) -j DROP

# Allow app network access
adb shell iptables -D OUTPUT -m owner --uid-pid $(adb shell pidof com.example.app) -j DROP
```

Port-based firewall:
```sh
# Block specific ports
for port in 8080 9999 3128; do
  echo "Blocking port $port:"
  adb shell iptables -A OUTPUT -p tcp --dport $port -j DROP
done

# Allow specific ports
for port in 80 443 53; do
  echo "Allowing port $port:"
  adb shell iptables -A OUTPUT -p tcp --dport $port -j ACCEPT
done
```

IP-based firewall:
```sh
# Block specific IP
adb shell iptables -A OUTPUT -d 192.168.1.100 -j DROP

# Allow specific IP
adb shell iptables -A OUTPUT -d 8.8.8.8 -j ACCEPT
```

Protocol-based firewall:
```sh
# Block UDP traffic
adb shell iptables -A OUTPUT -p udp -j DROP

# Allow TCP traffic
adb shell iptables -A OUTPUT -p tcp -j ACCEPT
```

Firewall logging:
```sh
# Enable logging
adb shell iptables -A OUTPUT -j LOG --log-prefix "FIREWALL: "

# Check logs
adb shell logcat | grep FIREWALL
```

Firewall backup and restore:
```sh
# Backup firewall rules
adb shell iptables-save > firewall_backup.txt

# Restore firewall rules
adb shell iptables-restore < firewall_backup.txt
```

Network security policies:
```sh
# Check security policies
adb shell dumpsys connectivity | grep -E "policy|security|firewall"

# Set network security policy
adb shell settings put global network_security_policy_enabled 1
```

Firewall for testing:
```sh
#!/bin/bash
echo "=== Test Firewall Rules ==="

# Block all outbound traffic
adb shell iptables -A OUTPUT -j DROP

# Test connectivity
adb shell ping -c 1 8.8.8.8

# Allow DNS only
adb shell iptables -D OUTPUT -j DROP
adb shell iptables -A OUTPUT -p udp --dport 53 -j ACCEPT
adb shell iptables -A OUTPUT -j DROP

# Test DNS
adb shell nslookup google.com

# Clean up
adb shell iptables -F OUTPUT
```

Firewall monitoring:
```sh
while true; do
  echo "=== Firewall Status $(date) ==="
  adb shell iptables -L OUTPUT | wc -l
  adb shell logcat -d | grep FIREWALL | tail -5
  sleep 30
done
```

Application-specific firewall:
```sh
# Block specific apps
apps=("com.example.game" "com.example.social")

for app in "${apps[@]}"; do
  echo "Blocking $app:"
  adb shell iptables -A OUTPUT -m owner --uid-name $app -j DROP
done
```

Firewall performance impact:
```sh
# Test performance with firewall
time adb shell ping -c 10 8.8.8.8

# Add many rules
for i in {1..100}; do
  adb shell iptables -A OUTPUT -p tcp --dport $i -j DROP
done

# Test performance again
time adb shell ping -c 10 8.8.8.8
```

### Examples

Basic firewall check:
```sh
adb shell iptables -L -n
```

Block specific port:
```sh
adb shell iptables -A OUTPUT -p tcp --dport 8080 -j DROP
```

Block app network access:
```sh
adb shell iptables -A OUTPUT -m owner --uid-pid $(adb shell pidof com.example.app) -j DROP
```

Complete firewall setup:
```sh
#!/bin/bash
echo "=== Firewall Setup ==="

# Block suspicious ports
adb shell iptables -A OUTPUT -p tcp --dport 8080 -j DROP
adb shell iptables -A OUTPUT -p tcp --dport 9999 -j DROP

# Allow essential ports
adb shell iptables -A OUTPUT -p tcp --dport 80 -j ACCEPT
adb shell iptables -A OUTPUT -p tcp --dport 443 -j ACCEPT
adb shell iptables -A OUTPUT -p udp --dport 53 -j ACCEPT

# Enable logging
adb shell iptables -A OUTPUT -j LOG --log-prefix "FIREWALL: "

echo "Firewall rules configured"
```

## Notes
- Firewall management requires root access
- Incorrect firewall rules can block all network access
- Test firewall rules before applying in production
- Firewall rules may be reset on device reboot
- Use firewall for security and testing purposes
- Monitor firewall logs for troubleshooting
- Some devices may not support iptables
- Consider performance impact of complex rules
