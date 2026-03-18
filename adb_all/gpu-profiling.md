# GPU Profiling - ADB Commands

## Description
Commands for advanced GPU profiling, graphics performance analysis, and GPU optimization.

### Basic Commands

Check GPU info:
```sh
adb shell dumpsys gfxinfo
```

Check GPU usage:
```sh
adb shell dumpsys surfaceflinger
```

Check GPU renderer:
```sh
adb shell dumpsys graphicsstats
```

Monitor GPU performance:
```sh
adb shell cat /sys/class/kgsl/kgsl-3d0/gpuclk
```

Check GPU memory:
```sh
adb shell cat /sys/class/kgsl/kgsl-3d0/mem
```

### Advanced Commands

GPU performance profiling:
```sh
#!/bin/bash
echo "=== GPU Performance Profiling ==="

# Start GPU profiling
echo "Starting GPU profiling..."
target_app="com.example.game"

# Enable GPU profiling
adb shell setprop debug.hwui.overdraw show
adb shell setprop debug.hwui.profile visual_bars

# Launch app and monitor
adb shell am start -n $target_app/.MainActivity
sleep 10

# Collect GPU stats
echo "GPU performance stats:"
adb shell dumpsys gfxinfo $target_app | head -30

# Disable profiling
adb shell setprop debug.hwui.overdraw off
adb shell setprop debug.hwui.profile off
```

GPU memory analysis:
```sh
#!/bin/bash
echo "=== GPU Memory Analysis ==="

# Check GPU memory usage
echo "GPU memory usage:"
adb shell cat /sys/class/kgsl/kgsl-3d0/mem

# Check GPU memory allocation
echo "GPU memory allocation:"
adb shell cat /sys/class/kgsl/kgsl-3d0/gmem

# Monitor GPU memory leaks
echo "GPU memory leak detection:"
for i in {1..10}; do
  echo "Memory check $i:"
  adb shell cat /sys/class/kgsl/kgsl-3d0/mem
  sleep 2
done
```

GPU frequency scaling:
```sh
#!/bin/bash
echo "=== GPU Frequency Scaling ==="

# Check available GPU frequencies
echo "Available GPU frequencies:"
adb shell cat /sys/class/kgsl/kgsl-3d0/gpu_available_frequencies

# Check current GPU frequency
echo "Current GPU frequency:"
adb shell cat /sys/class/kgsl/kgsl-3d0/gpuclk

# Set GPU frequency (if supported)
echo "Setting GPU frequency..."
adb shell echo 600000000 > /sys/class/kgsl/kgsl-3d0/max_gpuclk

# Monitor frequency changes
echo "Monitoring GPU frequency:"
for i in {1..10}; do
  echo "Frequency check $i:"
  adb shell cat /sys/class/kgsl/kgsl-3d0/gpuclk
  sleep 2
done
```

GPU thermal management:
```sh
#!/bin/bash
echo "=== GPU Thermal Management ==="

# Check GPU temperature
echo "GPU temperature:"
adb shell cat /sys/class/thermal/thermal_zone*/temp | grep -E "gpu|GPU"

# Check GPU thermal throttling
echo "GPU thermal throttling:"
adb shell cat /sys/class/kgsl/kgsl-3d0/thermal_pwrlevel

# Monitor GPU temperature under load
echo "GPU temperature under load:"
adb shell am start -n com.example.game/.MainActivity
for i in {1..20}; do
  echo "Temp check $i:"
  adb shell cat /sys/class/thermal/thermal_zone*/temp | grep -E "gpu|GPU"
  sleep 3
done
```

GPU rendering analysis:
```sh
#!/bin/bash
echo "=== GPU Rendering Analysis ==="

# Enable rendering analysis
echo "Enabling rendering analysis..."
adb shell setprop debug.hwui.show_dirty_regions 1
adb shell setprop debug.hwui.show_updates 1

# Launch graphics app
adb shell am start -n com.example.graphics/.MainActivity
sleep 10

# Collect rendering stats
echo "Rendering statistics:"
adb shell dumpsys gfxinfo com.example.graphics | head -30

# Disable analysis
adb shell setprop debug.hwui.show_dirty_regions 0
adb shell setprop debug.hwui.show_updates 0
```

GPU driver debugging:
```sh
#!/bin/bash
echo "=== GPU Driver Debugging ==="

# Check GPU driver info
echo "GPU driver information:"
adb shell cat /sys/class/kgsl/kgsl-3d0/driver

# Check GPU driver version
echo "GPU driver version:"
adb shell cat /sys/class/kgsl/kgsl-3d0/driver_version

# Monitor GPU driver errors
echo "GPU driver errors:"
adb shell dmesg | grep -i kgsl | tail -10

# Check GPU driver logs
echo "GPU driver logs:"
adb shell logcat | grep -i kgsl | tail -10
```

