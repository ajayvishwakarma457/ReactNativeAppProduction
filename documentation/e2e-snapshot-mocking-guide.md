# E2E Testing, Snapshot Testing & Native Mocking Guide

This guide details how to implement, configure, and execute testing strategies for React Native apps: **Snapshot Testing**, **Mocking Native Modules in Jest**, and **End-to-End (E2E) Testing** (using the currently configured Maestro tool and the Detox framework).

---

## 1. Mocking Native Modules in Jest

Because Jest runs in a Node.js command-line environment, native platform components and APIs (like MMKV, Firebase, or Custom Swift/Kotlin Modules) are unavailable. We must mock them so they do not throw errors.

### Implementation
We maintain a centralized mock file at [jestSetup.js](file:///Users/ajay/Documents/ReactNativeAppProduction/jestSetup.js).

* **Mocking standard third-party libraries**:
  ```javascript
  jest.mock('react-native-config', () => ({
    API_URL: 'https://api.example.com',
    APP_ENV: 'test',
  }));
  ```
* **Mocking Custom Native Modules**:
  We mock our custom native module `DeviceHelper` by injecting mock objects into `NativeModules`:
  ```javascript
  const { NativeModules } = require('react-native');
  NativeModules.DeviceHelper = {
    getDeviceModel: jest.fn(() => Promise.resolve('Mock Device')),
  };
  ```

---

## 2. Snapshot Testing

Snapshot testing captures the serialized render tree of a component and matches it against a reference file (`.snap`) to detect visual regressions.

### Implementation
We have implemented snapshot tests inside [Snapshot.test.tsx](file:///Users/ajay/Documents/ReactNativeAppProduction/__tests__/Snapshot.test.tsx):

```typescript
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { PostCard } from '../apps/app/src/feed/components/organisms/PostCard';

describe('PostCard Snapshots', () => {
  it('renders correctly in light theme', () => {
    const tree = ReactTestRenderer.create(
      <PostCard item={mockItem} theme={lightTheme} isLiked={false} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
```

### Commands
* **Run snapshot checks**:
  ```bash
  npm test
  ```
* **Update reference snapshots** (if UI layout intentionally changed):
  ```bash
  npx jest -u
  ```

---

## 3. End-to-End (E2E) Testing: Maestro vs. Detox

E2E testing launches a built native app binary inside a simulator and simulates real user interactions (taps, scrolls, text inputs).

### Option A: Maestro (Currently Configured)
We currently configure and recommend **Maestro** because it is faster, has zero native boilerplate, and compiles flows via simple YAML.

* **Flow Configuration**: Defined in [.maestro/main_flow.yaml](file:///Users/ajay/Documents/ReactNativeAppProduction/.maestro/main_flow.yaml):
  ```yaml
  appId: "org.reactjs.native.example.App"
  ---
  - clearState
  - launchApp
  - assertVisible: "Welcome to NativeApp"
  - tapOn: "☆ Bookmark"
  - assertVisible: "★ Bookmarked"
  ```
* **Execution**:
  ```bash
  # 1. Start simulator/emulator and compile app:
  npm run ios # or npm run android
  # 2. Run Maestro test suite:
  maestro test .maestro/main_flow.yaml
  ```

### Option B: Detox (Alternative)
Detox runs inside the native build system using JavaScript test files (Mocha/Jest).

* **Detox Setup Checklist**:
  1. Install global CLI: `npm install -g detox-cli`
  2. Install local dependencies: `npm install --save-dev detox`
  3. Create `.detoxrc.js` config pointing to your `.app` or `.apk` build path.
  4. Write test files (e.g. `e2e/firstTest.spec.js`):
     ```javascript
     describe('Main Flow', () => {
       beforeEach(async () => {
         await device.reloadReactNative();
       });

       it('should show welcome screen', async () => {
         await expect(element(by.text('Welcome to NativeApp'))).toBeVisible();
       });
     });
     ```
  5. Compile and execute:
     ```bash
     detox build -c ios.sim.debug
     detox test -c ios.sim.debug
     ```
