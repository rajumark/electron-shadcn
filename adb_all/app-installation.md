# App Installation - ADB Commands

## Description
Commands for installing Android applications (APK files) on devices, including various installation options and troubleshooting.

### Basic Commands

Install APK file:
```sh
adb install app.apk
```

Install APK with specific path:
```sh
adb install /path/to/app.apk
```

Install APK on specific device:
```sh
adb -s <serial> install app.apk
```

### Advanced Commands

Install with debugging enabled:
```sh
adb install -d app.apk
```

Install with forward lock:
```sh
adb install -l app.apk
```

Install on external storage:
```sh
adb install -s app.apk
```

Allow version downgrade:
```sh
adb install -r app.apk
```

Grant all permissions during install:
```sh
adb install -g app.apk
```

Install with all options:
```sh
adb install -d -r -g app.apk
```

Install multiple APKs (split APKs):
```sh
adb install-multiple base.apk split1.apk split2.apk
```

Install APK bundle:
```sh
adb install-bundle app.aab
```

Force install (ignore signature):
```sh
adb install --bypass-low-target-sdk-block app.apk
```

Install with test mode:
```sh
adb install --test app.apk
```

Install with instant app:
```sh
adb install --instant app.apk
```

Check installation status:
```sh
adb shell pm path com.example.app
```

Verify app installation:
```sh
adb shell pm list packages | grep com.example.app
```

### Examples

Batch installation script:
```sh
#!/bin/bash
# Install all APK files in directory
for apk in *.apk; do
    echo "Installing $apk..."
    adb install -r "$apk"
    if [ $? -eq 0 ]; then
        echo "✓ $apk installed successfully"
    else
        echo "✗ Failed to install $apk"
    fi
done
```

Install with verification:
```sh
#!/bin/bash
APK="app.apk"
PACKAGE="com.example.app"

echo "Installing $APK..."
adb install -r -g "$APK"

# Verify installation
if adb shell pm list packages | grep -q "$PACKAGE"; then
    echo "✓ Installation successful"
    echo "Package path: $(adb shell pm path $PACKAGE)"
else
    echo "✗ Installation failed"
fi
```

Install on all connected devices:
```sh
for device in $(adb devices | grep "device$" | cut -f1); do
    echo "Installing on $device..."
    adb -s $device install -r app.apk
done
```

## Notes
- Use `-r` flag to update existing app
- Use `-s` flag to install on SD card (may not work on all Android versions)
- Use `-g` flag to automatically grant permissions
- Some installation options require specific Android versions
- Ensure "Unknown Sources" is enabled on device for non-Play Store apps
- Large APKs may take time to transfer and install
- Split APKs must be installed together with `install-multiple`
