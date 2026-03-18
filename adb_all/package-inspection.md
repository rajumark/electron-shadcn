# Package Inspection - ADB Commands

## Description
Commands for inspecting Android packages, analyzing app metadata, and package information retrieval.

### Basic Commands

List installed packages:
```sh
adb shell pm list packages
```

Get package info:
```sh
adb shell dumpsys package com.example.app
```

Check package path:
```sh
adb shell pm path com.example.app
```

List system packages:
```sh
adb shell pm list packages -s
```

List third-party packages:
```sh
adb shell pm list packages -3
```

### Advanced Commands

Get package version:
```sh
adb shell dumpsys package com.example.app | grep versionName
```

Check package permissions:
```sh
adb shell dumpsys package com.example.app | grep -A 20 "requested permissions"
```

Get package activities:
```sh
adb shell dumpsys package com.example.app | grep -A 10 "Activity Resolver Table"
```

Check package services:
```sh
adb shell dumpsys package com.example.app | grep -A 10 "Service Resolver Table"
```

Get package receivers:
```sh
adb shell dumpsys package com.example.app | grep -A 10 "Broadcast Receiver Resolver Table"
```

Check package signatures:
```sh
adb shell dumpsys package com.example.app | grep -A 20 "PackageSignatures"
```

Get package install location:
```sh
adb shell pm get-install-location com.example.app
```

Check package UID:
```sh
adb shell dumpsys package com.example.app | grep userId
```

Get package data directory:
```sh
adb shell ls -la /data/data/com.example.app
```

Check package components:
```sh
adb shell dumpsys activity | grep com.example.app
```

Get package shared libraries:
```sh
adb shell dumpsys package com.example.app | grep -A 10 "shared libraries"
```

Check package features:
```sh
adb shell dumpsys package com.example.app | grep -A 10 "uses-feature"
```

Monitor package changes:
```sh
adb shell logcat | grep -E "package.*install|package.*uninstall"
```

### Examples

Inspect app package completely:
```sh
adb shell dumpsys package com.example.app
```

Get app version and permissions:
```sh
adb shell dumpsys package com.example.app | grep -E "versionName|requested permissions"
```

Check app activities and services:
```sh
adb shell dumpsys package com.example.app | grep -E "Activity|Service"
```

List all third-party apps:
```sh
adb shell pm list packages -3
```

Check app signature:
```sh
adb shell dumpsys package com.example.app | grep -A 20 "PackageSignatures"
```

Get app data directory:
```sh
adb shell ls -la /data/data/com.example.app
```

Monitor package installations:
```sh
adb shell logcat | grep -E "package.*install|PackageManager"
```

## Notes
- Package inspection requires appropriate permissions
- Some package info may be restricted for security
- System packages may have limited access
- Use `dumpsys package` for comprehensive package info
- Package data directory requires root access
- Some package features vary by Android version
- Package inspection helps with app analysis
- Use caution when accessing sensitive package data
