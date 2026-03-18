# Process Management - ADB Commands

## Description
Commands for managing processes, monitoring process activity, and process control operations on Android devices.

### Basic Commands

List running processes:
```sh
adb shell ps
```

List all processes:
```sh
adb shell ps -A
```

Kill process by PID:
```sh
adb shell kill 1234
```

Kill process by name:
```sh
adb shell pkill com.example.app
```

Check process status:
```sh
adb shell ps -o pid,ppid,name
```

### Advanced Commands

Monitor process activity:
```sh
adb shell top
```

Kill process with signal:
```sh
adb shell kill -9 1234
```

Check process memory usage:
```sh
adb shell ps -o pid,ppid,name,vsz,rss
```

Find process PID:
```sh
adb shell pidof com.example.app
```

Check process threads:
```sh
adb shell ps -T
```

Monitor specific process:
```sh
adb shell watch -n 1 "ps | grep com.example.app"
```

Check process CPU usage:
```sh
adb shell top -n 1 | grep com.example.app
```

Kill all processes of user:
```sh
adb shell pkill -u user_name
```

Check process priority:
```sh
adb shell ps -o pid,pri,name
```

Suspend process:
```sh
adb shell kill -STOP 1234
```

Resume process:
```sh
adb shell kill -CONT 1234
```

Check process file descriptors:
```sh
adb shell ls -la /proc/1234/fd/
```

### Examples

Find and kill specific app:
```sh
PID=$(adb shell pidof com.example.app)
adb shell kill $PID
```

Monitor process memory:
```sh
adb shell watch -n 2 "ps -o pid,rss,name | grep com.example.app"
```

Kill all background processes:
```sh
adb shell am kill-all
```

Check system process activity:
```sh
adb shell top -n 1 -s cpu
```

Find processes using high memory:
```sh
adb shell ps -o pid,rss,name | sort -k2 -nr | head -10
```

Monitor process creation:
```sh
adb shell logcat | grep -E "start.*process|process.*started"
```

## Notes
- Some process operations require root access
- Killing system processes may cause instability
- Use `am force-stop` for cleaner app termination
- Process IDs change between executions
- Memory values are in KB by default
- CPU usage monitoring may impact performance
- Some processes may restart automatically
- Use `adb shell ps --help` for available options
