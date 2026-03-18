# Expert Commands - ADB Commands

## Description
Expert-level ADB commands, advanced system manipulation, and specialized operations.

### Basic Commands
System-level access:
```sh
adb shell su -c "mount -o rw,remount /system"
```

Kernel module control:
```sh
adb shell insmod /system/lib/modules/module.ko
```

Advanced system info:
```sh
adb shell cat /proc/config.gz | gunzip
```

### Advanced Commands
System modification:
```sh
adb shell su -c "mount -o rw,remount /system && echo 'ro.debuggable=1' >> /system/build.prop"
```

Advanced debugging:
```sh
adb shell "gdbserver :5039 --attach $(pidof com.example.app)"
```

Kernel debugging:
```sh
adb shell "echo 'file kernel/sched.c +p' > /sys/kernel/debug/dynamic_debug/control"
```

Advanced profiling:
```sh
adb shell "perf record -g -p $(pidof com.example.app) -- sleep 10"
```

System call tracing:
```sh
adb shell "strace -f -p $(pidof com.example.app) -o trace.log"
```

Advanced memory analysis:
```sh
adb shell "cat /proc/$(pidof com.example.app)/smaps"
```

Hardware register access:
```sh
adb shell "devmem2 0x12345678 w 0xabcdef"
```

Bootloader manipulation:
```sh
adb shell "dd if=/dev/zero of=/dev/block/bootdevice/by-name/boot"
```

Advanced network analysis:
```sh
adb shell "tcpdump -i any -w capture.pcap host 8.8.8.8"
```

System recovery:
```sh
adb shell "mount -o rw,remount /system && cp /system/build.prop.bak /system/build.prop"
```

Expert device control:
```sh
adb shell "service call activity 42 i32 1"
```

## Notes
- Expert commands require root access
- These commands can brick devices if used incorrectly
- Always backup before system modifications
- Use only if you understand the consequences
- Some commands may void warranty
- Test on non-production devices only
