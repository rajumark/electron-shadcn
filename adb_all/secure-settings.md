# Secure Settings - ADB Commands

## Description
Commands for managing secure Android settings, accessing protected system settings, and secure configuration values.

### Basic Commands

Get secure setting:
```sh
adb shell settings get secure setting_name
```

Set secure setting:
```sh
adb shell settings put secure setting_name value
```

List all secure settings:
```sh
adb shell settings list secure
```

Check accessibility settings:
```sh
adb shell settings get secure enabled_accessibility_services
```

Check location settings:
```
adb shell settings get secure location_providers_allowed
```

### Advanced Commands

Set development options:
```sh
adb shell settings put secure development_settings_enabled 1
```

Enable USB debugging:
```sh
adb shell settings put secure adb_enabled 1
```

Check lock screen settings:
```sh
adb shell settings get secure lockscreen
```

Set default input method:
```sh
adb shell settings put secure default_input_method com.example.keyboard
```

Check backup settings:
```sh
adb shell settings get secure backup_enabled
```

Set installation source:
```sh
adb shell settings put secure install_non_market_apps 1
```

Check notification settings:
```sh
adb shell settings get secure notification_access
```

Set time format:
```sh
adb shell settings put secure time_12_24 24
```

Check accessibility shortcut:
```sh
adb shell settings get secure accessibility_shortcut_target_service
```

Set screen timeout:
```sh
adb shell settings put secure screen_off_timeout 30000
```

Check touch exploration:
```sh
adb shell settings get secure touch_exploration_enabled
```

Set preferred network:
```sh
adb shell settings put secure preferred_network_mode
```

Check multi-user settings:
```
adb shell settings get secure user_setup_complete
```

### Examples

Enable USB debugging:
```sh
adb shell settings put secure adb_enabled 1
```

Allow installation from unknown sources:
```sh
adb shell settings put secure install_non_market_apps 1
```

Check all secure settings:
```sh
adb shell settings list secure | head -20
```

Set screen timeout to 30 seconds:
```sh
adb shell settings put secure screen_off_timeout 30000
```

Check location providers:
```sh
adb shell settings get secure location_providers_allowed
```

Enable development settings:
```sh
adb shell settings put secure development_settings_enabled 1
```

Set 24-hour time format:
```sh
adb shell settings put secure time_12_24 24
```

## Notes
- Secure settings require appropriate permissions
- Some settings may be read-only or protected
- Changing secure settings may affect device security
- Use `settings list secure` to see all available settings
- Some settings require system-level permissions
- Secure settings persist across reboots
- Some settings may be overridden by device admin policies
- Use caution when modifying secure system settings
