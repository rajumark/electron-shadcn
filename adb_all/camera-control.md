# Camera Control - ADB Commands

## Description
Commands for controlling Android camera hardware, managing camera operations, and camera feature testing.

### Basic Commands

Check camera availability:
```sh
adb shell pm list features | grep camera
```

List camera devices:
```sh
adb shell dumpsys media.camera | grep -E "Camera|device"
```

Check camera permissions:
```sh
adb shell dumpsys package com.example.app | grep -E "camera|CAMERA"
```

Grant camera permission:
```sh
adb shell pm grant com.example.app android.permission.CAMERA
```

Check camera status:
```sh
adb shell dumpsys media.camera | grep -E "state|status"
```

### Advanced Commands

Camera hardware info:
```sh
adb shell dumpsys media.camera | grep -A 10 "Camera Character"
```

Test camera capture:
```sh
adb shell am start -a android.media.action.IMAGE_CAPTURE
sleep 3
adb shell input keyevent KEYCODE_CAMERA
```

Check camera resolution:
```sh
adb shell dumpsys media.camera | grep -E "resolution|size"
```

Camera API version:
```sh
adb shell getprop ro.camera.api.version
```

Test video recording:
```sh
adb shell am start -a android.media.action.VIDEO_CAMERA
sleep 3
adb shell input keyevent KEYCODE_CAMERA
```

Camera flash control:
```sh
adb shell service call camera 5 i32 1  # Enable flash
adb shell service call camera 5 i32 0  # Disable flash
```

Camera focus control:
```sh
adb shell service call camera 6 i32 1  # Auto focus
adb shell service call camera 6 i32 0  # Manual focus
```

Check camera effects:
```sh
adb shell dumpsys media.camera | grep -E "effect|filter"
```

Camera preview testing:
```sh
adb shell am start -n com.example.app/.CameraPreviewActivity
sleep 5
adb shell screencap /sdcard/camera_preview.png
```

Camera performance testing:
```sh
adb shell dumpsys gfxinfo | grep -E "camera|preview"
```

Camera sensor info:
```sh
adb shell cat /sys/class/camera/camera0/sensor_info
```

Camera calibration data:
```sh
adb shell cat /data/misc/camera/calibration.xml
```

### Examples

Check camera hardware:
```sh
adb shell pm list features | grep camera
adb shell dumpsys media.camera | head -20
```

Test camera capture:
```sh
adb shell am start -a android.media.action.IMAGE_CAPTURE
sleep 3
adb shell input keyevent KEYCODE_CAMERA
adb shell ls -la /sdcard/DCIM/Camera/
```

Camera flash testing:
```sh
adb shell service call camera 5 i32 1
sleep 2
adb shell service call camera 5 i32 0
```

Camera resolution check:
```sh
adb shell dumpsys media.camera | grep -E "resolution|size|dimension"
```

Camera performance test:
```sh
adb shell am start -n com.example.app/.CameraActivity
sleep 5
adb shell dumpsys gfxinfo | grep -E "camera|fps|frames"
```

## Notes
- Camera operations require appropriate permissions
- Some camera features may not be available on all devices
- Camera control may affect app functionality
- Use camera testing for camera-dependent apps
- Camera hardware varies by device manufacturer
- Some commands require specific Android versions
- Camera operations consume significant battery
- Test camera features across different devices
