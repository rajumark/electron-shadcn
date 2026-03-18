# Monkey Testing - ADB Commands

## Description
Commands for running UI stress tests, monkey testing, and automated UI testing on Android applications.

### Basic Commands

Run monkey test on app:
```sh
adb shell monkey -p com.example.app 100
```

Run monkey test with verbose output:
```sh
adb shell monkey -p com.example.app -v 100
```

Run monkey on all apps:
```sh
adb shell monkey 1000
```

Run monkey with throttle:
```sh
adb shell monkey --throttle 500 -p com.example.app 100
```

Check monkey help:
```sh
adb shell monkey --help
```

### Advanced Commands

Run monkey with specific events:
```sh
adb shell monkey -p com.example.app --pct-touch 50 --pct-motion 30 100
```

Run monkey with seed for reproducibility:
```sh
adb shell monkey -p com.example.app -s 12345 100
```

Run monkey with crash monitoring:
```sh
adb shell monkey -p com.example.app --ignore-crashes 100
```

Run monkey with timeout:
```sh
adb shell monkey -p com.example.app --ignore-timeouts 100
```

Run monkey with ANR monitoring:
```sh
adb shell monkey -p com.example.app --ignore-anrs 100
```

Run monkey with specific categories:
```sh
adb shell monkey -p com.example.app --pct-appswitch 20 --pct-rotation 10 100
```

Run monkey with debug output:
```sh
adb shell monkey -p com.example.app -v -v 100
```

Run monkey with custom event distribution:
```sh
adb shell monkey -p com.example.app --pct-nav 10 --pct-majornav 15 --pct-syskeys 5 100
```

Run monkey with permissions:
```sh
adb shell monkey -p com.example.app --ignore-security-exceptions 100
```

Run monkey with package blacklist:
```sh
adb shell monkey --pkg-blacklist-file blacklist.txt 100
```

Run monkey with profiling:
```sh
adb shell monkey -p com.example.app --hprof 100
```

Run monkey with crash reporting:
```sh
adb shell monkey -p com.example.app --kill-process-after-error 100
```

Monitor monkey test results:
```sh
adb shell monkey -p com.example.app 100 2>&1 | grep -E "crash|ANR|error"
```

### Examples

Basic monkey test:
```sh
adb shell monkey -p com.example.app 500
```

Monkey test with detailed output:
```sh
adb shell monkey -p com.example.app -v -v 200
```

Monkey test with custom event distribution:
```sh
adb shell monkey -p com.example.app --pct-touch 60 --pct-motion 20 --pct-appswitch 10 100
```

Reproducible monkey test:
```sh
adb shell monkey -p com.example.app -s 54321 300
```

Monkey test with crash monitoring:
```sh
adb shell monkey -p com.example.app --ignore-crashes --ignore-anrs 500
```

Monitor monkey for errors:
```sh
adb shell monkey -p com.example.app 1000 2>&1 | grep -E "CRASH|ANR|FATAL"
```

Monkey test with profiling:
```sh
adb shell monkey -p com.example.app --hprof 200
```

## Notes
- Monkey testing can cause data loss in apps
- Use appropriate event counts to avoid excessive testing
- Monkey testing may trigger app crashes
- Use `--ignore-crashes` to continue testing after crashes
- Monkey testing generates random UI events
- Use seed values for reproducible test results
- Monitor logcat during monkey testing for detailed errors
- Monkey testing helps find UI stability issues
