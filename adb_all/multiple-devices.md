# Multiple Devices - ADB Commands

## Description
Commands for managing and controlling multiple connected Android devices simultaneously or targeting specific devices.

### Basic Commands

List all connected devices:
```sh
adb devices
```

Target specific device by serial:
```sh
adb -s <serial_number> <command>
```

Target USB device only:
```sh
adb -d <command>
```

Target emulator only:
```sh
adb -e <command>
```

### Advanced Commands

Execute command on all devices:
```sh
for device in $(adb devices | grep -v "List of devices" | cut -f1); do
    adb -s $device <command>
done
```

Get serial numbers of all connected devices:
```sh
adb devices | grep -v "List of devices" | cut -f1
```

Check device states:
```sh
adb devices -l
```

Install APK on all devices:
```sh
for device in $(adb devices | grep "device$" | cut -f1); do
    adb -s $device install app.apk
done
```

Push file to all devices:
```sh
for device in $(adb devices | grep "device$" | cut -f1); do
    adb -s $device push local_file /sdcard/
done
```

Get device information for all connected devices:
```sh
for device in $(adb devices | grep "device$" | cut -f1); do
    echo "=== Device: $device ==="
    adb -s $device shell getprop ro.product.model
    adb -s $device shell getprop ro.build.version.release
done
```

Install on specific device type:
```sh
adb -s emulator-5554 install app.apk
adb -s <physical_device_serial> install app.apk
```

Reboot all devices:
```sh
for device in $(adb devices | grep "device$" | cut -f1); do
    adb -s $device reboot
done
```

Take screenshots from all devices:
```sh
for device in $(adb devices | grep "device$" | cut -f1); do
    adb -s $device shell screencap -p /sdcard/screenshot_$device.png
    adb -s $device pull /sdcard/screenshot_$device.png
done
```

### Examples

Device management script:
```sh
#!/bin/bash
# List all devices with their info
echo "=== Connected Devices ==="
adb devices -l

echo -e "\n=== Device Details ==="
for device in $(adb devices | grep "device$" | cut -f1); do
    echo "Device: $device"
    echo "Model: $(adb -s $device shell getprop ro.product.model)"
    echo "Android: $(adb -s $device shell getprop ro.build.version.release)"
    echo "State: $(adb -s $device get-state)"
    echo "---"
done
```

Parallel command execution:
```sh
# Install app on all devices in parallel
for device in $(adb devices | grep "device$" | cut -f1); do
    adb -s $device install app.apk &
done
wait
```

## Notes
- Always use `-s <serial>` when multiple devices are connected
- Use `-d` for USB device and `-e` for emulator when only one of each type is connected
- Serial numbers can be obtained from `adb devices` command
- Some commands may fail if device is not in "device" state (e.g., "offline" or "unauthorized")
