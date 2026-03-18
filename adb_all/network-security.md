# Network Security - ADB Commands

## Description
Commands for managing network security, SSL/TLS configuration, and network traffic protection.

### Basic Commands

Check network security config:
```sh
adb shell dumpsys connectivity | grep -E "security|ssl|tls"
```

Check SSL/TLS settings:
```sh
adb shell getprop | grep -E "ssl|tls|security"
```

Check certificate validation:
```sh
adb shell curl -v https://google.com
```

Monitor network security:
```sh
adb shell logcat | grep -E "network|security|ssl|tls"
```

Check network policies:
```sh
adb shell dumpsys device_policy | grep -E "network|security"
```

### Advanced Commands

Network security configuration:
```sh
#!/bin/bash
echo "=== Network Security Configuration ==="

# Check system-wide security policies
echo "System security policies:"
adb shell getprop | grep -E "network.*security|security.*network"

# Check app network security config
target_app="com.example.app"
echo "Network security config for $target_app:"
adb shell dumpsys package $target_app | grep -A 10 "NetworkSecurityConfig"

# Check certificate pinning
echo "Certificate pinning status:"
adb shell dumpsys connectivity | grep -E "pinning|certificate"
```

SSL/TLS configuration analysis:
```sh
#!/bin/bash
echo "=== SSL/TLS Configuration Analysis ==="

# Check supported TLS versions
echo "Supported TLS versions:"
adb shell getprop ro.tls.version

# Check cipher suites
echo "Cipher suites:"
adb shell getprop ro.cipher.suites

# Test TLS connection
echo "Testing TLS connection:"
adb shell curl -v --tlsv1.2 https://google.com
adb shell curl -v --tlsv1.3 https://google.com
```

Network security monitoring:
```sh
while true; do
  echo "=== Network Security Monitor $(date) ==="
  
  # Check SSL/TLS connections
  echo "SSL/TLS connections:"
  adb shell netstat -anp | grep -E ":443|:8443" | tail -5
  
  # Check certificate validation
  echo "Certificate validation:"
  adb shell logcat -d | grep -E "certificate|cert|ssl|tls" | tail -5
  
  # Check security policy violations
  echo "Security violations:"
  adb shell logcat -d | grep -E "network.*security|security.*violation" | tail -3
  
  sleep 60
done
```

Network security policy enforcement:
```sh
#!/bin/bash
echo "=== Network Security Policy Enforcement ==="

# Enforce HTTPS only
adb shell settings put global force_https 1

# Disable cleartext traffic
adb shell settings put global allow_cleartext_traffic 0

# Enable certificate pinning
adb shell settings put global certificate_pinning_enabled 1

# Verify policies
echo "Security policies:"
adb shell settings get global force_https
adb shell settings get global allow_cleartext_traffic
```

Certificate pinning configuration:
```sh
#!/bin/bash
echo "=== Certificate Pinning Configuration ==="

# Configure certificate pinning
echo "Configuring certificate pinning..."
adb shell am broadcast -a com.example.SET_CERT_PIN -e domain "example.com" -e cert_hash "sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="

# Verify pinning
echo "Verifying certificate pinning:"
adb shell curl -v https://example.com 2>&1 | grep -E "certificate|pinning|verify"

# Test pinning violation
echo "Testing pinning violation:"
adb shell curl -v --insecure https://example.com 2>&1 | grep -E "certificate|error|verify"
```

Network security debugging:
```sh
#!/bin/bash
echo "=== Network Security Debugging ==="

# Enable security debugging
adb shell setprop log.tag.NetworkSecurityConfig VERBOSE
adb shell setprop log.tag.TrustManagerImpl VERBOSE
adb shell setprop log.tag.OkHttpClient VERBOSE

# Monitor security events
adb shell logcat | grep -E "network.*security|ssl|tls|certificate" | tail -20

# Check security errors
adb shell logcat -d | grep -E "network.*error|ssl.*error|tls.*error" | tail -10
```

