# Hermes Engine Configuration and Profiling Guide

Hermes is the default JavaScript engine optimized specifically for running React Native applications. This guide details how to verify Hermes configuration in our monorepo workspace, capture performance traces, profile CPU/Memory behavior, and analyze production performance.

---

## 1. Verifying Hermes Configuration

Hermes is configured and enabled by default in both native platforms in our project:

* **Android Configuration**: Inside [gradle.properties](file:///Users/ajay/Documents/ReactNativeAppProduction/apps/app/android/gradle.properties):
  ```properties
  hermesEnabled=true
  ```
* **iOS Configuration**: Inside [project.pbxproj](file:///Users/ajay/Documents/ReactNativeAppProduction/apps/app/ios/App.xcodeproj/project.pbxproj):
  ```ruby
  USE_HERMES = true;
  ```

### Runtime Verification
To programmatically check if Hermes is running in JS, check the `HermesInternal` global variable:
```typescript
const isHermesEnabled = () => {
  return typeof global !== 'undefined' && !!(global as any).HermesInternal;
};
```

---

## 2. Profiling JS Execution using Chrome DevTools

We can capture CPU profiles of our JavaScript code using Google Chrome's developer tools.

### Step 1: Enable Connection
1. Launch the development server: `npm start`.
2. Open the app on your Emulator/Simulator or physical device.
3. Open Google Chrome on your host machine and navigate to:
   ```
   chrome://inspect
   ```
4. Click on **"Configure..."** and ensure `localhost:8081` (or your device's IP) is added to the discovery targets.

### Step 2: Capture a CPU Profile
1. In the `chrome://inspect` targets list, find your React Native app and click **inspect**.
2. Go to the **Profiler** tab.
3. Select **Record JavaScript CPU Profile** and click **Start**.
4. Perform the user interactions you wish to profile (e.g. scroll the post list, trigger bookmarks, open profile screen).
5. Click **Stop** to end recording.

### Step 3: Analyze the Flame Graph
* **Chart View**: Shows the call stack over time. Look for "long bars" on the bottom of the stack, indicating heavy execution functions.
* **Heavy (Bottom Up)**: Lists functions sorted by their self-execution time, highlighting computationally heavy operations.
* **Tree (Top Down)**: Displays the call tree starting from the root of execution down to leaf functions.

---

## 3. Profiling Memory & Garbage Collection (GC)

Hermes uses a generational garbage collector designed to minimize pause times.

### GC Activity Logs
To view Hermes GC logs in real time:
* **Android**: Open a terminal and run logcat filtered by `Hermes`:
  ```bash
  adb logcat -s Hermes
  ```
  Look for logs like `GC (reason) ...` to check heap size, garbage collection duration, and memory compaction occurrences.
* **iOS**: View system console logs through Xcode while running the app.

---

## 4. Production Bytecode & EAS Build Symbolication

In release builds, Hermes compiles JavaScript into **Pre-compiled Bytecode (HBC)**. This bypasses JS parsing at launch, speeding up TTI (Time to Interactive) dramatically.

### Symbolication of Production Crash Logs
Because Hermes compiles code to bytecode, stack traces from release builds will contain bytecode addresses instead of JavaScript file line numbers. To map these back to readable source code:

1. **Source Maps**: During compilation, a source map and a `.map` file are generated.
2. **EAS Build**: EAS handles this automatically and uploads mapping files to Expo dashboards.
3. **Manual Symbolication**: If you need to manually symbolicate a crash trace:
   * Install `metro-symbolicate`:
     ```bash
     npx metro-symbolicate apps/app/ios/main.jsbundle.map < raw_crash_stack.txt > readable_stack.txt
     ```
