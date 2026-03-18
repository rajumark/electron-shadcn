# Proxy Testing - ADB Commands

## Description
Commands for testing proxy configurations, monitoring proxy connections, and proxy performance analysis.

### Basic Commands

Check proxy settings:
```sh
adb shell settings get global http_proxy
```

Set HTTP proxy:
```sh
adb shell settings put global http_proxy 192.168.1.100:8080
```

Clear proxy settings:
```sh
adb shell settings put global http_proxy :0
```

Test proxy connectivity:
```sh
adb shell curl -x http://192.168.1.100:8080 http://example.com
```

Check proxy exclusion list:
```sh
adb shell settings get global http_proxy_exclusion_list
```

### Advanced Commands

Proxy configuration testing:
```sh
#!/bin/bash
echo "=== Proxy Configuration Test ==="

# Test HTTP proxy
echo "Testing HTTP proxy..."
adb shell settings put global http_proxy 192.168.1.100:8080
adb shell curl -v -x http://192.168.1.100:8080 http://httpbin.org/ip

# Test HTTPS proxy
echo "Testing HTTPS proxy..."
adb shell curl -v -x http://192.168.1.100:8080 https://httpbin.org/ip

# Test SOCKS proxy
echo "Testing SOCKS proxy..."
adb shell curl -v --socks5 192.168.1.100:1080 http://httpbin.org/ip
```

Proxy authentication testing:
```sh
# Test proxy with authentication
adb shell curl -v -x http://user:pass@192.168.1.100:8080 http://httpbin.org/ip

# Test different auth methods
for auth in "basic" "digest" "ntlm"; do
  echo "Testing $auth authentication:"
  adb shell curl -v --proxy-auth $auth user:pass -x http://192.168.1.100:8080 http://httpbin.org/ip
done
```

Proxy performance testing:
```sh
#!/bin/bash
echo "=== Proxy Performance Test ==="

# Direct connection
echo "Direct connection:"
time adb shell curl -o /dev/null http://httpbin.org/bytes/1048576

# Through proxy
echo "Through proxy:"
time adb shell curl -o /dev/null -x http://192.168.1.100:8080 http://httpbin.org/bytes/1048576

# Performance comparison
for i in {1..5}; do
  echo "Test $i:"
  time adb shell curl -o /dev/null http://httpbin.org/ip
  time adb shell curl -o /dev/null -x http://192.168.1.100:8080 http://httpbin.org/ip
done
```

Proxy protocol testing:
```sh
# Test different proxy protocols
protocols=("http://192.168.1.100:8080" "https://192.168.1.100:8443" "socks5://192.168.1.100:1080")

for protocol in "${protocols[@]}"; do
  echo "Testing $protocol:"
  adb shell curl -v -x $protocol http://httpbin.org/ip
done
```

Proxy exclusion testing:
```sh
# Set proxy with exclusions
adb shell settings put global http_proxy 192.168.1.100:8080
adb shell settings put global http_proxy_exclusion_list "localhost,127.0.0.1,*.local"

# Test exclusions
echo "Testing proxy exclusions:"
adb shell curl -v http://localhost/test
adb shell curl -v http://127.0.0.1/test
adb shell curl -v http://example.local/test
```

Proxy failover testing:
```sh
# Test proxy failover
proxies=("192.168.1.100:8080" "192.168.1.101:8080" "192.168.1.102:8080")

for proxy in "${proxies[@]}"; do
  echo "Testing proxy $proxy:"
  if adb shell curl -v -x http://$proxy http://httpbin.org/ip; then
    echo "Proxy $proxy is working"
    break
  else
    echo "Proxy $proxy failed"
  fi
done
```

Proxy debugging:
```sh
# Enable proxy debugging
adb shell setprop log.tag.Proxy VERBOSE
adb shell logcat | grep Proxy

# Monitor proxy connections
adb shell logcat | grep -E "proxy|Proxy|PROXY"
```

Proxy security testing:
```sh
# Test proxy SSL verification
adb shell curl -v -x https://192.168.1.100:8080 https://httpbin.org/ip

# Test proxy certificate issues
adb shell curl -v -k -x https://192.168.1.100:8080 https://httpbin.org/ip
```

Proxy load testing:
```sh
#!/bin/bash
echo "=== Proxy Load Test ==="

# Multiple concurrent requests through proxy
for i in {1..20}; do
  adb shell curl -x http://192.168.1.100:8080 http://httpbin.org/ip &
done

wait
echo "Load test completed"
```

Proxy monitoring:
```sh
while true; do
  echo "=== Proxy Status $(date) ==="
  adb shell settings get global http_proxy
  adb shell logcat -d | grep -E "proxy|Proxy" | tail -5
  sleep 60
done
```

App-specific proxy testing:
```sh
# Test app proxy settings
adb shell am start -n com.example.app/.MainActivity
sleep 3
# Monitor app network traffic through proxy
adb shell logcat | grep -E "com.example|proxy"
```

### Examples

Basic proxy test:
```sh
adb shell settings put global http_proxy 192.168.1.100:8080
adb shell curl -x http://192.168.1.100:8080 http://example.com
```

Proxy authentication:
```sh
adb shell curl -v -x http://user:pass@192.168.1.100:8080 http://example.com
```

Proxy performance comparison:
```sh
echo "Direct connection:"
time adb shell curl -o /dev/null http://example.com
echo "Through proxy:"
time adb shell curl -o /dev/null -x http://192.168.1.100:8080 http://example.com
```

Complete proxy test:
```sh
#!/bin/bash
echo "=== Complete Proxy Test ==="

# Set proxy
adb shell settings put global http_proxy 192.168.1.100:8080

# Test connectivity
echo "Testing connectivity through proxy:"
adb shell curl -v -x http://192.168.1.100:8080 http://httpbin.org/ip

# Test performance
echo "Testing performance:"
time adb shell curl -o /dev/null -x http://192.168.1.100:8080 http://httpbin.org/bytes/1048576

# Clear proxy
adb shell settings put global http_proxy :0

echo "Proxy test completed"
```

## Notes
- Proxy testing requires proxy server availability
- Some apps may ignore system proxy settings
- Proxy authentication may be required for corporate networks
- Proxy can significantly impact network performance
- Test proxy connectivity before deployment
- Monitor proxy logs for troubleshooting
- Some networks block proxy configurations
- Consider security implications when using proxies
