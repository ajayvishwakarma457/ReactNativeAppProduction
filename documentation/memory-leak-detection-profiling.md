# Memory Leak Detection and Profiling Guide

Memory leaks occur when objects or native resources that are no longer needed remain allocated in memory because they are still referenced. Over time, these accumulate, leading to degraded performance, sluggishness, and eventually Out Of Memory (OOM) crashes.

This guide details how to detect, profile, and fix memory leaks using Flipper, Android Studio, Xcode, and defensive coding practices.

---

## 1. Common Causes of Memory Leaks in React Native

1. **Uncleared Event Listeners**: Subscribing to device events (e.g. `BackHandler`, `Keyboard`, or `DeviceEventEmitter`) inside a `useEffect` but forgetting to return a cleanup function to unsubscribe.
2. **Abandoned Timers & Intervals**: Creating `setTimeout` or `setInterval` references that continue to execute and retain component closures even after the component unmounts.
3. **Native Module Subscriptions**: Registering listeners on native modules (like Push Notifications or Geolocation) without removing them.
4. **Retained Store References**: Storing components, nodes, or heavy objects in global store caches (like Redux or MMKV state) that never get garbage collected.

---

## 2. Profiling Memory Leaks with Flipper

Flipper is a desktop debugging tool with built-in plugins for inspecting React Native memory.

### Step 1: Memory Plugin Setup
1. Launch Flipper and connect your emulator/simulator or physical developer device.
2. Ensure your application is running in development mode (`npm start`).
3. Select the **React DevTools** or **Hermes Debugger** plugin.

### Step 2: Tracking JS Memory using Hermes Debugger
The Hermes Debugger allows taking heap snapshots:
1. In Flipper, open the **Hermes Debugger** plugin.
2. Click the **Profiler** tab.
3. Select **Take Heap Snapshot** and click **Take Snapshot**.
4. Perform an action (e.g., open a screen and then navigate back).
5. Take another **Heap Snapshot**.
6. Compare the snapshots to see if the number of objects or total memory size has increased, indicating components are still retained in the heap.

---

## 3. Native Memory Profiling with Android Studio

Android Studio provides a visual Memory Profiler to inspect native JVM/C++ memory.

### Step 1: Connect Android Studio Profiler
1. Open the `/apps/app/android` folder in Android Studio.
2. Build and run the app on an Android device or emulator.
3. Click on the **Profiler** tab (at the bottom of Android Studio).
4. Click the **+** (New Session) button and select your running device and application process (`com.app`).

### Step 2: Analyze Heap Dumps (`.hprof`)
1. Click on the **Memory** timeline.
2. Interact with the application (e.g., repeatedly open and close the Profile screen).
3. Click **Capture Heap Dump** and press **Record**.
4. Use the heap analysis tool to sort classes by size or instance count. Look for multiple instances of views, screen fragments, or activities that should have been destroyed.
5. Check the **References** panel to find what object is holding the reference path to the leaked instance.

---

## 4. Native Memory Profiling on iOS (Xcode Instruments)

Xcode includes the **Instruments** suite, which features dedicated tools for memory diagnostics.

1. Open `/apps/app/ios` in Xcode.
2. Choose **Product > Profile** (or press `Cmd + I`).
3. Choose the **Leaks** or **Allocations** template.
4. Click the red record button to start tracking.
5. Look for the red bar indicators in the Leaks timeline, which automatically flag leaked memory blocks and provide stack traces pointing to the exact native allocation point.

---

## 5. Defensive Coding: Preventing Common Leaks

Always implement proper cleanups inside `useEffect` blocks:

### Correct Cleanup Pattern
```typescript
import { useEffect } from 'react';
import { Keyboard } from 'react-native';

export const useKeyboardListener = (onShow: () => void) => {
  useEffect(() => {
    // 1. Subscribe
    const showSubscription = Keyboard.addListener('keyboardDidShow', onShow);

    // 2. Return cleanup function
    return () => {
      // 3. Unsubscribe to avoid memory leaks
      showSubscription.remove();
    };
  }, [onShow]);
};
```
