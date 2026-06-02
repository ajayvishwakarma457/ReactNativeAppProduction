# React Native Permissions Configuration Guide

This document outlines the step-by-step setup and implementation of platform permissions (Camera, Location, and Notifications) in a React Native Bare CLI project using `react-native-permissions`.

---

## 1. Package Installation

Install the package and TypeScript types using your package manager:

```bash
npm install react-native-permissions
```

---

## 2. iOS Configuration

iOS permissions must be explicitly requested and configured at both the pod dependency level and the system description level.

### Step A: Configure Handlers in Podfile
Open `ios/Podfile` and configure which permission handlers to compile:

```ruby
# 1. Require the setup script at the very top of Podfile:
require_relative '../node_modules/react-native-permissions/scripts/setup.rb'

# 2. Add handlers to target 'App' configuration block:
target 'App' do
  setup_permissions([
    'Camera',
    'LocationAlways',
    'LocationWhenInUse',
    'Notifications',
  ])

  # ... standard react native configuration hooks
end
```

### Step B: Add Usage Descriptions in Info.plist
Open `ios/App/Info.plist` and insert the descriptive strings explaining *why* your app requires access to these native resources:

```xml
<key>NSCameraUsageDescription</key>
<string>This app requires camera access to showcase dynamic camera permission checking and usage.</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app requires location access when open to demonstrate runtime permission request states.</string>
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>This app requires location access always to demonstrate background location permission states.</string>
<key>NSLocationAlwaysUsageDescription</key>
<string>This app requires location access always to demonstrate background location permission states.</string>
```

### Step C: Run CocoaPods Linker
Apply dependencies updates:

```bash
cd ios
pod install
```

---

## 3. Android Configuration

Android permissions must be declared in the application manifest.

### Step A: Declare Permissions in Manifest
Open `android/app/src/main/AndroidManifest.xml` and insert the permission tags within the `<manifest>` block:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Permissions Declarations -->
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" /> <!-- Android 13+ -->

    <application ...>
        <!-- ... -->
    </application>
</manifest>
```

---

## 4. Usage in TypeScript

Implement the checking and requesting flows inside your React/TypeScript screen components.

```typescript
import { Platform } from 'react-native';
import { 
  check, 
  request, 
  PERMISSIONS, 
  RESULTS, 
  checkNotifications, 
  requestNotifications,
  PermissionStatus
} from 'react-native-permissions';

// 1. Resolve platform specific permissions targets
const getTargetPermissions = () => {
  const camera = Platform.select({
    ios: PERMISSIONS.IOS.CAMERA,
    android: PERMISSIONS.ANDROID.CAMERA,
  })!;

  const location = Platform.select({
    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  })!;

  return { camera, location };
};

// 2. Checking Statuses
const checkAllPermissions = async () => {
  const targets = getTargetPermissions();
  
  const cameraStatus = await check(targets.camera);
  const locationStatus = await check(targets.location);
  const notificationsStatus = (await checkNotifications()).status;
  
  console.log({ cameraStatus, locationStatus, notificationsStatus });
};

// 3. Requesting access
const requestCameraAccess = async () => {
  const targets = getTargetPermissions();
  const result = await request(targets.camera);
  
  if (result === RESULTS.GRANTED) {
    console.log('Camera access granted!');
  }
};
```
