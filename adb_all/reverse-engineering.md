# Reverse Engineering - ADB Commands

## Description
Commands for reverse engineering Android applications, system analysis, and code investigation.

### Basic Commands

Extract APK files:
```sh
adb shell pm path com.example.app
```

Check app components:
```sh
adb shell dumpsys package com.example.app
```

Analyze app structure:
```sh
adb shell ls -la /data/app/com.example.app*/
```

Check native libraries:
```sh
adb shell ls -la /data/app/com.example.app*/lib/
```

Monitor app behavior:
```sh
adb shell logcat | grep com.example.app
```

### Advanced Commands

APK extraction and analysis:
```sh
#!/bin/bash
echo "=== APK Extraction and Analysis ==="

# Get APK path
target_app="com.example.app"
apk_path=$(adb shell pm path $target_app | cut -d: -f2)
echo "APK path: $apk_path"

# Pull APK to local
echo "Extracting APK..."
adb pull $apk_path $target_app.apk

# Analyze APK structure
echo "Analyzing APK structure..."
unzip -l $target_app.apk | head -20

# Extract APK contents
echo "Extracting APK contents..."
unzip $target_app.apk -d $target_app_extracted

# Analyze manifest
echo "Analyzing AndroidManifest.xml..."
aapt dump xmltree $target_app.apk AndroidManifest.xml | head -30
```

Native library analysis:
```sh
#!/bin/bash
echo "=== Native Library Analysis ==="

# Extract native libraries
target_app="com.example.app"
echo "Extracting native libraries for $target_app..."

# Get library directory
lib_dir=$(adb shell pm path $target_app | cut -d: -f2 | sed 's/base.apk/lib/')
echo "Library directory: $lib_dir"

# List native libraries
echo "Native libraries:"
adb shell ls -la $lib_dir/

# Pull libraries for analysis
for lib in $(adb shell ls $lib_dir/); do
  echo "Analyzing $lib..."
  adb pull $lib_dir/$lib $lib
  
  # Analyze library with file command
  file $lib
  
  # Analyze with objdump if available
  objdump -h $lib 2>/dev/null | head -10
done
```

Application behavior monitoring:
```sh
#!/bin/bash
echo "=== Application Behavior Monitoring ==="

target_app="com.example.app"

# Start monitoring
echo "Starting behavior monitoring..."
adb shell logcat | grep $target_app &
LOGCAT_PID=$!

# Launch app
echo "Launching $target_app..."
adb shell am start -n $target_app/.MainActivity

# Monitor for 30 seconds
sleep 30

# Stop monitoring
echo "Stopping monitoring..."
adb shell kill $LOGCAT_PID

# Analyze logs
echo "Analyzing behavior logs..."
adb shell logcat -d | grep $target_app | head -20
```

System call analysis:
```sh
#!/bin/bash
echo "=== System Call Analysis ==="

target_app="com.example.app"

# Get app PID
echo "Getting app PID..."
pid=$(adb shell pgrep $target_app)
echo "PID: $pid"

# Trace system calls
echo "Tracing system calls..."
adb shell strace -f -e trace=all -p $pid -o /sdcard/syscalls.log &
STRACE_PID=$!

# Monitor for 30 seconds
sleep 30

# Stop tracing
echo "Stopping system call trace..."
adb shell kill $STRACE_PID

# Analyze system calls
echo "Analyzing system calls..."
adb pull /sdcard/syscalls.log
cat syscalls.log | head -30
```

Network traffic analysis:
```sh
#!/bin/bash
echo "=== Network Traffic Analysis ==="

target_app="com.example.app"

# Start network monitoring
echo "Starting network monitoring..."
adb shell tcpdump -i any -s 0 -w /sdcard/network.pcap &
TCPDUMP_PID=$!

# Launch app
echo "Launching $target_app..."
adb shell am start -n $target_app/.MainActivity

# Monitor for 60 seconds
sleep 60

# Stop network monitoring
echo "Stopping network monitoring..."
adb shell kill $TCPDUMP_PID

# Analyze network traffic
echo "Analyzing network traffic..."
adb pull /sdcard/network.pcap
tcpdump -r network.pcap -nn | head -20
```

Memory analysis:
```sh
#!/bin/bash
echo "=== Memory Analysis ==="

target_app="com.example.app"

# Get app PID
pid=$(adb shell pgrep $target_app)
echo "PID: $pid"

# Analyze memory layout
echo "Memory layout analysis:"
adb shell cat /proc/$pid/maps | head -20

# Analyze memory usage
echo "Memory usage analysis:"
adb shell cat /proc/$pid/status | grep -E "VmSize|VmRSS|VmData"

# Create memory dump
echo "Creating memory dump..."
adb shell su -c "gcore -o /sdcard/memdump $pid"

# Pull memory dump
adb pull /sdcard/memdump.*
```