Network security audit:
```sh
#!/bin/bash
echo "=== Network Security Audit ==="

# Check for cleartext traffic
echo "Cleartext traffic:"
adb shell dumpsys package | grep -E "cleartext|http://"

# Check certificate validation
echo "Certificate validation:"
adb shell curl -v https://google.com 2>&1 | grep -E "certificate|verify|chain"

# Check security configuration
echo "Security configuration:"
adb shell dumpsys connectivity | grep -E "security|ssl|tls" | head -10
```

Network security hardening:
```sh
#!/bin/bash
echo "=== Network Security Hardening ==="

# Disable HTTP traffic
adb shell settings put global block_http_traffic 1

# Enable strict SSL verification
adb shell settings put global strict_ssl_verification 1

# Disable weak cipher suites
adb shell settings put global disable_weak_ciphers 1

# Verify hardening
echo "Security hardening:"
adb shell settings get global block_http_traffic
adb shell settings get global strict_ssl_verification
```

VPN security configuration:
```sh
#!/bin/bash
echo "=== VPN Security Configuration ==="

# Check VPN security settings
echo "VPN security:"
adb shell settings get secure vpn_security_enabled
adb shell settings get secure vpn_require_encryption

# Configure VPN security
adb shell settings put secure vpn_security_enabled 1
adb shell settings put secure vpn_require_encryption 1

# Test VPN security
echo "Testing VPN security:"
adb shell ping -c 3 8.8.8.8
```

Network traffic encryption:
```sh
#!/bin/bash
echo "=== Network Traffic Encryption ==="

# Check encryption status
echo "Encryption status:"
adb shell dumpsys connectivity | grep -E "encrypt|ssl|tls|https"

# Test encrypted traffic
echo "Testing encrypted traffic:"
adb shell tcpdump -i any -c 10 port 443

# Monitor unencrypted traffic
echo "Monitoring unencrypted traffic:"
adb shell tcpdump -i any -c 10 port 80
```

Network security compliance:
```sh
#!/bin/bash
echo "=== Network Security Compliance ==="

# Check compliance requirements
echo "Compliance check:"
adb shell settings get global security_compliance_enabled
adb shell getprop ro.security.compliance

# Configure compliance settings
adb shell settings put global security_compliance_enabled 1
adb shell settings put global audit_network_traffic 1

# Verify compliance
echo "Compliance verification:"
adb shell dumpsys device_policy | grep -E "network|security|compliance"
```

### Examples

Basic network security check:
```sh
adb shell dumpsys connectivity | grep -E "security|ssl|tls"
adb shell curl -v https://google.com
```

SSL/TLS configuration:
```sh
echo "TLS versions:"
adb shell getprop ro.tls.version

echo "Testing TLS connection:"
adb shell curl -v --tlsv1.2 https://google.com
```

Network security monitoring:
```sh
while true; do
  echo "Network security:"
  adb shell netstat -anp | grep -E ":443|:8443" | tail -3
  adb shell logcat -d | grep -E "certificate|ssl|tls" | tail -3
  sleep 30
done
```

Complete network security analysis:
```sh
#!/bin/bash
echo "=== Complete Network Security Analysis ==="

# Security configuration
echo "Security configuration:"
adb shell dumpsys connectivity | grep -E "security|ssl|tls"

# SSL/TLS testing
echo "SSL/TLS testing:"
adb shell curl -v https://google.com 2>&1 | grep -E "certificate|cipher|version"

# Network monitoring
echo "Network monitoring:"
adb shell netstat -anp | grep -E ":443|:80" | head -5

echo "Network security analysis completed"
```

## Notes
- Network security settings may require root access
- Some security features depend on Android version
- SSL/TLS configuration affects app connectivity
- Monitor network security logs for issues
- Test security changes before deployment
- Consider performance impact of security measures
- Document network security policies
- Keep security configurations up to date
