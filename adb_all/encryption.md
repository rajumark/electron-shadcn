# Encryption - ADB Commands

## Description
Commands for managing device encryption, checking encryption status, and encryption-related operations on Android devices.

### Basic Commands

Check encryption status:
```sh
adb shell getprop ro.crypto.state
```

Check encryption type:
```sh
adb shell getprop ro.crypto.type
```

Check if device is encrypted:
```sh
adb shell getprop ro.crypto.state
```

Check encryption policy:
```sh
adb shell getprop ro.crypto.volume.options
```

Check file-based encryption:
```sh
adb shell getprop ro.crypto.volume.flags
```

### Advanced Commands

Check encryption key status:
```sh
adb shell getprop ro.crypto.keyfile.userdata
```

Check encryption metadata:
```sh
adb shell getprop ro.crypto.metadata.enabled
```

Monitor encryption process:
```sh
adb shell logcat | grep -E "encrypt|crypto"
```

Check encryption algorithms:
```sh
adb shell getprop ro.crypto.scrypt_params
```

Check storage encryption:
```sh
adb shell getprop persist.sys.storage.encryption
```

Check encryption state during boot:
```sh
adb shell getprop vold.decrypt
```

Check encrypted storage info:
```sh
adb shell dumpsys mount | grep -E "encrypt|crypto"
```

Check FBE (File-Based Encryption) status:
```sh
adb shell getprop ro.crypto.type
```

Monitor encryption errors:
```sh
adb shell logcat | grep -E "crypto.*error|encrypt.*fail"
```

Check encryption certificate:
```sh
adb shell getprop ro.crypto.keymaster.cert
```

Check encryption version:
```sh
adb shell getprop ro.crypto.version
```

Check encryption mount points:
```sh
adb shell cat /proc/mounts | grep -E "encrypt|crypto"
```

### Examples

Check if device is encrypted:
```sh
adb shell getprop ro.crypto.state
# Output: encrypted, unencrypted, or unsupported
```

Check encryption type:
```sh
adb shell getprop ro.crypto.type
# Output: file or block
```

Monitor encryption process:
```sh
adb shell logcat | grep -E "encrypt|crypto|vold"
```

Check encryption status during boot:
```sh
adb shell getprop vold.decrypt
# Output: 1=trigger_restart_min_framework, 2=trigger_restart_framework
```

Check file-based encryption:
```sh
adb shell getprop ro.crypto.type
adb shell getprop ro.crypto.volume.flags
```

Monitor encryption errors:
```sh
adb shell logcat | grep -E "crypto.*error|encrypt.*fail" | tail -10
```

Check encryption algorithms used:
```sh
adb shell getprop | grep crypto
```

## Notes
- Encryption status varies by Android version
- File-based encryption (FBE) is default in Android 7.0+
- Some encryption commands require root access
- Encryption cannot be disabled on most modern devices
- Encryption status affects data recovery options
- Use `getprop` to check encryption-related properties
- Encryption process may take time on first boot
- Some devices have custom encryption implementations
