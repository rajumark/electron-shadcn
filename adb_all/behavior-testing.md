# Behavior Testing - ADB Commands

## Description
Commands for behavior testing Android applications, behavior-driven development (BDD), and user behavior simulation.

### Basic Commands

Test user behavior patterns:
```sh
adb shell monkey -p com.example.app --pct-touch 60 --pct-motion 20 --pct-nav 20 1000
```

Simulate user journey:
```sh
adb shell am start -n com.example.app/.MainActivity
sleep 3
adb shell input tap 500 1000
sleep 2
adb shell input swipe 100 200 300 400
```

Test app behavior under stress:
```sh
adb shell monkey -p com.example.app --throttle 50 --pct-appswitch 10 2000
```

Monitor behavior changes:
```sh
adb shell logcat | grep -E "behavior|user|action"
```

Test expected behavior:
```sh
adb shell am instrument -w -e class com.example.app.BehaviorTest com.example.app.test/androidx.test.runner.AndroidJUnitRunner
```

### Advanced Commands

Behavior-driven testing setup:
```sh
adb shell am instrument -w -e annotation com.example.annotation.BehaviorTest com.example.app.behavior.test/androidx.test.runner.AndroidJUnitRunner
```

Test user story scenarios:
```sh
adb shell am instrument -w -e story "user_login" com.example.app.behavior.test/androidx.test.runner.AndroidJUnitRunner
```

Simulate specific user behavior:
```sh
#!/bin/bash
# Simulate user checking email behavior
adb shell am start -n com.example.app/.MainActivity
sleep 3
adb shell input tap 100 500  # Tap email icon
sleep 2
adb shell input swipe 300 800 300 200  # Swipe to refresh
sleep 3
adb shell input tap 200 300  # Tap first email
sleep 2
adb shell input keyevent KEYCODE_BACK
```

Test app behavior with different inputs:
```sh
for input in "valid_user" "invalid_user" "admin_user"; do
  echo "=== Testing with input: $input ==="
  adb shell am start -n com.example.app/.LoginActivity
  sleep 2
  adb shell input text "$input"
  adb shell input keyevent KEYCODE_ENTER
  sleep 3
done
```

Behavior testing with scenarios:
```sh
adb shell am instrument -w -e scenarios "login,logout,profile_update" com.example.app.behavior.test/androidx.test.runner.AndroidJUnitRunner
```

Test expected vs actual behavior:
```sh
adb shell am instrument -w -e expected "login_success" com.example.app.behavior.test/androidx.test.runner.AndroidJUnitRunner
```

Monitor user behavior analytics:
```sh
adb shell logcat | grep -E "analytics|tracking|behavior"
```

Test app behavior under different conditions:
```sh
# Test with low memory
adb shell am send-trim-memory com.example.app RUNNING_LOW
adb shell am start -n com.example.app/.MainActivity

# Test with network issues
adb shell svc data disable
adb shell am start -n com.example.app/.NetworkActivity
adb shell svc data enable
```

Behavior testing with mock data:
```sh
adb shell am broadcast -a com.example.MOCK_USER_BEHAVIOR -e action "login" -e user_type "premium" -e usage_pattern "heavy"
adb shell am start -n com.example.app/.MainActivity
```

Test multi-step user workflows:
```sh
#!/bin/bash
# Complete user journey: browse -> add to cart -> checkout
adb shell am start -n com.example.app/.MainActivity
sleep 3
adb shell input tap 200 400  # Browse products
sleep 2
adb shell input tap 300 600  # Select product
sleep 2
adb shell input tap 400 800  # Add to cart
sleep 2
adb shell input tap 500 1000 # Checkout
sleep 3
```

Behavior testing with A/B scenarios:
```sh
adb shell am instrument -w -e variant "A" com.example.app.behavior.test/androidx.test.runner.AndroidJUnitRunner
adb shell am instrument -w -e variant "B" com.example.app.behavior.test/androidx.test.runner.AndroidJUnitRunner
```

Test accessibility behavior:
```sh
adb shell settings put secure talkback_enabled 1
adb shell am start -n com.example.app/.MainActivity
adb shell input keyevent KEYCODE_TAB
adb shell input keyevent KEYCODE_ENTER
```

### Examples

User behavior simulation:
```sh
#!/bin/bash
echo "=== User Behavior Simulation ==="

# Simulate typical user session
adb shell am start -n com.example.app/.MainActivity
sleep 3
adb shell input tap 500 1000  # Tap main feature
sleep 2
adb shell input swipe 100 200 300 400  # Swipe gesture
sleep 2
adb shell input keyevent KEYCODE_BACK  # Go back
sleep 1
adb shell input keyevent KEYCODE_HOME  # Exit app
```

Behavior testing scenarios:
```sh
adb shell am instrument -w -e scenario "new_user_onboarding" com.example.app.behavior.test/androidx.test.runner.AndroidJUnitRunner
adb shell am instrument -w -e scenario "returning_user_session" com.example.app.behavior.test/androidx.test.runner.AndroidJUnitRunner
adb shell am instrument -w -e scenario "power_user_workflow" com.example.app.behavior.test/androidx.test.runner.AndroidJUnitRunner
```

Test app behavior under stress:
```sh
adb shell monkey -p com.example.app --throttle 25 --pct-touch 70 --pct-motion 30 5000
adb shell dumpsys activity | grep -E "ANR|crash|com.example.app"
```

Behavior validation:
```sh
adb shell am instrument -w -e validate_behavior true com.example.app.behavior.test/androidx.test.runner.AndroidJUnitRunner
```

## Notes
- Behavior testing focuses on user experience
- Test realistic user scenarios and workflows
- Monitor app behavior under various conditions
- Document expected vs actual behavior
- Use consistent scenarios for comparison
- Behavior testing complements unit and integration tests
- Consider different user types and usage patterns
- Test edge cases and unusual user behavior