File system analysis:
```sh
#!/bin/bash
echo "=== File System Analysis ==="

target_app="com.example.app"

# Analyze app directories
echo "App directory analysis:"
adb shell ls -la /data/data/$target_app/

# Analyze shared preferences
echo "Shared preferences analysis:"
adb shell ls -la /data/data/$target_app/shared_prefs/

# Analyze databases
echo "Database analysis:"
adb shell ls -la /data/data/$target_app/databases/

# Analyze cache
echo "Cache analysis:"
adb shell ls -la /data/data/$target_app/cache/

# Pull key files for analysis
echo "Pulling key files..."
adb pull /data/data/$target_app/shared_prefs/com.example.app_preferences.xml
adb pull /data/data/$target_app/databases/app.db
```

Application decompilation:
```sh
#!/bin/bash
echo "=== Application Decompilation ==="

target_app="com.example.app"

# Extract APK
apk_path=$(adb shell pm path $target_app | cut -d: -f2)
adb pull $apk_path $target_app.apk

# Use apktool for decompilation
echo "Decompiling APK..."
apktool d $target_app.apk -o $target_app_decompiled

# Analyze smali code
echo "Analyzing smali code..."
find $target_app_decompiled -name "*.smali" | head -10

# Analyze resources
echo "Analyzing resources..."
ls -la $target_app_decompiled/res/
```

Dynamic analysis:
```sh
#!/bin/bash
echo "=== Dynamic Analysis ==="

target_app="com.example.app"

# Start Frida if available
echo "Starting dynamic analysis..."
adb shell frida -U -f $target_app -l &
FRIDA_PID=$!

# Launch app
echo "Launching $target_app..."
adb shell am start -n $target_app/.MainActivity

# Monitor for 60 seconds
sleep 60

# Stop analysis
echo "Stopping dynamic analysis..."
adb shell kill $FRIDA_PID

# Analyze results
echo "Analyzing dynamic analysis results..."
```

Security analysis:
```sh
#!/bin/bash
echo "=== Security Analysis ==="

target_app="com.example.app"

# Check app permissions
echo "Permission analysis:"
adb shell dumpsys package $target_app | grep -A 20 "requested permissions"

# Check exported components
echo "Exported components:"
adb shell dumpsys package $target_app | grep -A 5 "exported=true"

# Check debuggable status
echo "Debuggable status:"
adb shell dumpsys package $target_app | grep debuggable

# Check custom permissions
echo "Custom permissions:"
adb shell dumpsys package $target_app | grep -A 10 "permission"
```

### Examples

Basic reverse engineering:
```sh
apk_path=$(adb shell pm path com.example.app | cut -d: -f2)
adb pull $apk_path app.apk
unzip -l app.apk | head -20
```

App structure analysis:
```sh
adb shell dumpsys package com.example.app | head -30
adb shell ls -la /data/app/com.example.app*/
adb shell ls -la /data/app/com.example.app*/lib/
```

System call tracing:
```sh
pid=$(adb shell pgrep com.example.app)
adb shell strace -f -e trace=all -p $pid -o /sdcard/syscalls.log &
sleep 30
adb shell kill $(pidof strace)
adb pull /sdcard/syscalls.log
```

Complete reverse engineering:
```sh
#!/bin/bash
echo "=== Complete Reverse Engineering ==="

# APK extraction
apk_path=$(adb shell pm path com.example.app | cut -d: -f2)
adb pull $apk_path app.apk

# APK analysis
echo "APK analysis:"
aapt dump badging app.apk | head -20

# Native library analysis
echo "Native library analysis:"
unzip -j app.apk "lib/*" -d libs/
file libs/* | head -10

# App behavior monitoring
echo "App behavior monitoring:"
adb shell am start -n com.example.app/.MainActivity
sleep 10
adb shell logcat -d | grep com.example.app | head -20

echo "Reverse engineering completed"
```

## Notes
- Reverse engineering requires root access for most operations
- Reverse engineering may violate app licenses and terms of service
- Use reverse engineering only for legitimate security research
- Document all reverse engineering findings
- Consider legal implications of reverse engineering
- Use appropriate tools for analysis
- Follow responsible disclosure practices
- Respect intellectual property rights
