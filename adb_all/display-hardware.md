# Display Hardware - ADB Commands

## Description
Commands for display hardware control, display debugging, and advanced display management.

### Basic Commands

Check display info:
```sh
adb shell dumpsys display
```

Check display density:
```sh
adb shell wm density
```

Check display resolution:
```sh
adb shell wm size
```

Check display refresh rate:
```sh
adb shell dumpsys display | grep refresh
```

Check display brightness:
```sh
adb shell settings get system screen_brightness
```

### Advanced Commands

Display hardware analysis:
```sh
#!/bin/bash
echo "=== Display Hardware Analysis ==="

# Check display panels
echo "Display panels:"
adb shell find /sys -name "*panel*" -exec ls -la {} \; 2>/dev/null

# Check display controllers
echo "Display controllers:"
adb shell find /sys -name "*display*" -o -name "*lcd*" -o -name "*oled*" | head -10

# Check display backlight
echo "Display backlight:"
adb shell find /sys -name "*backlight*" -o -name "*brightness*" | head -10

# Check display timing
echo "Display timing:"
adb shell cat /sys/class/drm/card0-*/*/mode 2>/dev/null
```

Display calibration:
```sh
#!/bin/bash
echo "=== Display Calibration ==="

# Check display calibration data
echo "Display calibration:"
adb shell dumpsys display | grep -E "calibration|gamma|color"

# Check color temperature
echo "Color temperature:"
adb shell settings get system display_color_temperature

# Check HDR settings
echo "HDR settings:"
adb shell settings get global hdr_enabled

# Calibrate display colors
echo "Calibrating display colors..."
adb shell service call display 1 i32 1 i32 255 i32 255 i32 255  # White balance
```

Display refresh rate control:
```sh
#!/bin/bash
echo "=== Display Refresh Rate Control ==="

# Check available refresh rates
echo "Available refresh rates:"
adb shell dumpsys display | grep -E "refresh|rate|fps"

# Set refresh rate to 60Hz
echo "Setting refresh rate to 60Hz..."
adb shell service call display 2 i32 60

# Set refresh rate to 90Hz
echo "Setting refresh rate to 90Hz..."
adb shell service call display 2 i32 90

# Set refresh rate to 120Hz
echo "Setting refresh rate to 120Hz..."
adb shell service call display 2 i32 120

# Verify refresh rate
echo "Current refresh rate:"
adb shell dumpsys display | grep -E "refresh|rate"
```

Display brightness control:
```sh
#!/bin/bash
echo "=== Display Brightness Control ==="

# Check current brightness
echo "Current brightness:"
adb shell settings get system screen_brightness
adb shell cat /sys/class/backlight/*/brightness 2>/dev/null

# Set brightness levels
echo "Setting brightness levels..."
for level in 50 100 150 200 255; do
  echo "Setting brightness to $level"
  adb shell settings put system screen_brightness $level
  adb shell cat /sys/class/backlight/*/brightness 2>/dev/null
  sleep 2
done

# Auto brightness control
echo "Auto brightness control:"
adb shell settings put system screen_brightness_mode 1
```

Display color management:
```sh
#!/bin/bash
echo "=== Display Color Management ==="

# Check color profiles
echo "Display color profiles:"
adb shell dumpsys display | grep -E "color|profile|gamut"

# Set sRGB color profile
echo "Setting sRGB color profile..."
adb shell settings put system display_color_mode 0

# Set DCI-P3 color profile
echo "Setting DCI-P3 color profile..."
adb shell settings put system display_color_mode 1

# Set HDR mode
echo "Setting HDR mode..."
adb shell settings put global hdr_enabled 1

# Verify color settings
echo "Color settings verification:"
adb shell settings get system display_color_mode
adb shell settings get global hdr_enabled
```

Display hardware monitoring:
```sh
#!/bin/bash
echo "=== Display Hardware Monitoring ==="

# Monitor display temperature
echo "Display temperature:"
adb shell find /sys -name "*temp*" -exec grep -l "display\|panel" {} \; 2>/dev/null

# Monitor display power
echo "Display power consumption:"
adb shell cat /sys/class/power_supply/battery/current_now

# Monitor display timing
echo "Display timing analysis:"
for i in {1..10}; do
  echo "Timing check $i:"
  adb shell dumpsys display | grep -E "refresh|rate|fps"
  sleep 2
done
```

