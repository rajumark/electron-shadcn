# Audit Logging - ADB Commands

## Description
Commands for managing audit logging, security event logging, and system activity monitoring.

### Basic Commands

Check audit status:
```sh
adb shell getprop ro.build.type
```

Check system logs:
```sh
adb shell logcat -d | tail -50
```

Check security logs:
```sh
adb shell logcat -b security -d
```

Monitor audit events:
```sh
adb shell logcat | grep -E "audit|security|event"
```

Check log retention:
```sh
adb shell ls -la /data/log/
```

### Advanced Commands

Audit log analysis:
```sh
#!/bin/bash
echo "=== Audit Log Analysis ==="

# Check system audit logs
echo "System audit logs:"
adb shell logcat -d | grep -E "audit|security|event" | head -20

# Check kernel audit messages
echo "Kernel audit messages:"
adb shell dmesg | grep -E "audit|security" | head -10

# Check SELinux audit logs
echo "SELinux audit logs:"
adb shell logcat -d | grep -E "avc.*denied|selinux" | head -10
```

Security event monitoring:
```sh
while true; do
  echo "=== Security Event Monitor $(date) ==="
  
  # Monitor security events
  echo "Security events:"
  adb shell logcat | grep -E "security|audit|event" | tail -5
  
  # Monitor permission denials
  echo "Permission denials:"
  adb shell logcat | grep -E "Permission denied|Access denied" | tail -5
  
  # Monitor authentication events
  echo "Authentication events:"
  adb shell logcat | grep -E "auth|login|biometric" | tail -5
  
  sleep 30
done
```

Audit log configuration:
```sh
#!/bin/bash
echo "=== Audit Log Configuration ==="

# Enable audit logging
echo "Enabling audit logging..."
adb shell setprop log.tag.AuditService VERBOSE
adb shell setprop log.tag.SecurityService VERBOSE

# Configure log retention
echo "Configuring log retention..."
adb shell settings put global log_retention_days 30

# Verify configuration
echo "Audit configuration:"
adb shell settings get global log_retention_days
adb shell getprop log.tag.AuditService
```

App activity auditing:
```sh
#!/bin/bash
echo "=== App Activity Auditing ==="

# Monitor app launches
echo "App launches:"
adb shell logcat | grep -E "ActivityManager.*Start|am.*start" | tail -10

# Monitor app permissions
echo "App permissions:"
adb shell logcat | grep -E "permission|grant|revoke" | tail -10

# Monitor app network activity
echo "App network activity:"
adb shell logcat | grep -E "network|connect|socket" | tail -10
```

System audit reporting:
```sh
#!/bin/bash
echo "=== System Audit Report ==="

# Generate audit report
report_date=$(date +%Y%m%d_%H%M%S)
report_file="audit_report_$report_date.txt"

echo "Generating audit report..."
cat > $report_file << EOF
System Audit Report - $(date)
================================

System Information:
- Device: $(adb shell getprop ro.product.model)
- Android Version: $(adb shell getprop ro.build.version.release)
- Build Type: $(adb shell getprop ro.build.type)

Security Events:
$(adb shell logcat -d | grep -E "security|audit|event" | tail -20)

Permission Denials:
$(adb shell logcat -d | grep -E "Permission denied|Access denied" | tail -10)

SELinux Events:
$(adb shell logcat -d | grep -E "avc.*denied|selinux" | tail -10)

Report generated: $(date)
EOF

echo "Audit report saved to $report_file"
```

Audit log backup:
```sh
#!/bin/bash
echo "=== Audit Log Backup ==="

# Create backup directory
backup_dir="/sdcard/audit_backup/$(date +%Y%m%d)"
adb shell mkdir -p $backup_dir

# Backup system logs
echo "Backing up system logs..."
adb shell logcat -d > $backup_dir/system_log.txt

# Backup security logs
echo "Backing up security logs..."
adb shell logcat -b security -d > $backup_dir/security_log.txt

# Backup kernel logs
echo "Backing up kernel logs..."
adb shell dmesg > $backup_dir/kernel_log.txt

# Pull backup files
adb pull $backup_dir ./audit_backup/
```

