# Bluetooth Audio - ADB Commands

## Description
Commands for managing Bluetooth audio connections, codecs, and audio streaming via Bluetooth on Android devices.

### Basic Commands

Enable Bluetooth:
```sh
adb shell settings put global bluetooth_on 1
```

Disable Bluetooth:
```sh
adb shell settings put global bluetooth_on 0
```

Check Bluetooth status:
```sh
adb shell settings get global bluetooth_on
```

List paired Bluetooth devices:
```sh
adb shell dumpsys bluetooth_manager | grep -A 10 "Paired devices"
```

Connect to Bluetooth device:
```sh
adb shell service call bluetooth_manager 6 i32 0 s16 "device_address"
```

### Advanced Commands

Get Bluetooth audio codec info:
```sh
adb shell settings get global bluetooth_a2dp_codec_config
```

Set Bluetooth audio codec:
```sh
adb shell settings put global bluetooth_a2dp_codec_config 0
```

Check Bluetooth audio state:
```sh
adb shell dumpsys audio | grep -E "bluetooth|A2DP"
```

Monitor Bluetooth audio connections:
```sh
adb shell logcat | grep -E "BluetoothAudio|A2DP| bluetooth.*audio"
```

Get supported Bluetooth codecs:
```sh
adb shell dumpsys bluetooth_manager | grep -E "codec|A2DP"
```

Check Bluetooth audio quality:
```sh
adb shell dumpsys audio | grep -E "bluetooth.*bitrate|A2DP.*quality"
```

Force Bluetooth audio reconnect:
```sh
adb shell service call bluetooth_manager 8 i32 0 s16 "device_address"
```

Check Bluetooth audio latency:
```sh
adb shell dumpsys audio | grep -E "bluetooth.*latency|A2DP.*delay"
```

Set Bluetooth audio priority:
```sh
adb shell settings put global bluetooth_a2dp_sink_priority 100
```

Monitor Bluetooth audio streaming:
```sh
adb shell dumpsys media.audio_flinger | grep -E "bluetooth|A2DP"
```

Check Bluetooth device battery:
```sh
adb shell dumpsys bluetooth_manager | grep -E "battery|charge"
```

### Examples

Check if Bluetooth audio is active:
```sh
adb shell dumpsys audio | grep -E "bluetooth.*connected|A2DP.*active"
```

Set high-quality Bluetooth codec:
```sh
adb shell settings put global bluetooth_a2dp_codec_config 2
```

List connected Bluetooth audio devices:
```sh
adb shell dumpsys bluetooth_manager | grep -E "Audio|A2DP|connected"
```

Monitor Bluetooth audio quality:
```sh
adb shell logcat | grep -E "BluetoothAudio.*quality|A2DP.*bitrate"
```

Force reconnect Bluetooth audio:
```sh
adb shell service call bluetooth_manager 8 i32 0 s16 "AA:BB:CC:DD:EE:FF"
```

Check Bluetooth audio latency:
```sh
adb shell dumpsys audio | grep -E "latency|delay" | grep bluetooth
```

## Notes
- Bluetooth audio requires appropriate permissions
- Codec support varies by device and Android version
- Some Bluetooth audio features require specific hardware
- Audio quality depends on codec and device capabilities
- Use `dumpsys bluetooth_manager` for comprehensive Bluetooth info
- Bluetooth audio may be affected by interference
- Some commands require specific device addresses
- Bluetooth audio settings may reset on device reboot
