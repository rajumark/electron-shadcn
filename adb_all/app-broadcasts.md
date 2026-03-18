# App Broadcasts - ADB Commands

## Description
Commands for sending and managing Android broadcast intents, including system broadcasts and custom application broadcasts.

### Basic Commands

Send broadcast:
```sh
adb shell am broadcast -a android.intent.action.BOOT_COMPLETED
```

Send broadcast to specific app:
```sh
adb shell am broadcast -a com.example.app.CUSTOM_ACTION
```

Send broadcast with extras:
```sh
adb shell am broadcast -a com.example.app.UPDATE -e status "success"
```

### Advanced Commands

Send broadcast with component:
```sh
adb shell am broadcast -c com.example.app/.Receiver
```

Send broadcast with URI:
```sh
adb shell am broadcast -a android.intent.action.VIEW -d "http://example.com"
```

Send broadcast with MIME type:
```sh
adb shell am broadcast -t "text/plain" -e message "Hello"
```

Send ordered broadcast:
```sh
adb shell am broadcast --receiver-foreground -a com.example.app.ORDERED
```

Send broadcast with flags:
```sh
adb shell am broadcast -a com.example.app.FLAG_TEST --receiver-include-background
```

Send sticky broadcast (deprecated):
```sh
adb shell am broadcast --sticky -a com.example.app.STICKY
```

Send broadcast to specific user:
```sh
adb shell am broadcast --user 10 -a com.example.app.USER_SPECIFIC
```

Send system broadcast:
```sh
adb shell am broadcast -a android.intent.action.TIME_SET
```

Send broadcast with multiple extras:
```sh
adb shell am broadcast -a com.example.app.MULTI -e id 123 -e name "Test" -e enabled true
```

Send broadcast with array extras:
```sh
adb shell am broadcast -a com.example.app.ARRAY --eia numbers 1,2,3,4,5
```

Send broadcast with intent URI:
```sh
adb shell am broadcast -a android.intent.action.VIEW -d "content://contacts/people/1"
```

Send broadcast and wait for completion:
```sh
adb shell am broadcast -a com.example.app.SYNC --receiver-foreground
```

### Examples

Broadcast testing script:
```sh
#!/bin/bash
PACKAGE="com.example.app"

echo "=== Broadcast Testing for $PACKAGE ==="

# Test custom broadcast
echo "Sending custom broadcast..."
adb shell am broadcast -a "$PACKAGE.CUSTOM_ACTION" -e message "Test Message"

# Test broadcast with different data types
echo "Sending broadcast with integer extra..."
adb shell am broadcast -a "$PACKAGE.UPDATE" -e count 42

echo "Sending broadcast with boolean extra..."
adb shell am broadcast -a "$PACKAGE.STATUS" -e enabled true
```

System broadcast simulation:
```sh
#!/bin/bash

echo "=== System Broadcast Simulation ==="

# Simulate battery low
echo "Simulating battery low..."
adb shell am broadcast -a android.intent.action.BATTERY_LOW

# Simulate time change
echo "Simulating time set..."
adb shell am broadcast -a android.intent.action.TIME_SET

# Simulate package replaced
echo "Simulating package replaced..."
adb shell am broadcast -a android.intent.action.PACKAGE_REPLACED -e package com.example.app

# Simulate connectivity change
echo "Simulating connectivity change..."
adb shell am broadcast -a android.net.conn.CONNECTIVITY_CHANGE
```

Broadcast debugging script:
```sh
#!/bin/bash
PACKAGE="com.example.app"

echo "=== Broadcast Debugging ==="

# Clear logcat
adb logcat -c

# Send test broadcast
echo "Sending test broadcast..."
adb shell am broadcast -a "$PACKAGE.TEST_BROADCAST" -e test_id 123

# Monitor broadcast reception
echo "Monitoring broadcast reception (5 seconds)..."
adb logcat -s "BroadcastReceiver" | grep "$PACKAGE" &
LOGCAT_PID=$!

sleep 5

# Stop monitoring
kill $LOGCAT_PID

# Check broadcast queue
echo "Broadcast queue status:"
adb shell dumpsys activity broadcasts | grep "$PACKAGE"
```

Complete broadcast workflow:
```sh
#!/bin/bash
PACKAGE="com.example.app"

echo "=== Complete Broadcast Workflow ==="

# Step 1: Send initialization broadcast
echo "Sending initialization broadcast..."
adb shell am broadcast -a "$PACKAGE.INIT" -e timestamp $(date +%s)

# Step 2: Send configuration broadcast
echo "Sending configuration broadcast..."
adb shell am broadcast -a "$PACKAGE.CONFIG" -e debug true -e level "verbose"

# Step 3: Send data update broadcast
echo "Sending data update broadcast..."
adb shell am broadcast -a "$PACKAGE.DATA_UPDATE" --eia items 1,2,3,4,5

# Step 4: Monitor results
echo "Monitoring broadcast results..."
adb logcat -s "$PACKAGE" | head -10

# Step 5: Send cleanup broadcast
echo "Sending cleanup broadcast..."
adb shell am broadcast -a "$PACKAGE.CLEANUP"
```

Broadcast stress testing:
```sh
#!/bin/bash
PACKAGE="com.example.app"

echo "=== Broadcast Stress Testing ==="

for i in {1..100}; do
    echo "Sending broadcast $i..."
    adb shell am broadcast -a "$PACKAGE.STRESS_TEST" -e iteration $i -e timestamp $(date +%s)
    
    if [ $((i % 10)) -eq 0 ]; then
        echo "Sent $i broadcasts, checking system status..."
        adb shell dumpsys activity broadcasts | grep "$PACKAGE" | wc -l
    fi
done

echo "Stress test completed"
```

## Notes
- Broadcasts must be registered in AndroidManifest.xml or dynamically
- Some system broadcasts are protected and require system permissions
- Use ordered broadcasts for sequential processing
- Sticky broadcasts are deprecated in Android 5.0+
- Background app restrictions affect broadcast reception
- Use explicit component names for better security
- Monitor logcat for broadcast delivery confirmation
- Some broadcasts may be filtered by system
