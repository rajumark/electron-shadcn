# Certificate Management - ADB Commands

## Description
Commands for managing SSL/TLS certificates, certificate authorities, and certificate validation on Android devices.

### Basic Commands

Check trusted certificates:
```sh
adb shell ls /system/etc/security/cacerts/
```

List user certificates:
```sh
adb shell ls /data/misc/user/0/cacerts-added/
```

Check certificate store:
```sh
adb shell keytool -list -keystore /system/etc/security/cacerts.bks
```

Verify certificate:
```sh
adb shell openssl s_client -connect google.com:443
```

Check certificate chain:
```sh
adb shell curl -v https://google.com
```

### Advanced Commands

Certificate installation:
```sh
#!/bin/bash
echo "=== Certificate Installation ==="

# Install system certificate
echo "Installing system certificate..."
adb shell cp /sdcard/certificate.crt /system/etc/security/cacerts/
adb shell chmod 644 /system/etc/security/cacerts/certificate.crt
adb shell chown root:root /system/etc/security/cacerts/certificate.crt

# Install user certificate
echo "Installing user certificate..."
adb shell cp /sdcard/user_cert.p12 /data/misc/user/0/cacerts-added/
adb shell chmod 644 /data/misc/user/0/cacerts-added/user_cert.p12

# Verify installation
echo "Verifying certificates:"
adb shell ls /system/etc/security/cacerts/
adb shell ls /data/misc/user/0/cacerts-added/
```

Certificate validation:
```sh
#!/bin/bash
echo "=== Certificate Validation ==="

# Validate certificate chain
echo "Validating certificate chain for google.com:"
adb shell openssl s_client -connect google.com:443 -showcerts

# Check certificate expiration
echo "Checking certificate expiration:"
adb shell openssl s_client -connect google.com:443 | grep -E "notBefore|notAfter"

# Verify certificate issuer
echo "Checking certificate issuer:"
adb shell openssl s_client -connect google.com:443 | grep -E "issuer|subject"
```

Certificate debugging:
```sh
#!/bin/bash
echo "=== Certificate Debugging ==="

# Enable certificate debugging
adb shell setprop log.tag.NetworkSecurityConfig VERBOSE
adb shell setprop log.tag.TrustManagerImpl VERBOSE

# Monitor certificate events
adb shell logcat | grep -E "certificate|cert|SSL|TLS" | tail -20

# Check certificate store integrity
adb shell keytool -list -keystore /system/etc/security/cacerts.bks -v
```

Certificate removal:
```sh
#!/bin/bash
echo "=== Certificate Removal ==="

# Remove system certificate
echo "Removing system certificate..."
adb shell rm /system/etc/security/cacerts/certificate.crt

# Remove user certificate
echo "Removing user certificate..."
adb shell rm /data/misc/user/0/cacerts-added/user_cert.p12

# Clear certificate cache
adb shell rm -rf /data/misc/keychain/

# Verify removal
echo "Verifying removal:"
adb shell ls /system/etc/security/cacerts/ | grep -v certificate.crt
adb shell ls /data/misc/user/0/cacerts-added/ | grep -v user_cert.p12
```

Certificate analysis:
```sh
#!/bin/bash
echo "=== Certificate Analysis ==="

# Analyze certificate details
echo "Analyzing google.com certificate:"
adb shell openssl s_client -connect google.com:443 </dev/null | openssl x509 -noout -text

# Check certificate fingerprint
echo "Certificate fingerprint:"
adb shell openssl s_client -connect google.com:443 </dev/null | openssl x509 -noout -fingerprint

# Check certificate public key
echo "Certificate public key:"
adb shell openssl s_client -connect google.com:443 </dev/null | openssl x509 -noout -pubkey
```

Network security configuration:
```sh
#!/bin/bash
echo "=== Network Security Configuration ==="

# Check app's network security config
target_app="com.example.app"
echo "Network security config for $target_app:"
adb shell dumpsys package $target_app | grep -A 10 "NetworkSecurityConfig"

# Check system-wide security policies
echo "System security policies:"
adb shell getprop | grep -E "security|cert|ssl|tls"

# Check certificate pinning
echo "Certificate pinning status:"
adb shell dumpsys connectivity | grep -E "pinning|certificate"
```

