# React Native Project Setup and Execution Guide

This document records the exact steps, commands, and resolutions used to initialize and run the bare React Native TypeScript application.

---

## 1. Project Initialization

### Initial CLI Inquiry
To see the latest options and templates, we checked the help menu of the official community React Native CLI:
```bash
npx --yes @react-native-community/cli init --help
```

### Directory Setup & App Scaffolding
Due to compilation issues that space characters cause within native compiler scripts (like Xcode/CocoaPods and Android/Gradle), the project directory was established without spaces:
* **Project Directory:** `/Users/ajay/Documents/ReactNativeAppProduction`
* **App Name:** `App`

We scaffolded the project using the CLI:
```bash
npx -y @react-native-community/cli init App --directory "/Users/ajay/Documents/ReactNativeAppProduction" --pm npm
```

---

## 2. Dependencies Installation

### Package Manager
We installed the React and React Native npm packages:
```bash
cd "/Users/ajay/Documents/ReactNativeAppProduction"
npm install
```

### iOS CocoaPods Setup
To build the iOS application, the native libraries must be linked via CocoaPods. We verified Xcode Command Line Tools were active and pointing to the full Xcode app bundle:
```bash
# Verify active developer directory
xcode-select -p
# (Should return: /Applications/Xcode.app/Contents/Developer)
```

Then, we ran the CocoaPods installation:
```bash
cd ios
pod install
```

### Android SDK Path Configuration
To configure the Android build system (Gradle) to locate your Android SDK without needing global environment variables, we added a `local.properties` file:
* **File Path:** `/Users/ajay/Documents/ReactNativeAppProduction/android/local.properties`
* **Content:**
  ```properties
  sdk.dir=/Users/ajay/Library/Android/sdk
  ```

---

## 3. Running the Application

### Running on iOS Simulator

1. **Start the Metro Bundler**
   Metro is the JavaScript compiler for React Native. Start it in the root folder of the project:
   ```bash
   npm start
   ```
   *(Keep this terminal/process running in the background while developing so changes auto-refresh).*

2. **Launch on Simulator**
   In a separate terminal tab or process, run the launcher script:
   ```bash
   npm run ios
   ```

---

### Running on Android Device / Emulator

1. **Set Up a Device**
   * **Emulator:** Open Android Studio, navigate to **Device Manager** (Virtual Device Manager), and create/start an Android Virtual Device (AVD).
   * **Physical Device:** Connect a physical Android phone via USB, enable **Developer Options**, and turn on **USB Debugging**.

2. **Verify Connection**
   Check that your computer detects the device or running emulator:
   ```bash
   ~/Library/Android/sdk/platform-tools/adb devices
   ```

3. **Launch on Android**
   Make sure the Metro bundler is running (`npm start`), then execute the launcher script in a separate terminal window:
   ```bash
   npm run android
   ```

---

## 4. Troubleshooting Directory Spaces
If you get a `bad component(expected absolute path component)` error during `pod install`, make sure your project is stored in a path that contains **no space characters** (e.g., `/Users/ajay/Documents/ReactNativeAppProduction` instead of `/Users/ajay/Documents/React Native`).
