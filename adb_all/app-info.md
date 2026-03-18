# App Information - ADB Commands

## Description
Commands for retrieving detailed information about installed applications, packages, and their properties.

### Basic Commands

List all installed packages:
```sh
adb shell pm list packages
```

List system packages only:
```sh
adb shell pm list packages -s
```

List third-party packages only:
```sh
adb shell pm list packages -3
```

Find specific package:
```sh
adb shell pm list packages | grep com.example.app
```

Get package information:
```sh
adb shell dumpsys package com.example.app
```

### Advanced Commands

Show package version information:
```sh
adb shell dumpsys package com.example.app | grep version
```

Get package installation path:
```sh
adb shell pm path com.example.app
```

Show package permissions:
```sh
adb shell pm list permissions -d com.example.app
```

Get app version name:
```sh
adb shell dumpsys package com.example.app | grep versionName
```

Get app version code:
```sh
adb shell dumpsys package com.example.app | grep versionCode
```

Show app activities:
```sh
adb shell pm list packages -f com.example.app
```

Get app signature information:
```sh
adb shell dumpsys package com.example.app | grep -A 20 "PackageSignatures"
```

Check if app is enabled:
```sh
adb shell pm list packages -e com.example.app
```

Check if app is disabled:
```sh
adb shell pm list packages -d com.example.app
```

Get app installation date:
```sh
adb shell dumpsys package com.example.app | grep "firstInstallTime"
```

Get app last update time:
```sh
adb shell dumpsys package com.example.app | grep "lastUpdateTime"
```

Show app UID and GID:
```sh
adb shell cat /proc/*/status | grep -E "Uid|Gid" | grep $(adb shell pm list packages -f | grep com.example.app | cut -d= -f2)
```

Get app data directory:
```sh
adb shell ls -la /data/data/com.example.app
```

Show app services:
```sh
adb shell dumpsys activity services | grep com.example.app
```

### Examples

Complete app information script:
```sh
#!/bin/bash
PACKAGE="com.example.app"

echo "=== App Information for $PACKAGE ==="

# Basic info
echo "Package Name: $PACKAGE"
echo "Version: $(adb shell dumpsys package $PACKAGE | grep versionName | awk '{print $2}')"
echo "Version Code: $(adb shell dumpsys package $PACKAGE | grep versionCode | awk '{print $2}')"
echo "Install Path: $(adb shell pm path $PACKAGE | cut -d: -f2)"

# Installation info
echo "First Install: $(adb shell dumpsys package $PACKAGE | grep firstInstallTime | awk '{print $2}')"
echo "Last Update: $(adb shell dumpsys package $PACKAGE | grep lastUpdateTime | awk '{print $2}')"

# Status
if adb shell pm list packages -e | grep -q "$PACKAGE"; then
    echo "Status: Enabled"
elif adb shell pm list packages -d | grep -q "$PACKAGE"; then
    echo "Status: Disabled"
else
    echo "Status: Not Installed"
fi
```

App comparison script:
```sh
#!/bin/bash
APP1="com.example.app1"
APP2="com.example.app2"

echo "=== App Comparison ==="
echo "$APP1 Version: $(adb shell dumpsys package $APP1 | grep versionName | awk '{print $2}')"
echo "$APP2 Version: $(adb shell dumpsys package $APP2 | grep versionName | awk '{print $2}')"

echo "$APP1 Path: $(adb shell pm path $APP1 | cut -d: -f2)"
echo "$APP2 Path: $(adb shell pm path $APP2 | cut -d: -f2)"
```

Find apps by keyword:
```sh
#!/bin/bash
KEYWORD="camera"

echo "=== Apps containing '$KEYWORD' ==="
adb shell pm list packages | grep -i "$KEYWORD" | sed 's/package://'
```

## Notes
- Some commands may require root access for system apps
- Package information can be extensive; use grep to filter specific details
- App data directories may not be accessible without root
- Version information format may vary between Android versions
- Use `dumpsys package` for comprehensive package information
- Some apps may have multiple APKs (split APKs) with different paths