Certificate trust management:
```sh
#!/bin/bash
echo "=== Certificate Trust Management ==="

# Check trusted CA list
echo "Trusted certificate authorities:"
adb shell ls /system/etc/security/cacerts/ | head -10

# Check user-added certificates
echo "User-added certificates:"
adb shell ls /data/misc/user/0/cacerts-added/ 2>/dev/null

# Check certificate trust store
echo "Certificate trust store:"
adb shell keytool -list -keystore /system/etc/security/cacerts.bks | head -5
```

Certificate performance testing:
```sh
#!/bin/bash
echo "=== Certificate Performance Testing ==="

# Test certificate validation time
echo "Testing certificate validation time:"
time adb shell curl -v https://google.com

# Test multiple certificates
domains=("google.com" "facebook.com" "github.com" "stackoverflow.com")

for domain in "${domains[@]}"; do
  echo "Testing $domain:"
  time adb shell curl -v https://$domain | head -5
done
```

Certificate backup and restore:
```sh
#!/bin/bash
echo "=== Certificate Backup and Restore ==="

# Backup certificates
echo "Backing up certificates..."
adb shell tar -czf /sdcard/certificates_backup.tar.gz /system/etc/security/cacerts/
adb shell tar -czf /sdcard/user_certificates_backup.tar.gz /data/misc/user/0/cacerts-added/

# Pull backups
adb pull /sdcard/certificates_backup.tar.gz
adb pull /sdcard/user_certificates_backup.tar.gz

# Restore certificates
echo "Restoring certificates..."
adb push certificates_backup.tar.gz /sdcard/
adb shell tar -xzf /sdcard/certificates_backup.tar.gz -C /
adb shell rm /sdcard/certificates_backup.tar.gz
```

Certificate security analysis:
```sh
#!/bin/bash
echo "=== Certificate Security Analysis ==="

# Check for weak certificates
echo "Checking for weak certificates..."
adb shell find /system/etc/security/cacerts/ -name "*.0" -exec openssl x509 -in {} -noout -text \; | grep -E "SHA1|MD5|weak"

# Check certificate validity period
echo "Checking certificate validity..."
adb shell find /system/etc/security/cacerts/ -name "*.0" -exec openssl x509 -in {} -noout -dates \;

# Check certificate key strength
echo "Checking key strength..."
adb shell find /system/etc/security/cacerts/ -name "*.0" -exec openssl x509 -in {} -noout -text \; | grep -E "Public-Key|RSA|ECDSA"
```

### Examples

Basic certificate check:
```sh
adb shell ls /system/etc/security/cacerts/
adb shell curl -v https://google.com
```

Certificate installation:
```sh
adb shell cp /sdcard/cert.crt /system/etc/security/cacerts/
adb shell chmod 644 /system/etc/security/cacerts/cert.crt
```

Certificate validation:
```sh
adb shell openssl s_client -connect google.com:443 -showcerts
```

Complete certificate management:
```sh
#!/bin/bash
echo "=== Complete Certificate Management ==="

# Check current certificates
echo "Current certificates:"
adb shell ls /system/etc/security/cacerts/ | wc -l

# Validate certificate
echo "Validating certificate:"
adb shell openssl s_client -connect google.com:443 | grep -E "subject|issuer"

# Check trust store
echo "Trust store:"
adb shell keytool -list -keystore /system/etc/security/cacerts.bks | head -3

echo "Certificate management completed"
```

## Notes
- Certificate management requires root access for system certificates
- User certificates have limited functionality
- Certificate changes may affect app connectivity
- Always backup certificates before making changes
- Test certificate changes in non-production environments
- Some certificates may be protected by system security
- Certificate validation errors can break app functionality
- Consider security implications when modifying certificates
