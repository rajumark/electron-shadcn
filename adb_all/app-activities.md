# App Activities - ADB Commands

## Description
Commands for managing Android application activities, including launching, controlling, and debugging activity lifecycle.

### Basic Commands

Launch app:
```sh
adb shell am start -n com.example.app/.MainActivity
```

Launch app by package:
```sh
adb shell monkey -p com.example.app -c android.intent.category.LAUNCHER 1
```

Force stop app:
```sh
adb shell am force-stop com.example.app
```

### Advanced Commands

Launch activity with intent:
```sh
adb shell am start -a android.intent.action.VIEW -d http://example.com
```

Launch activity with extras:
```sh
adb shell am start -n com.example.app/.DetailActivity -e id 123 -e name "Example"
```

Launch activity with flags:
```sh
adb shell am start -n com.example.app/.MainActivity --activity-clear-top
```

Launch activity with specific action:
```sh
adb shell am start -a com.example.app.CUSTOM_ACTION
```

Get current activity:
```sh
adb shell dumpsys activity activities | grep "mFocusedActivity"
```

List all activities for app:
```sh
adb shell pm list packages -f | grep com.example.app
```

Get activity stack info:
```sh
adb shell dumpsys activity activities
```

Start activity with result:
```sh
adb shell am start -n com.example.app/.ResultActivity --ez result true
```

Launch activity in new task:
```sh
adb shell am start -n com.example.app/.MainActivity --activity-new-task
```

Get activity lifecycle info:
```sh
adb shell dumpsys activity top | grep "ACTIVITY"
```

Launch activity with URI:
```sh
adb shell am start -d "content://com.example.app/data/123"
```

Start activity with MIME type:
```sh
adb shell am start -t "image/jpeg" -d "/sdcard/image.jpg"
```

Launch activity with component:
```sh
adb shell am start -c com.example.app/.MainActivity
```

### Examples

Activity launch script:
```sh
#!/bin/bash
PACKAGE="com.example.app"
ACTIVITY="MainActivity"

echo "=== Launching Activity ==="
echo "Starting $ACTIVITY from $PACKAGE..."

# Launch activity
adb shell am start -n "$PACKAGE/.$ACTIVITY"

# Check if launched
sleep 2
CURRENT_ACTIVITY=$(adb shell dumpsys activity activities | grep "mFocusedActivity" | grep -o "[^/]*$")
echo "Current activity: $CURRENT_ACTIVITY"
```

Activity testing script:
```sh
#!/bin/bash
PACKAGE="com.example.app"

echo "=== Activity Testing ==="

# Test main activity
echo "Testing main activity..."
adb shell am start -n "$PACKAGE/.MainActivity"
sleep 2

# Test detail activity with data
echo "Testing detail activity with data..."
adb shell am start -n "$PACKAGE/.DetailActivity" -e id 123 -e name "Test Item"
sleep 2

# Test settings activity
echo "Testing settings activity..."
adb shell am start -n "$PACKAGE/.SettingsActivity"
sleep 2

# Return to main
echo "Returning to main activity..."
adb shell am start -n "$PACKAGE/.MainActivity" --activity-clear-top
```

Activity debugging script:
```sh
#!/bin/bash
PACKAGE="com.example.app"

echo "=== Activity Debugging ==="

# Get current activity
echo "Current focused activity:"
adb shell dumpsys activity activities | grep "mFocusedActivity"

# Get activity stack
echo -e "\nActivity stack:"
adb shell dumpsys activity activities | grep -A 5 "ActivityStack"

# Get task info
echo -e "\nTask information:"
adb shell dumpsys activity activities | grep -A 3 "TaskRecord"

# Check for activity-related errors
echo -e "\nRecent activity errors:"
adb logcat -d -v time | grep -i "$PACKAGE" | grep -i "activity" | tail -5
```

Complete activity lifecycle test:
```sh
#!/bin/bash
PACKAGE="com.example.app"

echo "=== Activity Lifecycle Test ==="

# Clear logcat
adb logcat -c

# Start activity
echo "Starting activity..."
adb shell am start -n "$PACKAGE/.MainActivity"

# Monitor lifecycle events
echo "Monitoring lifecycle events (10 seconds)..."
adb logcat -s "ActivityManager" | grep "$PACKAGE" &
LOGCAT_PID=$!

sleep 10

# Stop monitoring
kill $LOGCAT_PID

# Force stop
echo "Force stopping app..."
adb shell am force-stop "$PACKAGE"

echo "Lifecycle test completed"
```

Activity launch with various data types:
```sh
#!/bin/bash
PACKAGE="com.example.app"

echo "=== Testing Activity with Different Data Types ==="

# Launch with string extra
echo "Launching with string extra..."
adb shell am start -n "$PACKAGE/.DetailActivity" -e message "Hello World"

sleep 2

# Launch with integer extra
echo "Launching with integer extra..."
adb shell am start -n "$PACKAGE/.DetailActivity" -e count 42

sleep 2

# Launch with boolean extra
echo "Launching with boolean extra..."
adb shell am start -n "$PACKAGE/.DetailActivity" -e enabled true

sleep 2

# Launch with array extra
echo "Launching with array extra..."
adb shell am start -n "$PACKAGE/.DetailActivity" --eia items 1,2,3,4,5
```

## Notes
- Activity names are case-sensitive
- Use `--activity-clear-top` to clear activity stack
- Activities must be exported in AndroidManifest.xml to be launchable via ADB
- Some activities may require specific permissions
- Use `dumpsys activity activities` for comprehensive activity information
- Force stop clears all activities and services
- Activity lifecycle events are logged in logcat
- Some activities may not respond to certain intent extras
