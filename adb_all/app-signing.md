# App Signing - ADB Commands

## Description
Commands for managing app signing, checking signatures, and certificate operations on Android applications.

### Basic Commands

Check app signature:
```sh
adb shell dumpsys package com.example.app | grep -A 20 "PackageSignatures"
```

Verify app certificate:
```sh
adb shell pm list packages -f | grep com.example.app
```

Check signing certificates:
```sh
adb shell dumpsys package com.example.app | grep -E "signatures|certificates"
```

Get app signing info:
```sh
adb shell pm path com.example.app
```

Check package signature:
```sh
adb shell pm list packages -f com.example.app
```

### Advanced Commands

Extract APK to check signature:
```sh
adb pull $(adb shell pm path com.example.app | cut -d: -f2) app.apk
```

Verify APK signature locally:
```sh
jarsigner -verify -verbose -certs app.apk
```

Check signature algorithm:
```sh
adb shell dumpsys package com.example.app | grep -E "signatures|algorithm"
```

Get certificate fingerprint:
```sh
keytool -printcert -jarfile app.apk
```

Check multiple signatures:
```sh
adb shell dumpsys package com.example.app | grep -A 30 "Signatures"
```

Verify app integrity:
```sh
adb shell pm verify com.example.app
```

Check signing key version:
```sh
adb shell dumpsys package com.example.app | grep -E "version|signing"
```

Get certificate details:
```sh
adb shell dumpsys package com.example.app | grep -A 10 "PackageInfo"
```

Check for debug vs release signature:
```sh
adb shell dumpsys package com.example.app | grep -E "debug|release"
```

Verify app installation source:
```sh
adb shell dumpsys package com.example.app | grep -E "installer|originating"
```

Check signature timestamps:
```sh
adb shell dumpsys package com.example.app | grep -E "timestamp|date"
```

Monitor signature verification:
```sh
adb shell logcat | grep -E "signature|verify|cert"
```

### Examples

Check app signature details:
```sh
adb shell dumpsys package com.example.app | grep -A 20 "PackageSignatures"
```

Extract and verify APK signature:
```sh
adb pull $(adb shell pm path com.example.app | cut -d: -f2) app.apk
jarsigner -verify app.apk
```

Get certificate fingerprint:
```sh
adb pull $(adb shell pm path com.example.app | cut -d: -f2) app.apk
keytool -printcert -jarfile app.apk
```

Check if app is signed with debug key:
```sh
adb shell dumpsys package com.example.app | grep -E "debug|test|sign"
```

Monitor signature verification:
```sh
adb shell logcat | grep -E "signature|verify|certificate"
```

Verify app installation:
```sh
adb shell pm list packages -f | grep com.example.app
```

Check multiple app signatures:
```sh
for app in $(adb shell pm list packages | cut -d: -f2); do
  echo "=== $app ==="
  adb shell dumpsys package $app | grep -A 5 "Signatures"
done
```

## Notes
- App signing verification requires package access
- Some signature details may be restricted for security
- Debug signatures differ from release signatures
- Signature verification is automatic during installation
- Use `jarsigner` for local signature verification
- Certificate fingerprints help identify app sources
- Some apps have multiple signing certificates
- Signature checking is important for security analysis
