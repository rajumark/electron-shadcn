# API Testing - ADB Commands

## Description
Commands for API testing Android applications, testing REST APIs, web services, and network communication through ADB.

### Basic Commands

Test API connectivity:
```sh
adb shell ping -c 4 api.example.com
```

Check network connectivity:
```sh
adb shell dumpsys connectivity | grep -E "NetworkAgentInfo|LinkProperties"
```

Test HTTP request:
```sh
adb shell curl -I http://api.example.com
```

Check DNS resolution:
```sh
adb shell nslookup api.example.com
```

Monitor network traffic:
```sh
adb shell logcat | grep -E "network|http|api"
```

### Advanced Commands

API endpoint testing:
```sh
adb shell curl -X GET "http://api.example.com/users" -H "Authorization: Bearer token"
```

POST request testing:
```sh
adb shell curl -X POST "http://api.example.com/data" -H "Content-Type: application/json" -d '{"key":"value"}'
```

API authentication testing:
```sh
adb shell curl -X GET "http://api.example.com/secure" -H "Authorization: Bearer $TOKEN"
```

API response testing:
```sh
adb shell curl -X GET "http://api.example.com/status" | jq .
```

API load testing:
```sh
for i in {1..100}; do
  adb shell curl -X GET "http://api.example.com/load" &
done
```

Mock server testing:
```sh
adb shell curl -X POST "http://localhost:3000/mock" -d '{"response":"mock_data"}'
```

API error handling testing:
```sh
adb shell curl -X GET "http://api.example.com/error" -w "%{http_code}\n"
```

API timeout testing:
```sh
adb shell curl -X GET "http://api.example.com/slow" --max-time 5
```

HTTPS API testing:
```sh
adb shell curl -X GET "https://api.example.com/secure" --insecure
```

API version testing:
```sh
adb shell curl -X GET "http://api.example.com/v1/data"
adb shell curl -X GET "http://api.example.com/v2/data"
```

WebSocket testing:
```sh
adb shell curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" -H "Sec-WebSocket-Key: key" -H "Sec-WebSocket-Version: 13" http://api.example.com/ws
```

API performance testing:
```sh
time adb shell curl -X GET "http://api.example.com/performance"
```

### Examples

Basic API connectivity test:
```sh
adb shell ping -c 4 api.example.com
adb shell curl -I http://api.example.com
```

REST API testing:
```sh
adb shell curl -X GET "http://api.example.com/users/123" -H "Authorization: Bearer token123"
adb shell curl -X POST "http://api.example.com/users" -H "Content-Type: application/json" -d '{"name":"John"}'
```

API load testing:
```sh
for i in {1..50}; do
  adb shell curl -X GET "http://api.example.com/load" &
  sleep 0.1
done
```

API error handling test:
```sh
adb shell curl -X GET "http://api.example.com/nonexistent" -w "%{http_code}\n"
adb shell curl -X POST "http://api.example.com/invalid" -d "invalid_data"
```

API performance test:
```sh
time adb shell curl -X GET "http://api.example.com/performance"
adb shell curl -X GET "http://api.example.com/performance" -w "Time: %{time_total}s\n"
```

## Notes
- API testing requires network connectivity
- Some endpoints may require authentication tokens
- Use proper HTTP methods for API testing
- Monitor logcat for API-related errors
- API testing may affect server performance
- Test both success and failure scenarios
- Consider rate limiting in API tests
- Use appropriate headers for API requests
