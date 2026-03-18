# Integration Testing - ADB Commands

## Description
Commands for integration testing Android applications, testing component interactions, and managing integration test execution.

### Basic Commands

Run integration tests:
```sh
adb shell am instrument -w com.example.app.integration.test/androidx.test.runner.AndroidJUnitRunner
```

Test app component interactions:
```sh
adb shell am instrument -w -e package com.example.app.integration com.example.app.test/androidx.test.runner.AndroidJUnitRunner
```

Test service integration:
```sh
adb shell am startservice -n com.example.app/.TestService
adb shell am instrument -w com.example.app.integration.test/androidx.test.runner.AndroidJUnitRunner
```

Test database integration:
```sh
adb shell am instrument -w -e class com.example.app.DatabaseIntegrationTest com.example.app.test/androidx.test.runner.AndroidJUnitRunner
```

Check integration test status:
```sh
adb shell dumpsys activity | grep -E "integration|component"
```

### Advanced Commands

Test API integration:
```sh
adb shell am instrument -w -e class com.example.app.ApiIntegrationTest com.example.app.test/androidx.test.runner.AndroidJUnitRunner
```

Test network integration:
```sh
adb shell am instrument -w -e networkTests true com.example.app.integration.test/androidx.test.runner.AndroidJUnitRunner
```

Test content provider integration:
```sh
adb shell am instrument -w -e class com.example.app.ContentProviderTest com.example.app.test/androidx.test.runner.AndroidJUnitRunner
```

Test broadcast integration:
```sh
adb shell am instrument -w -e class com.example.app.BroadcastTest com.example.app.test/androidx.test.runner.AndroidJUnitRunner
```

Test multi-app integration:
```sh
adb shell am instrument -w -e multiApp true com.example.app.integration.test/androidx.test.runner.AndroidJUnitRunner
```

Test background service integration:
```sh
adb shell am startservice -n com.example.app/.BackgroundService
adb shell am instrument -w com.example.app.integration.test/androidx.test.runner.AndroidJUnitRunner
```

Test permission integration:
```sh
adb shell am instrument -w -e permissionTests true com.example.app.integration.test/androidx.test.runner.AndroidJUnitRunner
```

Test storage integration:
```sh
adb shell am instrument -w -e storageTests true com.example.app.integration.test/androidx.test.runner.AndroidJUnitRunner
```

Test UI component integration:
```sh
adb shell am instrument -w -e uiIntegration true com.example.app.integration.test/androidx.test.runner.AndroidJUnitRunner
```

Test third-party library integration:
```sh
adb shell am instrument -w -e libraryTests true com.example.app.integration.test/androidx.test.runner.AndroidJUnitRunner
```

Monitor integration test logs:
```sh
adb shell logcat | grep -E "Integration|component|service|database"
```

### Examples

Run complete integration test suite:
```sh
adb shell am instrument -w com.example.app.integration.test/androidx.test.runner.AndroidJUnitRunner
```

Test database integration:
```sh
adb shell am instrument -w -e class com.example.app.DatabaseIntegrationTest com.example.app.test/androidx.test.runner.AndroidJUnitRunner
```

Test API integration:
```sh
adb shell am instrument -w -e class com.example.app.ApiIntegrationTest com.example.app.test/androidx.test.runner.AndroidJUnitRunner
```

Monitor integration test execution:
```sh
adb shell logcat | grep -E "Integration|component|service" | tail -20
```

Test network integration:
```sh
adb shell am instrument -w -e networkTests true com.example.app.integration.test/androidx.test.runner.AndroidJUnitRunner
```

## Notes
- Integration tests require multiple app components
- Test environment should mimic production setup
- Network tests may require network connectivity
- Database tests may require test database setup
- Integration tests take longer than unit tests
- Monitor system resources during integration testing
- Some integration tests may require specific permissions
- Test data should be isolated from production data
