# Turbo Modules (New Architecture)

This document details the configuration and implementation of a custom **Turbo Module** using React Native's New Architecture with type-safe **Codegen** integration.

---

## 1. Directory Structure & Architecture

Our custom module is structured cleanly inside the app workspaces:

```
ReactNativeAppProduction/
├── apps/app/
│   ├── package.json              # Contains codegenConfig settings
│   └── src/
│       ├── shared/specs/
│       │   └── NativeBatteryStatus.ts  # TypeScript Specification
│       └── apisPlayground/screens/
│           └── TurboModuleScreen.tsx   # React Native Screen Frontend
└── apps/app/ios/App/
    ├── BatteryStatus.h           # Objective-C Header conforming to Spec
    └── BatteryStatus.mm          # Objective-C++ Turbo Module Implementation
```

---

## 2. Step-by-Step Implementation

### Step 1: Define TypeScript Specification (`NativeBatteryStatus.ts`)
The JS spec file must start with the prefix `Native`. It defines the API signature mapping between JS and native platforms:

```typescript
import { TurboModule, TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  getBatteryStatus(): {
    level: number;
    isCharging: boolean;
  };
}

export default TurboModuleRegistry.getEnforcing<Spec>('BatteryStatus');
```

---

### Step 2: Configure Codegen in `package.json`
To tell React Native where to find our specification file, we configure the `codegenConfig` block inside `apps/app/package.json`:

```json
  "codegenConfig": {
    "name": "AppSpec",
    "type": "modules",
    "jsSrcsDir": "src/shared/specs"
  }
```

Running `pod install` automatically executes the Codegen compiler, creating the C++ header interfaces under `ReactCodegen` target output paths:
* Protocol defined: `@protocol NativeBatteryStatusSpec`
* Base wrapper: `NativeBatteryStatusSpecJSI`

---

### Step 3: Implement Native iOS logic (`BatteryStatus.mm`)
We implement the Objective-C++ module class conforming to the generated protocol and returning battery details from `UIDevice`:

```objc
#import "BatteryStatus.h"
#import <UIKit/UIKit.h>

@implementation BatteryStatus

RCT_EXPORT_MODULE(BatteryStatus);

- (NSDictionary *)getBatteryStatus {
  [UIDevice currentDevice].batteryMonitoringEnabled = YES;
  
  float level = [UIDevice currentDevice].batteryLevel;
  UIDeviceBatteryState state = [UIDevice currentDevice].batteryState;
  BOOL isCharging = (state == UIDeviceBatteryStateCharging || state == UIDeviceBatteryStateFull);
  
  return @{
    @"level": @(level >= 0 ? level * 100 : 50.0),
    @"isCharging": @(isCharging)
  };
}

// Map ObjC implementation back to C++ JSI object structure
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeBatteryStatusSpecJSI>(params);
}

@end
```

---

### Step 4: Frontend Screen Integration (`TurboModuleScreen.tsx`)
We import our Turbo Module specification directly in React Native and read native properties synchronously on button click:

```typescript
import BatteryStatus from '../../shared/specs/NativeBatteryStatus';

const res = BatteryStatus.getBatteryStatus();
console.log('Battery Status level:', res.level, 'isCharging:', res.isCharging);
```

---

## 3. Verification & Execution

To test the implementation in the iOS simulator:
1. Load the Navigation Drawer and navigate to **Turbo Module**.
2. Press the **Fetch Battery Status (JSI)** button.
3. The battery percentage and power state are pulled synchronously from iOS SDK layers.
