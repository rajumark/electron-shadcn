# Barcode Scanner - ADB Commands

## Description
Commands for managing Android barcode scanners, QR code operations, and barcode scanning functionality.

### Basic Commands

Check camera barcode capability:
```sh
adb shell pm list features | grep -E "camera|barcode"
```

Check barcode scanner app:
```sh
adb shell pm list packages | grep -E "barcode|scanner|qr"
```

Test barcode scanning:
```sh
adb shell am start -a android.media.action.IMAGE_CAPTURE
```

Check barcode permissions:
```sh
adb shell dumpsys package com.example.app | grep -E "camera|CAMERA"
```

Grant camera permission:
```sh
adb shell pm grant com.example.app android.permission.CAMERA
```

### Advanced Commands

Barcode scanner hardware info:
```sh
adb shell dumpsys media.camera | grep -E "barcode|scanner|auto"
```

QR code simulation:
```sh
# Simulate QR code detection
adb shell am broadcast -a com.example.QR_DETECTED -e data "https://example.com" -e format "QR_CODE"
```

Barcode format testing:
```sh
# Test different barcode formats
formats=("QR_CODE" "CODE_128" "CODE_39" "EAN_13" "UPC_A")
for format in "${formats[@]}"; do
  echo "Testing format: $format"
  adb shell am broadcast -a com.example.BARCODE_DETECTED -e data "123456789" -e format "$format"
done
```

Barcode scanner performance:
```sh
# Monitor scanner performance
adb shell logcat | grep -E "barcode|scanner|qr"
```

Camera configuration for scanning:
```sh
# Configure camera for barcode scanning
adb shell am start -n com.example.app/.BarcodeScannerActivity
sleep 3
adb shell input keyevent KEYCODE_CAMERA
```

Barcode data validation:
```sh
# Validate barcode data
adb shell am broadcast -a com.example.VALIDATE_BARCODE -e data "1234567890123" -e format "EAN_13"
```

Multi-barcode scanning:
```sh
# Test multiple barcode detection
adb shell am broadcast -a com.example.MULTI_BARCODE_DETECTED -e count "3" -e data1 "123456" -e data2 "789012" -e data3 "345678"
```

Barcode scanner calibration:
```sh
# Check scanner calibration
adb shell dumpsys camera | grep -E "focus|auto|calibration"
```

Barcode scanner debugging:
```sh
# Enable barcode scanner debugging
adb shell setprop log.tag.BarcodeScanner VERBOSE
adb shell logcat | grep BarcodeScanner
```

Barcode scanner settings:
```sh
# Check scanner settings
adb shell settings get system barcode_scanner_enabled
adb shell settings put system barcode_scanner_enabled 1
```

Barcode generation:
```sh
# Generate barcode
adb shell am broadcast -a com.example.GENERATE_BARCODE -e data "123456789" -e format "CODE_128"
```

Barcode scanner integration:
```sh
# Test integration with other apps
adb shell am start -a com.example.INTEGRATE_SCANNER -e target_app "com.example.inventory"
```

Barcode scanner error handling:
```sh
# Test error scenarios
adb shell am broadcast -a com.example.SCANNER_ERROR -e error "INVALID_FORMAT" -e data "invalid_data"
```

Barcode scanner performance:
```sh
# Performance test
for i in {1..10}; do
  echo "Scan $i"
  adb shell am broadcast -a com.example.SIMULATE_SCAN -e data "TEST_$i" -e format "QR_CODE"
  sleep 1
done
```

### Examples

Basic barcode scanner test:
```sh
adb shell am start -n com.example.app/.BarcodeActivity
sleep 3
echo "Point camera at barcode"
```

QR code simulation:
```sh
adb shell am broadcast -a com.example.QR_DETECTED -e data "https://google.com" -e format "QR_CODE"
```

Barcode format testing:
```sh
formats=("QR_CODE" "CODE_128" "EAN_13")
for format in "${formats[@]}"; do
  adb shell am broadcast -a com.example.BARCODE_DETECTED -e data "TEST_DATA" -e format "$format"
done
```

Barcode scanner performance:
```sh
adb shell logcat | grep -E "barcode|scanner" | tail -20
```

Complete barcode scanner test:
```sh
#!/bin/bash
echo "=== Barcode Scanner Test Suite ==="

# Hardware check
echo "Checking camera hardware..."
adb shell pm list features | grep camera

# Scanner app check
echo "Checking scanner apps..."
adb shell pm list packages | grep -E "barcode|scanner"

# Test different formats
echo "Testing barcode formats..."
formats=("QR_CODE" "CODE_128" "CODE_39" "EAN_13")
for format in "${formats[@]}"; do
  adb shell am broadcast -a com.example.BARCODE_DETECTED -e data "TEST_$format" -e format "$format"
  sleep 1
done

# Performance test
echo "Testing scanner performance..."
for i in {1..5}; do
  adb shell am broadcast -a com.example.SIMULATE_SCAN -e data "PERF_TEST_$i"
  sleep 0.5
done

echo "Barcode scanner test completed"
```

## Notes
- Barcode scanning requires camera permission
- Camera quality affects barcode recognition
- Barcode formats vary by scanner implementation
- QR codes can store more data than traditional barcodes
- Barcode scanning may be affected by lighting conditions
- Test with actual barcodes for accurate results
- Some devices have hardware barcode scanners
- Consider privacy when handling barcode data
