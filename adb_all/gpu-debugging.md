# GPU Debugging - ADB Commands

## Description
Commands for GPU debugging, graphics performance analysis, and GPU profiling on Android devices.

### Basic Commands

Check GPU info:
```sh
adb shell dumpsys gfxinfo
```

Get GPU renderer:
```sh
adb shell dumpsys SurfaceFlinger | grep GLES
```

Check GPU usage:
```sh
adb shell dumpsys gfxinfo com.example.app
```

Monitor GPU performance:
```sh
adb shell dumpsys gfxinfo com.example.app framestats
```

Check GPU hardware:
```sh
adb shell cat /proc/driver/graphics/*/info
```

### Advanced Commands

Profile GPU rendering:
```sh
adb shell dumpsys gfxinfo com.example.app > gpu_profile.txt
```

Monitor frame rates:
```sh
adb shell dumpsys gfxinfo com.example.app | grep -E "frames|jank"
```

Check GPU memory:
```sh
adb shell dumpsys meminfo | grep -E "GPU|graphics|GL"
```

Monitor GPU composition:
```sh
adb shell dumpsys SurfaceFlinger | grep -E "composition|layers"
```

Profile GPU shaders:
```sh
adb shell dumpsys gfxinfo com.example.app | grep -E "shader|program"
```

Check GPU driver info:
```sh
adb shell getprop ro.hardware.graphics
```

Monitor GPU temperature:
```sh
adb shell cat /sys/class/thermal/thermal_zone*/temp | grep -i gpu
```

Debug GPU overdraw:
```sh
adb shell setprop debug.hw.overdraw 1
```

Check GPU extensions:
```sh
adb shell dumpsys SurfaceFlinger | grep -E "extensions|GL_"
```

Profile GPU pipeline:
```sh
adb shell dumpsys gfxinfo com.example.app | grep -E "pipeline|stage"
```

Monitor GPU power usage:
```sh
adb shell dumpsys batterystats | grep -E "gpu|graphics"
```

Check GPU vsync:
```sh
adb shell dumpsys SurfaceFlinger | grep -E "vsync|refresh"
```

Debug GPU profiling:
```sh
adb shell setprop debug.sf.showfps 1
```

### Examples

Check GPU hardware info:
```sh
adb shell dumpsys SurfaceFlinger | grep GLES
adb shell getprop ro.hardware.graphics
```

Profile app GPU usage:
```sh
adb shell dumpsys gfxinfo com.example.app
```

Monitor frame performance:
```sh
adb shell dumpsys gfxinfo com.example.app framestats
```

Enable GPU overdraw debugging:
```sh
adb shell setprop debug.hw.overdraw 1
```

Check GPU driver details:
```sh
adb shell dumpsys SurfaceFlinger | grep -E "driver|version|vendor"
```

Monitor GPU temperature:
```sh
adb shell cat /sys/class/thermal/thermal_zone*/temp | grep -i gpu
```

Debug GPU performance:
```sh
adb shell setprop debug.sf.showfps 1
```

## Notes
- GPU debugging requires appropriate permissions
- Some GPU features require specific Android versions
- GPU profiling may impact app performance
- Use `dumpsys gfxinfo` for comprehensive GPU data
- GPU debugging tools vary by device manufacturer
- Some GPU features require developer options enabled
- GPU overdraw debugging affects visual output
- GPU profiling helps identify graphics bottlenecks
