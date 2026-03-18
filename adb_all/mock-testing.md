# Mock Testing - ADB Commands

## Description
Commands for mock testing Android applications, using mock data and services, and testing with simulated environments.

### Basic Commands

Set mock location:
```sh
adb shell settings put secure mock_location 1
```

Send mock GPS coordinates:
```sh
adb shell emu geo fix 37.7749 -122.4194
```

Mock network status:
```sh
adb shell svc data disable
adb shell svc wifi disable
```

Set mock date/time:
```sh
adb shell su -c "date -s '2024-01-01 12:00:00'"
```

Check mock status:
```sh
adb shell settings get secure mock_location
```

### Advanced Commands

Mock server setup:
```sh
adb shell am startservice -n com.example.app/.MockServerService
adb shell am startservice -n com.example.app/.MockDataService
```

Mock API responses:
```sh
adb shell am broadcast -a com.example.MOCK_RESPONSE -e endpoint "users" -e response '[{"id":1,"name":"test"}]'
```

Mock database operations:
```sh
adb shell am startservice -n com.example.app/.MockDatabaseService
adb shell content insert --uri content://com.example.mock.provider/users --bind name:s:MockUser --bind email:s:mock@test.com
```

Mock network conditions:
```sh
adb shell svc wifi disable
adb shell am broadcast -a com.example.MOCK_NETWORK_OFFLINE
# Test offline behavior
adb shell svc wifi enable
```

Mock device sensors:
```sh
adb shell am broadcast -a com.example.MOCK_SENSOR_DATA -e sensor "accelerometer" -e x:0.0 -e y:0.0 -e z:9.8
```

Mock user interactions:
```sh
adb shell am broadcast -a com.example.MOCK_USER_INPUT -e action "login" -e username "mock_user" -e password "mock_pass"
```

Mock file system:
```sh
adb shell mkdir -p /sdcard/mock_data
adb shell echo "mock_content" > /sdcard/mock_data/test_file.txt
adb shell am broadcast -a com.example.MOCK_FILE_READY -e path "/sdcard/mock_data/test_file.txt"
```

Mock Bluetooth devices:
```sh
adb shell am broadcast -a com.example.MOCK_BLUETOOTH_DEVICE -e address "AA:BB:CC:DD:EE:FF" -e name "MockDevice"
```

Mock camera capture:
```sh
adb shell am broadcast -a com.example.MOCK_CAMERA_CAPTURE -e image_path "/sdcard/mock_image.jpg"
```

Mock push notifications:
```sh
adb shell am broadcast -a com.example.MOCK_NOTIFICATION -e title "Mock Title" -e body "Mock Message"
```

Mock authentication:
```sh
adb shell am broadcast -a com.example.MOCK_AUTH_SUCCESS -e token "mock_token_123" -e user_id "mock_user_456"
```

Mock storage conditions:
```sh
adb shell am broadcast -a com.example.MOCK_STORAGE_FULL -e available_space 0
# Test low storage behavior
adb shell am broadcast -a com.example.MOCK_STORAGE_NORMAL -e available_space 1000000000
```

### Examples

Mock location testing:
```sh
adb shell settings put secure mock_location 1
adb shell emu geo fix 37.7749 -122.4194
adb shell am start -n com.example.app/.LocationActivity
sleep 3
adb shell emu geo fix 40.7128 -74.0060
```

Mock network testing:
```sh
adb shell svc data disable
adb shell am start -n com.example.app/.NetworkActivity
sleep 5
adb shell svc data enable
```

Mock API testing:
```sh
adb shell am broadcast -a com.example.MOCK_API_RESPONSE -e endpoint "users" -e response '[{"id":1,"name":"Test User"}]'
adb shell am start -n com.example.app/.ApiActivity
```

Mock authentication flow:
```sh
adb shell am broadcast -a com.example.MOCK_AUTH_SUCCESS -e token "mock_token" -e user_id "123"
adb shell am start -n com.example.app/.LoginActivity
```

Complete mock testing setup:
```sh
#!/bin/bash
echo "=== Mock Testing Setup ==="

# Enable mock location
adb shell settings put secure mock_location 1

# Mock GPS
adb shell emu geo fix 37.7749 -122.4194

# Mock network
adb shell am broadcast -a com.example.MOCK_NETWORK_OFFLINE

# Mock authentication
adb shell am broadcast -a com.example.MOCK_AUTH_SUCCESS -e token "mock_token"

# Start app with mocks
adb shell am start -n com.example.app/.MainActivity

echo "Mock testing environment ready"
```

## Notes
- Mock testing requires app support for mock data
- Mock location may require developer options enabled
- Some mock features require root access
- Mock testing should be isolated from production
- Use consistent mock data for reproducible tests
- Document mock testing procedures
- Mock testing speeds up development cycles
- Clean up mock data after testing
