# App Uninstallation - ADB Commands

## Description
Commands for uninstalling Android applications, removing packages, and cleaning up app data from devices.

### Basic Commands

Uninstall app by package name:
```sh
adb uninstall com.example.app
```

Uninstall from specific device:
```sh
adb -s <serial> uninstall com.example.app
```

### Advanced Commands

Uninstall keeping data and cache:
```sh
adb uninstall -k com.example.app
```

Force uninstall system app (requires root):
```sh
adb shell pm uninstall --user 0 com.system.app
```

Uninstall for specific user:
```sh
adb shell pm uninstall --user 10 com.example.app
```

Disable app instead of uninstall:
```sh
adb shell pm disable-user com.example.app
```

Re-enable disabled app:
```sh
adb shell pm enable com.example.app
```

Uninstall multiple apps:
```sh
adb uninstall com.app1 com.app2 com.app3
```

Check if app is installed before uninstall:
```sh
adb shell pm list packages | grep com.example.app
```

Get uninstall reason:
```sh
adb shell dumpsys package com.example.app | grep "installReason"
```

Remove app from all users:
```sh
for user in $(adb shell pm list users | awk '{print $1}' | cut -d: -f2); do
    adb shell pm uninstall --user $user com.example.app
done
```

Clear app data instead of uninstall:
```sh
adb shell pm clear com.example.app
```

Hide app from launcher (requires root):
```sh
adb shell pm hide com.example.app
```

Unhide app (requires root):
```sh
adb shell pm unhide com.example.app
```

### Examples

Safe uninstall script:
```sh
#!/bin/bash
PACKAGE="com.example.app"

# Check if app is installed
if adb shell pm list packages | grep -q "$PACKAGE"; then
    echo "Uninstalling $PACKAGE..."
    adb uninstall "$PACKAGE"
    
    # Verify uninstallation
    if adb shell pm list packages | grep -q "$PACKAGE"; then
        echo "✗ Uninstallation failed"
    else
        echo "✓ Uninstallation successful"
    fi
else
    echo "App $PACKAGE is not installed"
fi
```

Batch uninstall with confirmation:
```sh
#!/bin/bash
APPS=("com.example.app1" "com.example.app2" "com.example.app3")

for app in "${APPS[@]}"; do
    if adb shell pm list packages | grep -q "$app"; then
        echo "Uninstalling $app? (y/n)"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            adb uninstall "$app"
            echo "✓ $app uninstalled"
        fi
    else
        echo "$app is not installed"
    fi
done
```

System app removal (root required):
```sh
#!/bin/bash
SYSTEM_APP="com.system.bloatware"

# Check if system app exists
if adb shell pm list packages | grep -q "$SYSTEM_APP"; then
    echo "Removing system app: $SYSTEM_APP"
    
    # Try to uninstall for user 0
    adb shell pm uninstall --user 0 "$SYSTEM_APP"
    
    # If that fails, try to disable
    if adb shell pm list packages | grep -q "$SYSTEM_APP"; then
        echo "Uninstall failed, trying to disable..."
        adb shell pm disable-user "$SYSTEM_APP"
        echo "✓ App disabled"
    else
        echo "✓ System app removed"
    fi
else
    echo "System app not found"
fi
```

## Notes
- Use `-k` flag to keep app data and cache
- System apps cannot be fully uninstalled without root
- Use `disable-user` to hide system apps without root
- Uninstallation is permanent for user apps
- Some pre-installed apps may require special permissions to remove
- Always verify package name before uninstalling
- Disabling apps is reversible, uninstalling is not
