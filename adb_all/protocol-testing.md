# Protocol Testing - ADB Commands

## Description
Commands for testing network protocols, protocol compliance, and protocol-specific operations on Android devices.

### Basic Commands

Test HTTP protocol:
```sh
adb shell curl -v http://example.com
```

Test HTTPS protocol:
```sh
adb shell curl -v https://example.com
```

Test FTP protocol:
```sh
adb shell curl -v ftp://ftp.example.com
```

Test DNS protocol:
```sh
adb shell nslookup example.com
```

Check protocol support:
```sh
adb shell getprop | grep -E "protocol|ssl|tls"
```

### Advanced Commands

HTTP/HTTPS protocol testing:
```sh
#!/bin/bash
echo "=== HTTP/HTTPS Protocol Test ==="

# HTTP versions
echo "Testing HTTP/1.1:"
adb shell curl -v --http1.1 http://httpbin.org/get

echo "Testing HTTP/2:"
adb shell curl -v --http2 https://httpbin.org/get

# HTTPS protocols
echo "Testing TLS 1.2:"
adb shell curl -v --tlsv1.2 https://httpbin.org/get

echo "Testing TLS 1.3:"
adb shell curl -v --tlsv1.3 https://httpbin.org/get
```

WebSocket protocol testing:
```sh
# WebSocket handshake
adb shell curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" -H "Sec-WebSocket-Key: test" -H "Sec-WebSocket-Version: 13" http://echo.websocket.org
```

FTP/SFTP protocol testing:
```sh
# FTP connection test
adb shell curl -v ftp://ftp.example.com

# SFTP connection test
adb shell curl -v sftp://user:pass@example.com/path
```

SMTP/POP3/IMAP protocol testing:
```sh
# SMTP test
adb shell telnet smtp.gmail.com 587

# POP3 test
adb shell telnet pop.gmail.com 995

# IMAP test
adb shell telnet imap.gmail.com 993
```

Protocol compliance testing:
```sh
# HTTP compliance
adb shell curl -v --compressed http://httpbin.org/gzip
adb shell curl -v --location http://httpbin.org/redirect/1

# Certificate validation
adb shell curl -v --cacert /system/etc/security/cacerts httpbin.org
```

Protocol performance testing:
```sh
# HTTP performance
time adb shell curl -o /dev/null http://httpbin.org/bytes/1048576

# Protocol comparison
for protocol in "http://https://httpbin.org/get" "ftp://ftp.example.com"; do
  echo "Testing $protocol:"
  time adb shell curl -o /dev/null $protocol
done
```

Protocol security testing:
```sh
# SSL/TLS versions
for version in sslv2 sslv3 tlsv1 tlsv1.1 tlsv1.2 tlsv1.3; do
  echo "Testing $version:"
  adb shell curl -v --$version https://httpbin.org/get 2>&1 | grep -E "handshake|SSL|TLS"
done
```

Protocol debugging:
```sh
# Enable protocol debugging
adb shell setprop log.tag.NetworkSecurity VERBOSE
adb shell logcat | grep NetworkSecurity
```

Protocol header testing:
```sh
# Custom headers
adb shell curl -v -H "User-Agent: TestApp/1.0" -H "Accept: application/json" http://httpbin.org/get

# Header injection
adb shell curl -v -H "X-Custom-Header: TestValue" http://httpbin.org/headers
```

Protocol method testing:
```sh
# HTTP methods
for method in GET POST PUT DELETE PATCH; do
  echo "Testing $method:"
  adb shell curl -v -X $method http://httpbin.org/$method
done
```

Protocol authentication testing:
```sh
# Basic auth
adb shell curl -v -u user:pass http://httpbin.org/basic-auth/user/pass

# Bearer token
adb shell curl -v -H "Authorization: Bearer token123" http://httpbin.org/bearer
```

Protocol timeout testing:
```sh
# Connection timeout
adb shell curl -v --connect-timeout 5 http://httpbin.org/delay/10

# Total timeout
adb shell curl -v --max-time 10 http://httpbin.org/delay/15
```

Protocol compression testing:
```sh
# Compression support
adb shell curl -v --compressed http://httpbin.org/gzip
adb shell curl -v -H "Accept-Encoding: gzip,deflate" http://httpbin.org/gzip
```

### Examples

HTTP protocol test:
```sh
adb shell curl -v http://example.com
```

HTTPS protocol test:
```sh
adb shell curl -v https://example.com
```

Protocol comparison:
```sh
for protocol in http://example.com https://example.com; do
  echo "=== $protocol ==="
  time adb shell curl -o /dev/null $protocol
done
```

Complete protocol test:
```sh
#!/bin/bash
echo "=== Protocol Test Suite ==="

# HTTP/HTTPS
echo "Testing HTTP/HTTPS..."
adb shell curl -v http://httpbin.org/get
adb shell curl -v https://httpbin.org/get

# WebSocket
echo "Testing WebSocket..."
adb shell curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" http://echo.websocket.org

# FTP
echo "Testing FTP..."
adb shell curl -v ftp://ftp.example.com

echo "Protocol testing completed"
```

## Notes
- Protocol testing requires network connectivity
- Some protocols may not be supported on all devices
- HTTPS testing depends on certificate validation
- Protocol performance varies by network conditions
- Use protocol testing for app compatibility
- Consider security implications when testing protocols
- Some protocols may require additional packages
- Test protocols across different network types
