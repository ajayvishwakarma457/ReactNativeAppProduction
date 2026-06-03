# Writing Custom Native Modules Guide (Kotlin & Swift)

This guide walks through creating, registering, and consuming custom Native Modules in React Native using Kotlin (Android) and Swift (iOS).

We have implemented a concrete example module called `DeviceHelper` that retrieves device models from native platform APIs and exposes them to JavaScript via a unified wrapper.

---

## 1. Android Implementation (Kotlin)

To create a native module in Android, you need a module class (extends `ReactContextBaseJavaModule`) and a package class (extends `ReactPackage`).

### Step 1: Create the Module Class
We created [DeviceHelperModule.kt](file:///Users/ajay/Documents/ReactNativeAppProduction/apps/app/android/app/src/main/java/com/app/DeviceHelperModule.kt):
```kotlin
package com.app

import android.os.Build
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class DeviceHelperModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    // Defines the module name exposed to JS: NativeModules.DeviceHelper
    override fun getName(): String = "DeviceHelper"

    @ReactMethod
    fun getDeviceModel(promise: Promise) {
        try {
            val model = Build.MODEL
            val manufacturer = Build.MANUFACTURER
            promise.resolve("$manufacturer $model")
        } catch (e: Exception) {
            promise.reject("ERR_DEVICE_INFO", "Failed to retrieve device model", e)
        }
    }
}
```

### Step 2: Create and Register the Package
We created [DeviceHelperPackage.kt](file:///Users/ajay/Documents/ReactNativeAppProduction/apps/app/android/app/src/main/java/com/app/DeviceHelperPackage.kt) and added it to the `packageList` inside [MainApplication.kt](file:///Users/ajay/Documents/ReactNativeAppProduction/apps/app/android/app/src/main/java/com/app/MainApplication.kt):
```kotlin
package com.app

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import java.util.ArrayList

class DeviceHelperPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        val modules = ArrayList<NativeModule>()
        modules.add(DeviceHelperModule(reactContext))
        return modules
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> = emptyList()
}
```

---

## 2. iOS Implementation (Swift & Objective-C)

To expose Swift code to React Native, you write a Swift class extending `NSObject` and use an Objective-C bridging macro file (`.m`) to export it.

### Step 1: Implement the Swift Module
We created [DeviceHelper.swift](file:///Users/ajay/Documents/ReactNativeAppProduction/apps/app/ios/App/DeviceHelper.swift):
```swift
import Foundation
import React

@objc(DeviceHelper)
class DeviceHelper: NSObject {
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false // Set to true if module requires main UI thread setup
  }
  
  @objc
  func getDeviceModel(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    #if targetEnvironment(simulator)
      let model = "iOS Simulator (\(UIDevice.current.model))"
    #else
      let model = UIDevice.current.name
    #endif
    resolve(model)
  }
}
```

### Step 2: Export Module Methods (Objective-C Bridge)
We created [DeviceHelper.m](file:///Users/ajay/Documents/ReactNativeAppProduction/apps/app/ios/App/DeviceHelper.m):
```objc
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(DeviceHelper, NSObject)

RCT_EXTERN_METHOD(getDeviceModel:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
```

---

## 3. JavaScript Interface Wrapper

To consume the Native Module cleanly in your React codebase:

We created the service wrapper [deviceHelper.ts](file:///Users/ajay/Documents/ReactNativeAppProduction/libs/shared/src/services/deviceHelper.ts):
```typescript
import { NativeModules } from 'react-native';

const { DeviceHelper } = NativeModules;

export interface IDeviceHelper {
  getDeviceModel(): Promise<string>;
}

export const deviceHelper: IDeviceHelper = {
  getDeviceModel: async (): Promise<string> => {
    if (!DeviceHelper) {
      return 'Unknown Device (Helper not available)';
    }
    return DeviceHelper.getDeviceModel();
  },
};
```

### Code Usage
```typescript
import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { deviceHelper } from '@app/shared/services/deviceHelper';

export const MyComponent = () => {
  const [deviceModel, setDeviceModel] = useState('');

  useEffect(() => {
    deviceHelper.getDeviceModel().then(setDeviceModel);
  }, []);

  return <Text>Running on: {deviceModel}</Text>;
};
```
