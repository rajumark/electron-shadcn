# Shell Access - ADB Commands

## Description
Commands for accessing Android shell, managing shell sessions, and shell scripting operations.

### Basic Commands

Access Android shell:
```sh
adb shell
```

Run single shell command:
```sh
adb shell ls -la
```

Get root shell:
```sh
adb shell su
```

Check shell user:
```sh
adb shell whoami
```

Exit shell:
```sh
exit
```

### Advanced Commands

Run shell script:
```sh
adb shell sh /sdcard/script.sh
```

Execute multiple commands:
```sh
adb shell "ls -la && ps -A"
```

Run command as specific user:
```sh
adb shell su -c "command"
```

Check shell environment:
```sh
adb shell env
```

Get shell prompt:
```sh
adb shell -t
```

Run command with output redirection:
```sh
adb shell "ls -la > /sdcard/output.txt"
```

Check shell version:
```sh
adb shell $SHELL --version
```

Monitor shell processes:
```sh
adb shell ps -A | grep shell
```

Run shell in background:
```sh
adb shell "command &"
```

Check shell history:
```sh
adb shell cat ~/.ash_history
```

Set shell variable:
```sh
adb shell "VAR=value && echo \$VAR"
```

Run shell with specific directory:
```sh
adb shell "cd /sdcard && ls -la"
```

Execute shell function:
```sh
adb shell "myfunc() { echo hello; }; myfunc"
```

### Examples

Access shell and run commands:
```sh
adb shell
$ ls -la
$ ps -A
$ exit
```

Run multiple commands:
```sh
adb shell "cd /sdcard && ls -la && pwd"
```

Execute shell script:
```sh
adb shell sh /sdcard/myscript.sh
```

Run command as root:
```sh
adb shell su -c "mount -o rw,remount /system"
```

Check shell environment:
```sh
adb shell env | grep -E "PATH|HOME|USER"
```

Monitor shell processes:
```sh
adb shell ps -A | grep -E "shell|su"
```

Run command with output:
```sh
adb shell "dmesg | grep -E 'error|warn' > /sdcard/errors.txt"
```

## Notes
- Shell access requires appropriate permissions
- Root shell requires rooted device
- Some shell commands may be restricted
- Use `adb shell` for interactive sessions
- Shell environment varies by Android version
- Some commands require busybox installation
- Use `su` for privileged operations
- Shell scripting can automate complex tasks
