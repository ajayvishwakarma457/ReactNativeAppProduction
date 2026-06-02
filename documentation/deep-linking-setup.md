# React Native Deep Linking Setup Guide (URL Schemes & Universal/App Links)

This document provides a comprehensive configuration guide to set up and test deep linking using custom URL schemes and HTTP-based Universal Links (iOS) / App Links (Android) within a Bare CLI React Native application.

---

## 1. URL Schemes vs. Universal/App Links

| Type | Protocol | OS | Verification | Security |
| :--- | :--- | :--- | :--- | :--- |
| **Custom URL Scheme** | `rnp://<path>` | iOS & Android | None | Low (Multiple apps can register same scheme) |
| **Universal Links** | `https://rnp-app.com/<path>` | iOS | `apple-app-site-association` file on domain | High (Owner verification via SSL) |
| **App Links** | `https://rnp-app.com/<path>` | Android | `assetlinks.json` file on domain | High (Owner verification via SSL) |

---

## 2. iOS Configuration

### Step A: Configure Custom URL Scheme (`rnp://`)
1. Open `ios/App/Info.plist`.
2. Add the URL Type configuration:
   ```xml
   <key>CFBundleURLTypes</key>
   <array>
       <dict>
           <key>CFBundleURLSchemes</key>
           <array>
               <string>rnp</string>
           </array>
       </dict>
   </array>
   ```

### Step B: Configure Associated Domains (Universal Links)
1. Create a file `ios/App/App.entitlements`:
   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
   <plist version="1.0">
   <dict>
       <key>com.apple.developer.associated-domains</key>
       <array>
           <string>applinks:rnp-app.com</string>
       </array>
   </dict>
   </plist>
   ```
2. Link the entitlements file inside your Xcode project configurations build settings:
   ```text
   CODE_SIGN_ENTITLEMENTS = App/App.entitlements
   ```

### Step C: Update `AppDelegate.swift`
Handle incoming URLs in the application delegates:
```swift
import React

// Handle standard Custom URL Schemes (rnp://)
func application(
  _ application: UIApplication,
  open url: URL,
  options: [UIApplication.OpenURLOptionsKey : Any] = [:]
) -> Bool {
  return RCTLinkingManager.application(application, open: url, options: options)
}

// Handle Universal Links (https://rnp-app.com)
func application(
  _ application: UIApplication,
  continue userActivity: NSUserActivity,
  restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
) -> Bool {
  return RCTLinkingManager.application(application, continue: userActivity, restorationHandler: restorationHandler)
}
```

---

## 3. Android Configuration

### Step A: Configure Intent Filters
Open `android/app/src/main/AndroidManifest.xml` and add the intent-filters inside the `<activity>` tag of `.MainActivity`:

```xml
<!-- Custom URL Scheme rnp:// -->
<intent-filter android:label="@string/app_name">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="rnp" />
</intent-filter>

<!-- App Links https://rnp-app.com -->
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="http" />
    <data android:scheme="https" />
    <data android:host="rnp-app.com" />
</intent-filter>
```

---

## 4. React Navigation Configuration

Set up the `linking` configuration inside your main root `App.tsx` navigation block:

```typescript
const linking = {
  prefixes: ['rnp://', 'https://rnp-app.com'],
  config: {
    screens: {
      MainTabs: {
        screens: {
          HomeStack: {
            screens: {
              Home: 'home',
              Details: 'details/:title',
            },
          },
          Persistence: 'persistence',
          Profile: 'profile',
        },
      },
      HooksPlayground: 'hooks',
      Settings: 'settings',
      PermissionsPlayground: 'permissions',
    },
  },
};

// Pass it to the container:
<NavigationContainer linking={linking}>
  <RootNavigator />
</NavigationContainer>
```

---

## 5. Testing Deep Links

### iOS (Simulator)
Execute the simulator CLI command `openurl`:
```bash
# Test Custom Scheme
xcrun simctl openurl booted rnp://settings
xcrun simctl openurl booted rnp://hooks
xcrun simctl openurl booted rnp://details/MyCustomTitle

# Test Universal Link
xcrun simctl openurl booted https://rnp-app.com/settings
```

### Android (Emulator)
Use the Android Debug Bridge activity manager `am start` command:
```bash
# Test Custom Scheme
adb shell am start -W -a android.intent.action.VIEW -d "rnp://settings" org.reactjs.native.example.App

# Test App Link
adb shell am start -W -a android.intent.action.VIEW -d "https://rnp-app.com/hooks" org.reactjs.native.example.App
```
