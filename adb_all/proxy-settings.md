# Proxy Settings - ADB Commands

## Description
Commands for configuring HTTP proxy settings, managing proxy connections, and network proxy configuration on Android devices.

### Basic Commands

Set HTTP proxy:
```sh
adb shell settings put global http_proxy 192.168.1.100:8080
```

Clear proxy settings:
```sh
adb shell settings put global http_proxy :0
```

Check current proxy:
```sh
adb shell settings get global http_proxy
```

Check proxy exclusion list:
```sh
adb shell settings get global http_proxy_exclusion_list
```

Set proxy exclusions:
```sh
adb shell settings put global http_proxy_exclusion_list "localhost,127.0.0.1"
```

### Advanced Commands

Set PAC file proxy:
```sh
adb shell settings put global pac_proxy_url http://proxy.example.com/proxy.pac
```

Check proxy status:
```sh
adb shell dumpsys connectivity | grep -E "proxy|Proxy"
```

Monitor proxy usage:
```sh
adb shell logcat | grep -E "proxy|Proxy"
```

Set proxy for specific network:
```sh
adb shell service call connectivity 32 i32 0 s16 "wlan0" s16 "192.168.1.100:8080"
```

Check proxy configuration:
```sh
adb shell content query --uri content://settings/global --projection name:value --where "name='http_proxy'"
```

Clear PAC proxy:
```sh
adb shell settings put global pac_proxy_url ""
```

Check proxy authentication:
```sh
adb shell settings get global proxy_user
adb shell settings get global proxy_password
```

Set proxy with authentication:
```sh
adb shell settings put global http_proxy "user:pass@192.168.1.100:8080"
```

Monitor proxy errors:
```sh
adb shell logcat | grep -E "proxy.*error|Proxy.*fail"
```

Check proxy bypass list:
```sh
adb shell settings get global proxy_exclusion_list
```

Set proxy bypass for localhost:
```sh
adb shell settings put global http_proxy_exclusion_list "127.0.0.1,localhost"
```

Check network proxy settings:
```sh
adb shell dumpsys connectivity | grep -A 5 "LinkProperties"
```

### Examples

Set HTTP proxy:
```sh
adb shell settings put global http_proxy 192.168.1.100:8080
```

Clear proxy settings:
```sh
adb shell settings put global http_proxy :0
```

Check current proxy configuration:
```sh
adb shell settings get global http_proxy
adb shell settings get global http_proxy_exclusion_list
```

Set proxy with exclusions:
```sh
adb shell settings put global http_proxy 192.168.1.100:8080
adb shell settings put global http_proxy_exclusion_list "localhost,127.0.0.1,*.local"
```

Configure PAC proxy:
```sh
adb shell settings put global pac_proxy_url http://proxy.example.com/proxy.pac
```

Monitor proxy usage:
```sh
adb shell logcat | grep -E "proxy|Proxy"
```

Check proxy for specific network:
```sh
adb shell dumpsys connectivity | grep -E "wlan0.*proxy|eth0.*proxy"
```

## Notes
- Proxy settings require appropriate permissions
- Some apps may ignore system proxy settings
- Proxy configuration may be overridden by VPN
- Use `settings get global http_proxy` to check current proxy
- Proxy settings affect all network connections
- Some networks block proxy configurations
- Proxy authentication may not work with all apps
- Use caution when configuring proxy on production devices
