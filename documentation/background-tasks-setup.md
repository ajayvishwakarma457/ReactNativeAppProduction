# React Native Background Tasks & App State Management Guide

This document describes how to monitor and handle application state changes (foreground, background, inactive) and schedule background tasks in a React Native app.

---

## 1. App State Management (`AppState` API)

React Native's `AppState` notifies you when the app is in the foreground or background.

### App Lifecycle States:
* `active`: The app is running in the foreground and the user is interacting with it.
* `background`: The app is running in the background (user is in another app or on the home screen).
* `inactive` (iOS only): The app is transitioning between active/background or system overlays (like phone calls, notification center).

### Integration Example:
```typescript
import { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export function useAppState() {
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      console.log(`AppState changed to ${nextState}`);
      setAppState(nextState);
    });
    return () => subscription.remove();
  }, []);

  return appState;
}
```

---

## 2. Background Tasks Architecture

To execute tasks when the app is fully suspended or quit, we recommend combining standard OS level scheduler managers.

### Android: WorkManager & Headless JS
* **Mechanism**: Android OS wakes up the JS thread via a Headless JS service when triggered by a native `WorkManager` event.
* **Periodic execution**: Allows running tasks periodically (minimum interval of 15 minutes).

### iOS: Background Tasks API (`BGTaskScheduler`)
* **Mechanism**: iOS invokes background fetch events or background processing events. The OS determines runtime scheduling based on user app usage habits.
* **Requirements**: Must enable `Background fetch` and `Background processing` capabilities in Xcode.

---

## 3. Recommended Library: `react-native-background-fetch`

For robust, cross-platform periodic background executions, we recommend integrating `react-native-background-fetch`.

### Installation
```bash
npm install react-native-background-fetch
cd ios && pod install
```

### Usage Setup
Add the background configuration inside `index.js` or root App startup:

```typescript
import BackgroundFetch from 'react-native-background-fetch';

const initBackgroundFetch = async () => {
  const status = await BackgroundFetch.configure({
    minimumFetchInterval: 15,     // Minimum 15 minutes (OS limited)
    stopOnTerminate: false,       // Continue execution on terminal quit
    enableHeadless: true,         // Enable Android Headless JS support
    startOnBoot: true,            // Android auto-start on device reboot
    requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY // Trigger only with network connectivity
  }, async (taskId) => {
    console.log('[BackgroundFetch] Event received:', taskId);
    
    // Perform background operations (e.g. state syncing or telemetry log flushing)
    await performDataSync();
    
    // Critical: Tell the OS the task has finished
    BackgroundFetch.finish(taskId);
  }, async (taskId) => {
    // Timeout handler: Executed if task runs too long
    console.warn('[BackgroundFetch] Timeout:', taskId);
    BackgroundFetch.finish(taskId);
  });

  console.log('[BackgroundFetch] Configuration Status:', status);
};
```
