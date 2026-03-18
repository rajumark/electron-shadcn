# Device Information - ADB Commands

## Description
Commands for retrieving basic device information, model details, and Android version information using ADB.

### Basic Commands

Get device model:
```sh
adb shell getprop ro.product.model
```

Get device manufacturer:
```sh
adb shell getprop ro.product.manufacturer
```

Get Android version:
```sh
adb shell getprop ro.build.version.release
```

Get API level:
```sh
adb shell getprop ro.build.version.sdk
```

Get device serial number:
```sh
adb get-serialno
```

### Advanced Commands

Get complete device information:
```sh
adb shell getprop
```

Get device brand:
```sh
adb shell getprop ro.product.brand
```

Get device name:
```sh
adb shell getprop ro.product.device
```

Get build number:
```sh
adb shell getprop ro.build.display.id
```

Get security patch level:
```sh
adb shell getprop ro.build.version.security_patch
```

Get bootloader version:
```sh
adb shell getprop ro.bootloader
```

Get baseband version:
```sh
adb shell getprop ro.baseband
```

Get kernel version:
```sh
adb shell uname -r
```

### Examples

Check if device is rooted:
```sh
adb shell su -c "id" 2>/dev/null && echo "Rooted" || echo "Not rooted"
```

Get device fingerprint:
```sh
adb shell getprop ro.build.fingerprint
```

Display all device properties:
```sh
adb shell getprop | grep ro.product
```

Check Android Go edition:
```sh
adb shell getprop ro.config.low_ram
```

## Notes
- Some properties may be restricted on certain devices
- Root access required for some system properties
- Property names may vary between manufacturers
- Use `adb shell dumpsys` for more detailed system information
- Device information can help with compatibility testing
