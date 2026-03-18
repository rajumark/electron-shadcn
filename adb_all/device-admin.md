# Device Admin - ADB Commands

## Description
Commands for managing device administrator policies, admin apps, and enterprise security controls on Android devices.

### Basic Commands

List device admin apps:
```sh
adb shell dumpsys device_policy | grep -E "Admin|Package"
```

Check active device admins:
```sh
adb shell dpm list-active-admins
```

Check device owner:
```sh
adb shell dpm list-owners
```

Remove device admin (requires deactivation first):
```sh
adb shell dpm remove-active-admin com.example.app/.Receiver
```

Check admin policies:
```sh
adb shell dumpsys device_policy | grep -E "policy|restriction"
```

### Advanced Commands

Set device owner:
```sh
adb shell dpm set-device-owner com.example.app/.Receiver
```

Clear device owner:
```sh
adb shell dpm clear-device-owner com.example.app/.Receiver
```

Check admin permissions:
```sh
adb shell dumpsys package com.example.app | grep -E "permission|admin"
```

Set profile owner:
```sh
adb shell dpm set-profile-owner com.example.app/.Receiver
```

Check security policies:
```sh
adb shell dpm get-policy
```

Set password policy:
```sh
adb shell dpm set-password-quality com.example.app/.Receiver 65536
```

Check password requirements:
```sh
adb shell dpm get-password-quality com.example.app/.Receiver
```

Force lock device:
```sh
adb shell dpm force-lock com.example.app/.Receiver
```

Check admin status:
```sh
adb shell dpm is-active-admin com.example.app/.Receiver
```

Set camera disabled:
```sh
adb shell dpm set-camera-disabled com.example.app/.Receiver true
```

Check camera policy:
```sh
adb shell dpm get-camera-disabled com.example.app/.Receiver
```

Reset password with token:
```sh
adb shell dpm reset-password com.example.app/.Receiver "newpassword" token
```

### Examples

List all active device admins:
```sh
adb shell dpm list-active-admins
```

Check if app is device admin:
```sh
adb shell dpm is-active-admin com.example.app/.Receiver
```

Remove device admin:
```sh
adb shell dpm remove-active-admin com.example.app/.Receiver
```

Check device owner:
```sh
adb shell dpm list-owners
```

Set password requirements:
```sh
adb shell dpm set-password-quality com.example.app/.Receiver 65536
adb shell dpm set-password-minimum-length com.example.app/.Receiver 8
```

Force device lock:
```sh
adb shell dpm force-lock com.example.app/.Receiver
```

Check admin policies:
```sh
adb shell dumpsys device_policy | grep -E "policy|restriction"
```

## Notes
- Device admin commands require appropriate permissions
- Some operations require device owner privileges
- Removing device admin may require user confirmation
- Device owner can only be set on unprovisioned devices
- Admin policies vary by Android version
- Use caution when modifying device admin settings
- Some commands may not work on consumer devices
- Device admin affects device security and functionality
