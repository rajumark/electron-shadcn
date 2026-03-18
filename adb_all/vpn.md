# VPN - ADB Commands

## Description
Commands for managing VPN connections, configuring VPN settings, and monitoring VPN status on Android devices.

### Basic Commands

Check VPN status:
```sh
adb shell dumpsys connectivity | grep -E "vpn|VPN"
```

List VPN apps:
```sh
adb shell pm list packages | grep -i vpn
```

Check active VPN connection:
```sh
adb shell dumpsys connectivity | grep -E "NetworkAgentInfo.*vpn"
```

Get VPN settings:
```sh
adb shell settings get secure vpn_settings
```

Check VPN permissions:
```sh
adb shell dumpsys package | grep -E "vpn|network"
```

### Advanced Commands

Start VPN service:
```sh
adb shell am startservice -a android.intent.action.VPN_CONNECT
```

Stop VPN service:
```sh
adb shell am startservice -a android.intent.action.VPN_DISCONNECT
```

Check VPN configuration:
```sh
adb shell content query --uri content://settings/secure --projection name:value --where "name='vpn_settings'"
```

Monitor VPN events:
```sh
adb shell logcat | grep -E "vpn|VPN|connectivity.*vpn"
```

Check VPN network info:
```sh
adb shell dumpsys connectivity | grep -A 10 "NetworkAgentInfo.*vpn"
```

Get VPN interface:
```sh
adb shell ip addr show | grep -E "vpn|tun|ppp"
```

Check VPN DNS:
```sh
adb shell getprop net.dns1
adb shell getprop net.dns2
```

Monitor VPN traffic:
```sh
adb shell dumpsys netstats | grep -E "vpn|tun"
```

Check VPN always-on:
```sh
adb shell settings get secure always_on_vpn_app
```

Set VPN always-on:
```sh
adb shell settings put secure always_on_vpn_app com.example.vpn
```

Check VPN lockdown:
```sh
adb shell settings get secure vpn_lockdown
```

Monitor VPN connection:
```sh
adb shell watch -n 2 "dumpsys connectivity | grep -E vpn"
```

### Examples

Check current VPN status:
```sh
adb shell dumpsys connectivity | grep -E "vpn|VPN"
```

Monitor VPN connection events:
```sh
adb shell logcat | grep -E "vpn.*connect|VPN.*state"
```

Check VPN network configuration:
```sh
adb shell dumpsys connectivity | grep -A 10 "NetworkAgentInfo.*vpn"
```

List installed VPN apps:
```sh
adb shell pm list packages | grep -i vpn
```

Check VPN DNS settings:
```sh
adb shell getprop | grep dns
```

Monitor VPN traffic:
```sh
adb shell dumpsys netstats | grep -E "vpn|tun.*bytes"
```

Set always-on VPN:
```sh
adb shell settings put secure always_on_vpn_app com.example.vpn
adb shell settings put secure vpn_lockdown 1
```

## Notes
- VPN management requires appropriate permissions
- Some VPN features require specific Android versions
- VPN settings may be controlled by device admin
- Use `dumpsys connectivity` for comprehensive VPN info
- VPN connections may affect network performance
- Some VPN apps have custom ADB interfaces
- Always-on VPN may require device admin privileges
- Use caution when modifying VPN configuration
