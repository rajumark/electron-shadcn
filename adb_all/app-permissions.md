# App Permissions - ADB Commands

## Description
Commands for managing Android application permissions, granting, revoking, and monitoring permission states.

### Basic Commands

List app permissions:
```sh
adb shell pm list permissions
```

Show permissions for specific app:
```sh
adb shell pm list permissions -d com.example.app
```

Grant permission to app:
```sh
adb shell pm grant com.example.app android.permission.CAMERA
```

Revoke permission from app:
```sh
adb shell pm revoke com.example.app android.permission.CAMERA
```

### Advanced Commands

List dangerous permissions only:
```sh
adb shell pm list permissions -d -g
```

List permissions by group:
```sh
adb shell pm list permissions -g
```

Check if app has specific permission:
```sh
adb shell pm has-permission com.example.app android.permission.CAMERA
```

Grant all permissions to app:
```sh
adb shell pm grant com.example.app $(adb shell pm list permissions | grep -E 'dangerous' | cut -d: -f2)
```

Revoke all dangerous permissions:
```sh
adb shell pm revoke com.example.app $(adb shell pm list permissions -d | cut -d: -f2)
```

Show permission details:
```sh
adb shell pm list permissions -f android.permission.CAMERA
```

Get permission protection level:
```sh
adb shell dumpsys package com.example.app | grep -A 5 "requested permissions"
```

Grant runtime permissions:
```sh
adb shell pm grant com.example.app android.permission.ACCESS_FINE_LOCATION
```

Set permission flags:
```sh
adb shell pm set-permission-flags com.example.app android.permission.CAMERA revoked
```

Clear permission flags:
```sh
adb shell pm clear-permission-flags com.example.app android.permission.CAMERA revoked
```

List app permissions with status:
```sh
adb shell dumpsys package com.example.app | grep -A 100 "requested permissions"
```

Grant permission for specific user:
```sh
adb shell pm --user 10 grant com.example.app android.permission.CAMERA
```

Check permission grant state:
```sh
adb shell dumpsys package com.example.app | grep "android.permission.CAMERA"
```

### Examples

Permission management script:
```sh
#!/bin/bash
PACKAGE="com.example.app"
PERMISSION="android.permission.CAMERA"

echo "=== Permission Management for $PACKAGE ==="

# Check current status
if adb shell pm has-permission "$PACKAGE" "$PERMISSION"; then
    echo "✓ $PERMISSION is granted"
else
    echo "✗ $PERMISSION is not granted"
fi

# Grant permission
echo "Granting $PERMISSION..."
adb shell pm grant "$PACKAGE" "$PERMISSION"

# Verify
if adb shell pm has-permission "$PACKAGE" "$PERMISSION"; then
    echo "✓ Permission granted successfully"
else
    echo "✗ Failed to grant permission"
fi
```

Grant all dangerous permissions:
```sh
#!/bin/bash
PACKAGE="com.example.app"

echo "Granting all dangerous permissions to $PACKAGE..."
DANGEROUS_PERMISSIONS=$(adb shell pm list permissions -d | cut -d: -f2)

for permission in $DANGEROUS_PERMISSIONS; do
    echo "Granting $permission..."
    adb shell pm grant "$PACKAGE" "$permission"
done

echo "All dangerous permissions granted"
```

Permission audit script:
```sh
#!/bin/bash
PACKAGE="com.example.app"

echo "=== Permission Audit for $PACKAGE ==="
adb shell dumpsys package "$PACKAGE" | grep -A 200 "requested permissions" | grep -E "android\.permission|granted="
```

Bulk permission management:
```sh
#!/bin/bash
# Grant camera permission to all camera apps
CAMERA_APPS=$(adb shell pm list packages | grep -i camera | sed 's/package://')

for app in $CAMERA_APPS; do
    echo "Granting camera permission to $app..."
    adb shell pm grant "$app" android.permission.CAMERA
done
```

## Notes
- Some permissions require special handling (e.g., system permissions)
- Not all permissions can be granted/revoked programmatically
- User interaction may be required for some permissions
- Permission behavior varies between Android versions
- Use `has-permission` to check current permission state
- Some apps may crash if certain permissions are revoked
- System apps may have different permission handling
