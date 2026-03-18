# App Components - ADB Commands

## Description
Commands for managing Android application components including activities, services, broadcast receivers, and content providers.

### Basic Commands

List all app components:
```sh
adb shell pm dump com.example.app
```

Get component info:
```sh
adb shell dumpsys package com.example.app
```

Check if component is enabled:
```sh
adb shell pm list packages -e com.example.app
```

### Advanced Commands

Enable specific component:
```sh
adb shell pm enable com.example.app/.MyActivity
```

Disable specific component:
```sh
adb shell pm disable com.example.app/.MyActivity
```

Enable component for specific user:
```sh
adb shell pm --user 10 enable com.example.app/.MyActivity
```

Grant component permission:
```sh
adb shell pm grant com.example.app android.permission.INTERACT_ACROSS_USERS
```

Revoke component permission:
```sh
adb shell pm revoke com.example.app android.permission.INTERACT_ACROSS_USERS
```

List content providers:
```sh
adb shell dumpsys activity providers | grep com.example.app
```

Query content provider:
```sh
adb shell content query --uri content://com.example.app.provider/data
```

Insert into content provider:
```sh
adb shell content insert --uri content://com.example.app.provider/data --bind name:s:"Test" --bind value:i:123
```

Update content provider:
```sh
adb shell content update --uri content://com.example.app.provider/data/1 --bind value:i:456
```

Delete from content provider:
```sh
adb shell content delete --uri content://com.example.app.provider/data/1
```

Call content provider method:
```sh
adb shell content call --uri content://com.example.app.provider/data --method customMethod
```

Get component resolution info:
```sh
adb shell pm resolve-activity --components com.example.app
```

Check component intent filters:
```sh
adb shell dumpsys package com.example.app | grep -A 10 "intent-filter"
```

### Examples

Component management script:
```sh
#!/bin/bash
PACKAGE="com.example.app"

echo "=== Component Management for $PACKAGE ==="

# List all components
echo "Listing all components..."
adb shell dumpsys package "$PACKAGE" | grep -E "Activity|Service|Receiver|Provider"

# Enable/disable specific components
echo "Enabling debug activity..."
adb shell pm enable "$PACKAGE/.DebugActivity"

echo "Disabling telemetry service..."
adb shell pm disable "$PACKAGE/.TelemetryService"

# Check component status
echo "Component status:"
adb shell dumpsys package "$PACKAGE" | grep -E "enabled|disabled"
```

Content provider interaction script:
```sh
#!/bin/bash
PACKAGE="com.example.app"

echo "=== Content Provider Interaction ==="

# Query data
echo "Querying data..."
adb shell content query --uri "content://$PACKAGE.provider/data"

# Insert data
echo "Inserting data..."
adb shell content insert --uri "content://$PACKAGE.provider/data" \
    --bind name:s:"Test Item" \
    --bind value:i:123 \
    --bind enabled:b:true

# Update data
echo "Updating data..."
adb shell content update --uri "content://$PACKAGE.provider/data/1" \
    --bind value:i:456

# Delete data
echo "Deleting data..."
adb shell content delete --uri "content://$PACKAGE.provider/data/1"
```

Component debugging script:
```sh
#!/bin/bash
PACKAGE="com.example.app"

echo "=== Component Debugging ==="

# Get detailed component info
echo "Component details:"
adb shell dumpsys package "$PACKAGE" | grep -A 20 "AndroidManifest.xml"

# Check component resolution
echo "Intent resolution:"
adb shell pm resolve-activity --components "$PACKAGE"

# Check content providers
echo "Content providers:"
adb shell dumpsys activity providers | grep "$PACKAGE"

# Check for component errors
echo "Component errors:"
adb logcat -d -v time | grep -i "$PACKAGE" | grep -i "component" | tail -5
```

Complete component test:
```sh
#!/bin/bash
PACKAGE="com.example.app"

echo "=== Complete Component Test ==="

# Test activities
echo "Testing activities..."
adb shell am start -n "$PACKAGE/.MainActivity"
adb shell am start -n "$PACKAGE/.DetailActivity" -e id 123

# Test services
echo "Testing services..."
adb shell am startservice "$PACKAGE/.BackgroundService"

# Test broadcasts
echo "Testing broadcasts..."
adb shell am broadcast -a "$PACKAGE.TEST_BROADCAST" -e test true

# Test content providers
echo "Testing content providers..."
adb shell content query --uri "content://$PACKAGE.provider/test"

# Monitor component lifecycle
echo "Monitoring component lifecycle..."
adb logcat -s "ActivityManager" | grep "$PACKAGE" &
LOGCAT_PID=$!

sleep 10

kill $LOGCAT_PID

echo "Component test completed"
```

Component security audit:
```sh
#!/bin/bash
PACKAGE="com.example.app"

echo "=== Component Security Audit ==="

# Check exported components
echo "Exported components:"
adb shell dumpsys package "$PACKAGE" | grep -A 5 "exported=true"

# Check permission requirements
echo "Permission requirements:"
adb shell dumpsys package "$PACKAGE" | grep -A 3 "uses-permission"

# Check intent filters
echo "Intent filters:"
adb shell dumpsys package "$PACKAGE" | grep -A 10 "intent-filter"

# Check content provider permissions
echo "Content provider permissions:"
adb shell dumpsys activity providers | grep "$PACKAGE" | grep -i "permission"
```

## Notes
- Components must be declared in AndroidManifest.xml
- Exported components can be accessed by other apps
- Use `pm enable/disable` to control component availability
- Content providers require proper URI format
- Some operations may require special permissions
- Component state affects app functionality
- Use `dumpsys` for comprehensive component information
- Security considerations apply to exported components