GPU benchmarking:
```sh
#!/bin/bash
echo "=== GPU Benchmarking ==="

# Run GPU benchmark
echo "Running GPU benchmark..."
adb shell am start -n com.example.benchmark/.MainActivity
sleep 30

# Collect benchmark results
echo "Benchmark results:"
adb shell dumpsys gfxinfo com.example.benchmark | head -20

# GPU stress test
echo "GPU stress test..."
for i in {1..5}; do
  echo "Stress test $i:"
  adb shell am start -n com.example.graphics/.MainActivity
  sleep 10
  adb shell dumpsys gfxinfo com.example.graphics | grep "60th percentile"
done
```

GPU shader analysis:
```sh
#!/bin/bash
echo "=== GPU Shader Analysis ==="

# Enable shader debugging
echo "Enabling shader debugging..."
adb shell setprop debug.hwui.shader_debug 1

# Launch app with shaders
adb shell am start -n com.example.shaders/.MainActivity
sleep 10

# Collect shader info
echo "Shader information:"
adb shell dumpsys gfxinfo com.example.shaders | grep -i shader

# Disable shader debugging
adb shell setprop debug.hwui.shader_debug 0
```

Real-time GPU monitoring:
```sh
#!/bin/bash
echo "=== Real-time GPU Monitoring ==="

# Monitor GPU metrics in real-time
while true; do
  echo "=== GPU Monitor $(date) ==="
  
  # GPU frequency
  echo "GPU frequency:"
  adb shell cat /sys/class/kgsl/kgsl-3d0/gpuclk
  
  # GPU memory
  echo "GPU memory:"
  adb shell cat /sys/class/kgsl/kgsl-3d0/mem
  
  # GPU temperature
  echo "GPU temperature:"
  adb shell cat /sys/class/thermal/thermal_zone*/temp | grep -E "gpu|GPU"
  
  # GPU load
  echo "GPU load:"
  adb shell cat /sys/class/kgsl/kgsl-3d0/gpu_busy
  
  sleep 5
done
```

GPU optimization:
```sh
#!/bin/bash
echo "=== GPU Optimization ==="

# Optimize GPU settings
echo "Optimizing GPU settings..."
adb shell setprop debug.hwui.disable_vsync 1
adb shell setprop debug.hwui.force_dark 1

# Set GPU performance mode
echo "Setting GPU performance mode..."
adb shell echo performance > /sys/class/kgsl/kgsl-3d0/devfreq/governor

# Verify optimization
echo "Optimization verification:"
adb shell cat /sys/class/kgsl/kgsl-3d0/devfreq/governor
adb shell getprop debug.hwui.disable_vsync
```

### Examples

Basic GPU profiling:
```sh
adb shell dumpsys gfxinfo com.example.app
adb shell dumpsys surfaceflinger | head -20
adb shell cat /sys/class/kgsl/kgsl-3d0/gpuclk
```

GPU performance analysis:
```sh
adb shell setprop debug.hwui.profile visual_bars
adb shell am start -n com.example.game/.MainActivity
sleep 10
adb shell dumpsys gfxinfo com.example.game | head -30
```

GPU memory monitoring:
```sh
for i in {1..5}; do
  echo "GPU memory $i:"
  adb shell cat /sys/class/kgsl/kgsl-3d0/mem
  sleep 2
done
```

Complete GPU profiling:
```sh
#!/bin/bash
echo "=== Complete GPU Profiling ==="

# GPU info
echo "GPU information:"
adb shell dumpsys gfxinfo | head -20

# GPU frequency
echo "GPU frequency:"
adb shell cat /sys/class/kgsl/kgsl-3d0/gpuclk

# GPU memory
echo "GPU memory:"
adb shell cat /sys/class/kgsl/kgsl-3d0/mem

# GPU temperature
echo "GPU temperature:"
adb shell cat /sys/class/thermal/thermal_zone*/temp | grep -E "gpu|GPU"

echo "GPU profiling completed"
```

## Notes
- GPU profiling requires root access for some commands
- GPU profiling can affect system performance
- Some GPU features depend on hardware support
- Use GPU profiling carefully in production
- Monitor GPU temperature during intensive profiling
- Some GPU parameters may be reset on reboot
- Document GPU optimization changes
- Consider system stability when modifying GPU parameters
