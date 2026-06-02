# iOS Simulator Testing Guide (Deep Linking & Background Tasks)

This document provides step-by-step instructions on how to test **Deep Linking (URL Schemes)** and **AppState Transitions (Background Sync)** inside the iOS Simulator.

---

## 1. Testing Deep Linking

You can trigger custom URL scheme routing actions directly from your macOS terminal using the `simctl` tool command:

### Commands to Run:

* **Navigate to Settings Screen:**
  ```bash
  xcrun simctl openurl booted rnp://settings
  ```

* **Navigate to Hooks Playground:**
  ```bash
  xcrun simctl openurl booted rnp://hooks
  ```

* **Navigate to Permissions Panel:**
  ```bash
  xcrun simctl openurl booted rnp://permissions
  ```

* **Navigate to Detail Screen with Parameter Input:**
  ```bash
  xcrun simctl openurl booted rnp://details/MyCustomTitle
  ```

---

## 2. Testing AppState Transitions & Background Sync

### Step 1: Suspend App (Move to Background)
1. Focus your running iOS Simulator window.
2. Press **`Cmd + Shift + H`** (or go to **Device > Home** in the menu bar) to simulate pressing the Home button.

### Step 2: Verify Background Logs
Once suspended, observe your Metro Packager terminal console output. You should see:
```text
[AppState] Application state transitioned: active -> background
[BackgroundSync] Triggered telemetry and state sync sequence...
[BackgroundSync] Sync task completed successfully!
```

### Step 3: Resume App (Move to Foreground)
1. Click the App icon inside the simulator screen to launch it back to the foreground.
2. Observe your Metro Packager terminal console output. You should see:
```text
[AppState] Application state transitioned: background -> active
[AppState] Resumed. Last sync time: 12:28:45 AM
```
