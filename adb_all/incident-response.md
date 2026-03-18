# Incident Response - ADB Commands

## Description
Commands for security incident response, threat mitigation, and incident management on Android devices.

### Basic Commands
Check incident logs:
```sh
adb shell logcat -d | grep -E "incident|security|threat"
```

Isolate affected systems:
```sh
adb shell settings put global airplane_mode_on 1
```

Document incident details:
```sh
adb shell getprop > incident_device_info.txt
```

Check system integrity:
```sh
adb shell getprop ro.build.tags
```

Monitor ongoing threats:
```sh
adb shell logcat | grep -E "incident|threat|malware"
```

### Advanced Commands

Incident assessment:
```sh
#!/bin/bash
echo "=== Incident Assessment ==="

# Check incident severity
echo "Incident severity assessment:"
incident_count=$(adb shell logcat -d | grep -E "incident|threat|malware" | wc -l)
echo "Security events detected: $incident_count"

# Check affected systems
echo "Affected systems:"
adb shell getprop ro.product.model
adb shell getprop ro.build.version.release

# Check data exposure
echo "Data exposure assessment:"
adb shell pm list packages | grep -E "root|hack|crack" | wc -l
```

Incident containment:
```sh
#!/bin/bash
echo "=== Incident Containment ==="

# Isolate device from network
echo "Isolating device..."
adb shell settings put global airplane_mode_on 1
adb shell svc wifi disable
adb shell svc data disable

# Disable suspicious apps
echo "Disabling suspicious apps..."
for app in $(adb shell pm list packages | grep -E "root|hack|crack" | cut -d: -f2); do
  adb shell pm disable $app
done

# Enable safe mode
echo "Enabling safe mode..."
adb shell setprop persist.sys.safemode 1
adb shell reboot

# Verify containment
echo "Containment verification:"
adb shell settings get global airplane_mode_on
adb shell getprop persist.sys.safemode
```

Incident investigation:
```sh
#!/bin/bash
echo "=== Incident Investigation ==="

# Collect forensic data
echo "Collecting forensic data..."
adb shell dumpsys activity > incident_activity_dump.txt
adb shell dumpsys connectivity > incident_connectivity_dump.txt
adb shell dumpsys package > incident_package_dump.txt

# Analyze attack vectors
echo "Analyzing attack vectors..."
adb shell logcat -d | grep -E "incident|threat|malware" | tail -20

# Check for persistence mechanisms
echo "Checking persistence mechanisms..."
adb shell find /data/app -name "*.apk" -exec grep -l "malicious" {} \; 2>/dev/null
```

Incident eradication:
```sh
#!/bin/bash
echo "=== Incident Eradication ==="

# Remove malicious apps
echo "Removing malicious apps..."
for app in $(adb shell pm list packages | grep -E "root|hack|crack" | cut -d: -f2); do
  echo "Removing $app"
  adb shell pm uninstall $app
done

# Clean malicious files
echo "Cleaning malicious files..."
adb shell find /data/app -name "*root*" -delete 2>/dev/null
adb shell find /sdcard -name "*.apk" -delete 2>/dev/null

# Reset security settings
echo "Resetting security settings..."
adb shell settings put global adb_enabled 0
adb shell settings put secure install_non_market_apps 0
```

Incident recovery:
```sh
#!/bin/bash
echo "=== Incident Recovery ==="

# Restore normal operations
echo "Restoring normal operations..."
adb shell settings put global airplane_mode_on 0
adb shell svc wifi enable
adb shell svc data enable

# Reinstall legitimate apps
echo "Reinstalling legitimate apps..."
# Add legitimate app reinstall commands here

# Verify recovery
echo "Verifying recovery..."
adb shell logcat -d | grep -E "incident|threat|malware" | wc -l
```

Incident documentation:
```sh
#!/bin/bash
echo "=== Incident Documentation ==="

# Generate incident report
report_date=$(date +%Y%m%d_%H%M%S)
report_file="incident_report_$report_date.txt"

cat > $report_file << EOF
Security Incident Report
Generated: $(date)
Device: $(adb shell getprop ro.product.model)
Android Version: $(adb shell getprop ro.build.version.release)

INCIDENT DETAILS:
- Incident Type: Security Breach
- Detection Time: $(date)
- Severity: High
- Affected Systems: Device

INCIDENT ASSESSMENT:
$(adb shell logcat -d | grep -E "incident|threat|malware" | tail -10)

ACTIONS TAKEN:
1. Device isolated from network
2. Suspicious applications disabled
3. Malicious files removed
4. Security settings reset

RECOVERY STATUS:
$(adb shell settings get global airplane_mode_on)
$(adb shell pm list packages | grep -E "root|hack|crack" | wc -l)

RECOMMENDATIONS:
1. Monitor device for recurring threats
2. Update security policies
3. Implement additional security measures
4. Train users on security best practices

Report completed: $(date)
EOF

echo "Incident report saved to $report_file"
```

