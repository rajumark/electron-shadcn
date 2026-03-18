# Custom Commands - ADB Commands

## Description
Advanced custom ADB commands, specialized operations, and expert-level Android debugging techniques.

### Basic Commands

Create custom ADB alias:
```sh
alias myadb='adb -s device_id'
```

Run shell script remotely:
```sh
adb push script.sh /data/local/tmp/
adb shell sh /data/local/tmp/script.sh
```

Execute multiple commands:
```sh
adb shell "command1 && command2 && command3"
```

Run command on all connected devices:
```sh
for device in $(adb devices | grep -v "List" | awk '{print $1}'); do
  adb -s $device shell command
done
```

Create device-specific functions:
```sh
adb_device() { adb -s $(adb devices | grep -v "List" | head -1 | awk '{print $1}') "$@"; }
```

### Advanced Commands

Batch file operations:
```sh
adb shell "for file in /sdcard/*.jpg; do cp \$file /backup/; done"
```

Remote script execution:
```sh
adb shell "nohup command > /dev/null 2>&1 &"
```

Cross-device operations:
```sh
adb -s device1 shell command | adb -s device2 shell "cat > /file"
```

Custom monitoring script:
```sh
adb shell "while true; do ps -A | grep app; sleep 5; done"
```

Advanced file manipulation:
```sh
adb shell "find /system -name '*.apk' -exec cp {} /backup/ \;"
```

Custom performance monitoring:
```sh
adb shell "top -n 1 | head -10 && free -m && df -h"
```

Remote debugging setup:
```sh
adb shell "setprop debug.log.tags MyTag:V"
```

Custom log filtering:
```sh
adb shell "logcat -s MyTag:* | grep -E 'ERROR|WARN'"
```

Batch app operations:
```sh
for app in $(adb shell pm list packages | cut -d: -f2); do
  echo "Processing $app"
  adb shell dumpsys package $app | grep versionName
done
```

Custom device info collection:
```sh
adb shell "getprop | grep -E 'model|version|build' > /device_info.txt"
```

Advanced network testing:
```sh
adb shell "ping -c 10 8.8.8.8 && traceroute 8.8.8.8 && nslookup google.com"
```

Custom backup automation:
```sh
adb shell "tar -czf /sdcard/backup_$(date +%Y%m%d).tar.gz /data/data/com.example.app"
```

Remote system analysis:
```sh
adb shell "ps -A --sort=-%cpu | head -10 && ps -A --sort=-%mem | head -10"
```

### Examples

Create device monitoring dashboard:
```sh
adb shell "while true; do clear; date; echo '=== CPU ==='; top -n 1 | head -5; echo '=== Memory ==='; free -m; sleep 2; done"
```

Batch app backup:
```sh
for app in $(adb shell pm list packages -3 | cut -d: -f2); do
  echo "Backing up $app"
  adb backup -f $app.ab $app
done
```

Custom performance profiling:
```sh
adb shell "dumpsys cpuinfo > /cpu.txt && dumpsys meminfo > /mem.txt && dumpsys battery > /battery.txt"
```

Remote log analysis:
```sh
adb shell "logcat -d | grep -E 'CRASH|FATAL|ANR' | tail -50"
```

Cross-device file sync:
```sh
adb -s device1 pull /sdcard/file.txt .
adb -s device2 push file.txt /sdcard/
```

Custom device health check:
```sh
adb shell "echo '=== Device Health ===' && getprop ro.build.version.release && getprop ro.product.model && df -h && free -m"
```

## Notes
- Custom commands may require root access
- Some operations may affect device stability
- Use proper error handling in custom scripts
- Test custom commands on non-production devices first
- Custom commands can automate complex workflows
- Some operations may require specific Android versions
- Use appropriate permissions for custom operations
- Document custom commands for team sharing
