# Screen Recording - ADB Commands

## Description
Commands for recording screen activity, managing video captures, and screen recording operations on Android devices.

### Basic Commands

Start screen recording:
```sh
adb shell screenrecord /sdcard/video.mp4
```

Stop recording (Ctrl+C):
```sh
# Press Ctrl+C to stop recording
```

Pull video to computer:
```sh
adb pull /sdcard/video.mp4
```

Record with time limit:
```sh
adb shell screenrecord --time-limit 30 /sdcard/video.mp4
```

Record with specific bitrate:
```sh
adb shell screenrecord --bit-rate 4000000 /sdcard/video.mp4
```

### Advanced Commands

Record with audio:
```sh
adb shell screenrecord --audio /sdcard/video_with_audio.mp4
```

Record specific display:
```sh
adb shell screenrecord --display-id 1 /sdcard/display_video.mp4
```

Record with rotation:
```sh
adb shell screenrecord --rotate /sdcard/rotated_video.mp4
```

Record with custom resolution:
```sh
adb shell screenrecord --size 720x1280 /sdcard/custom_video.mp4
```

Show recording info:
```sh
adb shell screenrecord --help
```

Record with verbose output:
```sh
adb shell screenrecord --verbose /sdcard/video.mp4
```

Background recording:
```sh
adb shell screenrecord /sdcard/background_video.mp4 &
```

Record with specific frame rate:
```sh
adb shell screenrecord --time-limit 60 --bit-rate 8000000 /sdcard/high_quality.mp4
```

Monitor recording progress:
```sh
adb shell screenrecord --verbose /sdcard/video.mp4 | grep -E "time|frames"
```

### Examples

Record 30 seconds of screen:
```sh
adb shell screenrecord --time-limit 30 /sdcard/demo.mp4
```

High quality recording:
```sh
adb shell screenrecord --bit-rate 8000000 /sdcard/hd_video.mp4
```

Record and transfer directly:
```sh
adb shell screenrecord --time-limit 60 /sdcard/video.mp4 && adb pull /sdcard/video.mp4
```

Record with audio and high bitrate:
```sh
adb shell screenrecord --audio --bit-rate 6000000 /sdcard/presentation.mp4
```

Automated recording series:
```sh
for i in {1..3}; do adb shell screenrecord --time-limit 10 /sdcard/video_$i.mp4; sleep 5; done
```

## Notes
- Screen recording requires Android 4.4+ (API 19+)
- Default recording time is 3 minutes max
- Default bitrate is 4Mbps
- Audio recording requires Android 4.4+ and specific permissions
- Recording stops automatically when time limit reached
- Some devices may have restrictions on screen recording
- Large video files may take time to transfer
- Use Ctrl+C to stop manual recordings