Incident monitoring:
```sh
while true; do
  echo "=== Incident Monitor $(date) ==="
  
  # Check for new incidents
  new_incidents=$(adb shell logcat -d | grep -E "incident|threat|malware" | wc -l)
  if [ $new_incidents -gt 0 ]; then
    echo "ALERT: $new_incidents new incidents detected"
  fi
  
  # Check system status
  echo "System status:"
  adb shell getprop ro.build.tags
  adb shell settings get global airplane_mode_on
  
  # Check for recurrence
  suspicious_apps=$(adb shell pm list packages | grep -E "root|hack|crack" | wc -l)
  if [ $suspicious_apps -gt 0 ]; then
    echo "ALERT: $suspicious_apps suspicious apps detected"
  fi
  
  sleep 300  # Check every 5 minutes
done
```

Automated incident response:
```sh
#!/bin/bash
echo "=== Automated Incident Response ==="

# Define incident response procedures
incident_detected=0

# Check for incidents
if adb shell logcat -d | grep -E "incident|threat|malware" | grep -q "CRITICAL"; then
  echo "CRITICAL INCIDENT DETECTED - Initiating automated response"
  
  # Immediate containment
  adb shell settings put global airplane_mode_on 1
  adb shell svc wifi disable
  adb shell svc data disable
  
  # Disable suspicious apps
  for app in $(adb shell pm list packages | grep -E "root|hack|crack" | cut -d: -f2); do
    adb shell pm disable $app
  done
  
  # Generate alert
  echo "CRITICAL INCIDENT: $(date)" | mail -s "Security Incident Alert" admin@example.com
  
  incident_detected=1
fi

if [ $incident_detected -eq 1 ]; then
  echo "Automated incident response completed"
else
  echo "No critical incidents detected"
fi
```

Incident post-mortem:
```sh
#!/bin/bash
echo "=== Incident Post-Mortem ==="

# Analyze incident timeline
echo "Incident timeline analysis:"
adb shell logcat -d | grep -E "incident|threat|malware" | while read line; do
  timestamp=$(echo $line | awk '{print $1" "$2}')
  echo "$timestamp: $line"
done

# Identify root causes
echo "Root cause analysis:"
adb shell logcat -d | grep -E "incident.*cause|root.*cause" | tail -10

# Lessons learned
echo "Lessons learned:"
echo "1. Early detection is critical"
echo "2. Automated response reduces impact"
echo "3. Regular monitoring prevents recurrence"
```

### Examples

Basic incident response:
```sh
echo "Incident response:"
adb shell settings put global airplane_mode_on 1
adb shell pm list packages | grep -E "root|hack|crack"
adb shell logcat -d | grep -E "incident|threat" | tail -10
```

Incident containment:
```sh
echo "Containing incident:"
adb shell settings put global airplane_mode_on 1
adb shell svc wifi disable
adb shell svc data disable
for app in $(adb shell pm list packages | grep -E "root|hack" | cut -d: -f2); do
  adb shell pm disable $app
done
```

Complete incident response:
```sh
#!/bin/bash
echo "=== Complete Incident Response ==="

# Assessment
echo "Incident assessment:"
adb shell logcat -d | grep -E "incident|threat|malware" | wc -l

# Containment
echo "Containing incident:"
adb shell settings put global airplane_mode_on 1

# Eradication
echo "Eradicating threats:"
for app in $(adb shell pm list packages | grep -E "root|hack" | cut -d: -f2); do
  adb shell pm uninstall $app
done

# Recovery
echo "Recovery:"
adb shell settings put global airplane_mode_on 0

echo "Incident response completed"
```

## Notes
- Incident response requires quick action
- Document all response actions
- Follow incident response procedures
- Consider legal implications
- Test response procedures regularly
- Maintain incident logs for analysis
- Coordinate with security team
- Use automated response when possible
