# Lock Screen - ADB Commands

## Description
Commands for managing lock screen settings, bypassing lock screen, and lock screen security operations.

### Basic Commands

Check lock screen status:
```sh
adb shell dumpsys window | grep -E "mDreamingLockscreen|mShowingLockscreen"
```

Check screen is on:
```sh
adb shell dumpsys power | grep -E "mScreenOn|mWakefulness"
```

Unlock device (requires insecure lock):
```sh
adb shell input keyevent KEYCODE_MENU
```

Wake up device:
```sh
adb shell input keyevent KEYCODE_WAKEUP
```

Check lock screen type:
```sh
adb shell dumpsys window | grep -E "mKeyguard.*showing"
```

### Advanced Commands

Check lock screen security:
```sh
adb shell dumpsys trust | grep -E "trust|locked"
```

Disable lock screen (root):
```sh
adb shell su -c "pm disable com.android.keyguard"
```

Enable lock screen (root):
```sh
adb shell su -c "pm enable com.android.keyguard"
```

Check password quality:
```sh
adb shell locksettings get-password-quality
```

Check lock screen settings:
```sh
adb shell settings get secure lockscreen
```

Clear lock credentials (root):
```sh
adb shell su -c "rm -rf /data/system/gesture.key"
adb shell su -c "rm -rf /data/system/password.key"
```

Check smart lock status:
```sh
adb shell dumpsys trust | grep -E "enabled|disabled"
```

Monitor lock screen events:
```sh
adb shell logcat | grep -E "lockscreen|keyguard"
```

Check device admin policies:
```sh
adb shell dumpsys device_policy | grep -E "password|lock"
```

Force unlock (development builds):
```sh
adb shell wm dismiss-keyguard
```

Check biometric lock status:
```sh
adb shell dumpsys fingerprint | grep -E "enrolled|active"
```

Set lock screen timeout:
```sh
adb shell settings put secure lock_screen_lock_after_timeout 5000
```

### Examples

Check if device is locked:
```sh
adb shell dumpsys window | grep -E "mDreamingLockscreen|mShowingLockscreen"
```

Wake up and unlock (insecure):
```sh
adb shell input keyevent KEYCODE_WAKEUP
adb shell input keyevent KEYCODE_MENU
```

Check lock screen security type:
```sh
adb shell locksettings get-password-quality
```

Monitor lock screen events:
```sh
adb shell logcat | grep -E "keyguard|lockscreen"
```

Clear pattern lock (root):
```sh
adb shell su -c "rm /data/system/gesture.key"
adb reboot
```

Check biometric status:
```sh
adb shell dumpsys fingerprint | grep -E "enrolled|active"
```

Set lock screen timeout:
```sh
adb shell settings put secure lock_screen_lock_after_timeout 10000
```

## Notes
- Lock screen bypass requires insecure lock or root
- Removing lock files requires root and may cause data loss
- Some commands only work on development builds
- Lock screen policies may be enforced by device admin
- Biometric commands vary by device manufacturer
- Use caution when modifying lock screen security
- Some operations may require specific Android versions
- Lock screen changes may affect device security
