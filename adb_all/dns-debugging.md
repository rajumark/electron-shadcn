# DNS Debugging - ADB Commands

## Description
Commands for debugging DNS issues, monitoring DNS resolution, and DNS configuration analysis.

### Basic Commands

Check DNS servers:
```sh
adb shell getprop net.dns1
adb shell getprop net.dns2
```

Test DNS resolution:
```sh
adb shell nslookup google.com
```

Check DNS settings:
```sh
adb shell settings get global private_dns_specifier
```

Flush DNS cache:
```sh
adb shell ndc flushdefaultif
```

Monitor DNS queries:
```sh
adb shell logcat | grep -E "dns|DNS"
```

### Advanced Commands

DNS configuration analysis:
```sh
#!/bin/bash
echo "=== DNS Configuration Analysis ==="

# System DNS servers
echo "System DNS servers:"
adb shell getprop | grep dns

# DNS settings
echo "DNS settings:"
adb shell settings get global private_dns_mode
adb shell settings get global private_dns_specifier

# Network DNS
echo "Network DNS:"
adb shell cat /etc/resolv.conf
```

DNS resolution testing:
```sh
# Test multiple domains
domains=("google.com" "facebook.com" "github.com" "stackoverflow.com")

for domain in "${domains[@]}"; do
  echo "=== Testing $domain ==="
  adb shell nslookup $domain
  echo "---"
done
```

DNS performance testing:
```sh
#!/bin/bash
echo "=== DNS Performance Test ==="

domains=("google.com" "cloudflare.com" "amazon.com")

for domain in "${domains[@]}"; do
  echo "Testing $domain:"
  time adb shell nslookup $domain
done
```

DNS cache debugging:
```sh
# Check DNS cache
adb shell dumpsys connectivity | grep -E "dns|cache"

# Monitor DNS cache
while true; do
  echo "=== DNS Cache $(date) ==="
  adb shell dumpsys connectivity | grep -E "dns|cache" | tail -5
  sleep 30
done
```

DNS server testing:
```sh
# Test different DNS servers
dns_servers=("8.8.8.8" "1.1.1.1" "208.67.222.222")

for server in "${dns_servers[@]}"; do
  echo "=== Testing DNS server $server ==="
  adb shell nslookup google.com $server
done
```

Private DNS testing:
```sh
# Test private DNS
echo "Testing private DNS..."
adb shell settings put global private_dns_mode hostname
adb shell settings put global private_dns_specifier "dns.google"
sleep 5
adb shell nslookup google.com
```

DNS error debugging:
```sh
# Force DNS error
adb shell nslookup nonexistent.domain.test 2>&1 | grep -E "error|failed|NXDOMAIN"

# Monitor DNS errors
adb shell logcat | grep -E "dns.*error|DNS.*failed"
```

DNS security testing:
```sh
# Test DNS over HTTPS
adb shell settings put global private_dns_mode hostname
adb shell settings put global private_dns_specifier "dns.google"

# Test DNSSEC
adb shell nslookup -type=DNSKEY google.com
```

DNS traffic monitoring:
```sh
# Monitor DNS traffic
adb shell tcpdump -i any port 53

# Monitor DNS queries
adb shell logcat | grep -E "query.*dns|dns.*query"
```

DNS configuration changes:
```sh
# Change DNS servers
adb shell setprop net.dns1 8.8.8.8
adb shell setprop net.dns2 8.8.4.4

# Reset DNS
adb shell ndc flushdefaultif
adb shell ndc resolvconf
```

DNS debugging tools:
```sh
# Enable DNS debugging
adb shell setprop log.tag.DnsResolver VERBOSE
adb shell logcat | grep DnsResolver

# Check DNS resolver
adb shell dumpsys connectivity | grep -A 10 "DnsResolver"
```

DNS timeout testing:
```sh
# Test DNS timeout
timeout 5 adb shell nslookup slow-resolving-domain.com

# Monitor DNS timeouts
adb shell logcat | grep -E "dns.*timeout|DNS.*timeout"
```

### Examples

Basic DNS check:
```sh
adb shell getprop net.dns1
adb shell nslookup google.com
```

DNS performance test:
```sh
time adb shell nslookup google.com
time adb shell nslookup github.com
time adb shell nslookup stackoverflow.com
```

DNS server comparison:
```sh
for server in 8.8.8.8 1.1.1.1 208.67.222.222; do
  echo "=== DNS server $server ==="
  time adb shell nslookup google.com $server
done
```

Complete DNS debugging:
```sh
#!/bin/bash
echo "=== Complete DNS Debugging ==="

# DNS configuration
echo "DNS configuration:"
adb shell getprop | grep dns

# Resolution test
echo "Resolution test:"
adb shell nslookup google.com

# Cache status
echo "DNS cache:"
adb shell dumpsys connectivity | grep -E "dns|cache"

# Error monitoring
echo "DNS errors:"
adb shell logcat -d | grep -E "dns.*error|DNS.*failed" | tail -5

echo "DNS debugging completed"
```

## Notes
- DNS debugging requires network connectivity
- DNS settings may be controlled by system or carrier
- Private DNS requires Android 9.0+ (API 28+)
- DNS cache may affect resolution speed
- Use DNS debugging for network issues
- Monitor DNS logs for troubleshooting
- Some DNS features may not be available on all devices
- Consider privacy when using third-party DNS