Display debugging:
```sh
#!/bin/bash
echo "=== Display Debugging ==="

# Enable display debugging
echo "Enabling display debugging..."
adb shell setprop debug.sf.showupdates 1
adb shell setprop debug.sf.showfps 1

# Monitor display updates
echo "Monitoring display updates..."
for i in {1..10}; do
  echo "Display update $i:"
  adb shell dumpsys SurfaceFlinger | grep -E "update|fps|frame" | tail -5
  sleep 2
done

# Disable display debugging
adb shell setprop debug.sf.showupdates 0
adb shell setprop debug.sf.showfps 0
```

Display panel control:
```sh
#!/bin/bash
echo "=== Display Panel Control ==="

# Check panel information
echo "Panel information:"
adb shell find /sys -name "*panel*" -exec cat {} \; 2>/dev/null | head -10

# Control panel power
echo "Panel power control:"
adb shell echo 1 > /sys/class/backlight/*/bl_power 2>/dev/null
sleep 2
adb shell echo 0 > /sys/class/backlight/*/bl_power 2>/dev/null
sleep 2
adb shell echo 1 > /sys/class/backlight/*/bl_power 2>/dev/null

# Check panel status
echo "Panel status:"
adb shell cat /sys/class/backlight/*/bl_power 2>/dev/null
```

Display HDR control:
```sh
#!/bin/bash
echo "=== Display HDR Control ==="

# Check HDR capabilities
echo "HDR capabilities:"
adb shell dumpsys display | grep -E "HDR|hdr|dynamic"

# Enable HDR
echo "Enabling HDR..."
adb shell settings put global hdr_enabled 1
adb shell settings put global hdr_force_enabled 1

# Configure HDR settings
echo "Configuring HDR settings..."
adb shell settings put system hdr_brightness_mode 1
adb shell settings put system hdr_contrast_mode 1

# Verify HDR settings
echo "HDR verification:"
adb shell settings get global hdr_enabled
adb shell settings get global hdr_force_enabled
```

Real-time display monitoring:
```sh
#!/bin/bash
echo "=== Real-time Display Monitoring ==="

# Monitor display system in real-time
while true; do
  echo "=== Display Monitor $(date) ==="
  
  # Display brightness
  echo "Display brightness:"
  adb shell settings get system screen_brightness
  
  # Display refresh rate
  echo "Display refresh rate:"
  adb shell dumpsys display | grep -E "refresh|rate" | tail -1
  
  # Display color mode
  echo "Display color mode:"
  adb shell settings get system display_color_mode
  
  # Display power
  echo "Display power:"
  adb shell cat /sys/class/power_supply/battery/current_now
  
  sleep 30
done
```

### Examples

Basic display analysis:
```sh
adb shell dumpsys display
adb shell wm density
adb shell wm size
adb shell settings get system screen_brightness
```

Display refresh rate control:
```sh
adb shell service call display 2 i32 60   # 60Hz
adb shell service call display 2 i32 90   # 90Hz
adb shell service call display 2 i32 120  # 120Hz
```

Display brightness control:
```sh
adb shell settings put system screen_brightness 200
adb shell settings put system screen_brightness_mode 1
adb shell cat /sys/class/backlight/*/brightness
```

Complete display analysis:
```sh
#!/bin/bash
echo "=== Complete Display Analysis ==="

# Display info
echo "Display information:"
adb shell dumpsys display | head -20

# Display properties
echo "Display properties:"
adb shell wm density
adb shell wm size

# Brightness
echo "Brightness:"
adb shell settings get system screen_brightness

echo "Display analysis completed"
```

## Notes
- Display hardware commands require root access
- Display modifications can affect user experience
- Some display features depend on hardware support
- Use display commands carefully in production
- Monitor display system during debugging
- Some display parameters may be reset on reboot
- Document display configuration changes
- Consider battery impact of display modifications
