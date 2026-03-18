# Enterprise Management - ADB Commands

## Description
Commands for enterprise device management, corporate policies, and business device administration.

### Basic Commands
Set device owner:
```sh
adb shell dpm set-device-owner com.example.mdm/.DeviceAdminReceiver
```

Check device admin status:
```sh
adb shell dpm list-active-admins
```

Set work profile:
```sh
adb shell dpm set-profile-owner com.example.mdm/.ProfileAdminReceiver
```

Check device policies:
```sh
adb shell dumpsys device_policy
```

### Advanced Commands
Enterprise device setup:
```sh
#!/bin/bash
echo "Setting up enterprise device..."
adb shell dpm set-device-owner com.example.mdm/.DeviceAdminReceiver
adb shell dpm set-password-quality com.example.mdm/.DeviceAdminReceiver 65536
adb shell dpm set-password-minimum-length com.example.mdm/.DeviceAdminReceiver 8
echo "Enterprise setup complete"
```

Configure security policies:
```sh
adb shell dpm set-camera-disabled com.example.mdm/.DeviceAdminReceiver true
adb shell dpm set-keyguard-disabled com.example.mdm/.DeviceAdminReceiver false
adb shell dpm set-screen-capture-disabled com.example.mdm/.DeviceAdminReceiver true
```

Network policy management:
```sh
adb shell dpm set-permitted-accessibility-services com.example.mdm/.DeviceAdminReceiver com.example.accessibility
adb shell dpm set-permitted-input-methods com.example.mdm/.DeviceAdminReceiver com.example.keyboard
```

App management policies:
```sh
adb shell dpm set-user-restriction com.example.mdm/.DeviceAdminReceiver no_install_unknown_sources true
adb shell dpm set-user-restriction com.example.mdm/.DeviceAdminReceiver ensure_verify_apps true
```

Work profile management:
```sh
adb shell dpm set-profile-owner com.example.mdm/.ProfileAdminReceiver
adb shell dpm clear-cross-profile-intent-filters com.example.mdm/.ProfileAdminReceiver
```

Device compliance checking:
```sh
adb shell dpm is-active-admin com.example.mdm/.DeviceAdminReceiver
adb shell dpm get-password-quality com.example.mdm/.DeviceAdminReceiver
adb shell dpm get-password-minimum-length com.example.mdm/.DeviceAdminReceiver
```

Enterprise app deployment:
```sh
adb install enterprise_app.apk
adb shell dpm set-active-admin com.enterprise.app/.AdminReceiver
```

Device monitoring:
```sh
adb shell dumpsys activity | grep com.example.mdm
adb shell logcat | grep -E "MDM|enterprise|policy"
```

## Notes
- Enterprise management requires device admin privileges
- Some policies may require specific Android versions
- Test enterprise policies on sample devices
- Document all enterprise configurations
- Ensure compliance with corporate security standards