Audit log analysis tools:
```sh
#!/bin/bash
echo "=== Audit Log Analysis Tools ==="

# Analyze failed authentication attempts
echo "Failed authentication attempts:"
adb shell logcat -d | grep -E "auth.*fail|login.*fail|biometric.*fail" | tail -10

# Analyze permission violations
echo "Permission violations:"
adb shell logcat -d | grep -E "Permission.*violation|Access.*denied" | tail -10

# Analyze network security events
echo "Network security events:"
adb shell logcat -d | grep -E "network.*security|ssl|tls" | tail -10

# Analyze app security events
echo "App security events:"
adb shell logcat -d | grep -E "app.*security|security.*app" | tail -10
```

Real-time audit monitoring:
```sh
#!/bin/bash
echo "=== Real-time Audit Monitoring ==="

# Monitor critical security events
while true; do
  echo "=== Critical Events $(date) ==="
  
  # Check for security breaches
  breaches=$(adb shell logcat -d | grep -E "breach|compromise|intrusion" | tail -3)
  if [ ! -z "$breaches" ]; then
    echo "SECURITY BREACH DETECTED:"
    echo "$breaches"
  fi
  
  # Check for privilege escalation
  escalation=$(adb shell logcat -d | grep -E "privilege.*escalation|sudo|su" | tail -3)
  if [ ! -z "$escalation" ]; then
    echo "PRIVILEGE ESCALATION DETECTED:"
    echo "$escalation"
  fi
  
  # Check for data breaches
  data_breach=$(adb shell logcat -d | grep -E "data.*breach|exfiltration" | tail -3)
  if [ ! -z "$data_breach" ]; then
    echo "DATA BREACH DETECTED:"
    echo "$data_breach"
  fi
  
  sleep 60
done
```

Audit log retention management:
```sh
#!/bin/bash
echo "=== Audit Log Retention Management ==="

# Check current retention settings
echo "Current retention settings:"
adb shell settings get global log_retention_days
adb shell settings get global audit_log_retention

# Configure retention
adb shell settings put global log_retention_days 90
adb shell settings put global audit_log_retention 1

# Clean old logs
echo "Cleaning old logs..."
adb shell find /data/log -name "*.log" -mtime +90 -delete 2>/dev/null

# Verify cleanup
echo "Log cleanup verification:"
adb shell du -sh /data/log/
```

Audit log filtering:
```sh
#!/bin/bash
echo "=== Audit Log Filtering ==="

# Filter by severity
echo "Critical events:"
adb shell logcat -d | grep -E "CRITICAL|FATAL|ERROR" | tail -10

# Filter by time range
echo "Last hour events:"
adb shell logcat -t 3600 | grep -E "audit|security" | tail -10

# Filter by component
echo "System events:"
adb shell logcat -d | grep -E "SystemServer|ActivityManager" | grep -E "audit|security" | tail -10
```

### Examples

Basic audit check:
```sh
adb shell getprop ro.build.type
adb shell logcat -d | grep -E "audit|security" | tail -10
```

Security event monitoring:
```sh
while true; do
  echo "Security events:"
  adb shell logcat | grep -E "security|audit|event" | tail -3
  sleep 30
done
```

Audit report generation:
```sh
report_date=$(date +%Y%m%d_%H%M%S)
echo "Audit Report - $(date)" > audit_report_$report_date.txt
echo "Security Events:" >> audit_report_$report_date.txt
adb shell logcat -d | grep -E "security|audit" | tail -20 >> audit_report_$report_date.txt
```

Complete audit analysis:
```sh
#!/bin/bash
echo "=== Complete Audit Analysis ==="

# System audit
echo "System audit:"
adb shell logcat -d | grep -E "audit|security" | head -10

# Kernel audit
echo "Kernel audit:"
adb shell dmesg | grep -E "audit|security" | head -5

# SELinux audit
echo "SELinux audit:"
adb shell logcat -d | grep -E "avc.*denied|selinux" | head -5

echo "Audit analysis completed"
```

## Notes
- Audit logging may require specific permissions
- Log retention affects storage usage
- Audit logs are important for security compliance
- Monitor audit logs regularly for security events
- Configure appropriate log retention periods
- Some audit events may not be available on all devices
- Consider privacy when storing audit logs
- Document audit procedures and policies
