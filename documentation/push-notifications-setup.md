# React Native Push Notifications (FCM / APNs Setup Guide)

This document provides a comprehensive, step-by-step configuration guide to integrate push notifications in a Bare CLI React Native application using **Firebase Cloud Messaging (FCM)** and **Apple Push Notification service (APNs)** via `@react-native-firebase/messaging`.

---

## 1. Package Installation

Install the React Native Firebase core app and messaging packages:

```bash
npm install @react-native-firebase/app @react-native-firebase/messaging
```

---

## 2. Android Configuration (FCM)

Android utilizes FCM directly for delivering push messages.

### Step A: Create Firebase Project
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and follow the setup flow.
3. Click the **Android Icon** to add an Android application.
   * Provide the package name (found in `android/app/build.gradle` -> `applicationId`, e.g., `org.reactjs.native.example.App`).
4. Download the generated `google-services.json` file.
5. Place this file inside your project at:
   ```text
   android/app/google-services.json
   ```

### Step B: Configure Gradle Dependencies
1. Open **`android/build.gradle`** and add the Google Services classpath inside the `buildscript` block:
   ```gradle
   buildscript {
       dependencies {
           // ...
           classpath 'com.google.gms:google-services:4.4.1'
       }
   }
   ```
2. Open **`android/app/build.gradle`** and apply the plugin at the top:
   ```gradle
   apply plugin: 'com.android.application'
   apply plugin: 'com.google.gms.google-services' // Add this line
   ```

---

## 3. iOS Configuration (APNs & FCM)

iOS uses Apple's APNs to deliver messages. Firebase serves as a gateway to translate FCM payloads to APNs.

### Step A: Configure Firebase App
1. Inside your Firebase Console project settings, click **Add App** and select **iOS**.
2. Provide the iOS Bundle Identifier (found in Xcode under General -> Identity -> Bundle Identifier).
3. Download `GoogleService-Info.plist`.
4. Open the project in Xcode, right-click on the main app folder, select **Add Files to "App"**, and choose `GoogleService-Info.plist` (make sure **Copy items if needed** is checked).

### Step B: Setup Apple Developer Capabilities
1. Log in to the [Apple Developer Account](https://developer.apple.com/).
2. Under **Certificates, Identifiers & Profiles**, select **Keys**.
3. Create a new Key, check **Apple Push Notifications service (APNs)**, and download the `.p8` key file.
4. Back in the Firebase Console (Project Settings -> Cloud Messaging -> iOS app configuration):
   * Upload the `.p8` key.
   * Provide the Key ID (10-character string from the portal) and Team ID (from Apple membership).

### Step C: Configure Xcode Capabilities
1. Open your project in Xcode.
2. Select the target **App** and open the **Signing & Capabilities** tab.
3. Click **+ Capability** and add:
   * **Push Notifications**
   * **Background Modes** (check **Remote notifications** and **Background fetch**).

### Step D: Update AppDelegate.swift

Ensure `FirebaseApp.configure()` is initialized on startup inside `ios/App/AppDelegate.swift`:

```swift
import FirebaseCore // Add at the top

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    FirebaseApp.configure() // Add this line before starting React Native
    
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "App",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }
}
```

---

## 4. Usage in TypeScript

Implement the notifications manager to request permissions and capture incoming payloads.

```typescript
import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';

// 1. Request Permission
async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

// 2. Fetch FCM Token
async function getFCMToken() {
  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    console.log('Your FCM Token is:', fcmToken);
  }
}

// 3. Setup Payloads Listeners
function setupNotificationListeners() {
  // Foreground Listener
  const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
    Alert.alert(
      remoteMessage.notification?.title || 'Notification',
      remoteMessage.notification?.body || ''
    );
  });

  // Background Click Listener
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('Notification clicked from background:', remoteMessage);
  });

  return unsubscribeForeground;
}
```

---

## 5. Sending Test Notifications

To test notification deliveries:
1. Copy the **FCM Device Token** logged during app startup.
2. Go to Firebase Console -> **Engage** -> **Messaging** -> **Create your first campaign**.
3. Choose **Firebase Notification messages**, type a Title and Body.
4. Click **Send test message**, paste your device token, and click **Test**.
