# Multi-Platform Code Sharing: React Native Web Setup

This guide details the integration, configuration, and best practices for running our React Native application on the Web using **React Native Web**.

---

## 1. What is React Native Web?

**React Native Web** allows developers to compile standard React Native components (such as `<View>`, `<Text>`, and `<TouchableOpacity>`) into platform-equivalent HTML elements (like `<div>`, `<span>`, and `<button>`) running on standard web browsers.

This allows for **up to 95% code sharing** between iOS, Android, and Web platforms across UI components, React hooks, state management, utilities, and networking services.

---

## 2. Installation and Workspace Configuration

To enable web platform bundling, we added the following core packages:
* `react-native-web`: Translates React Native components to web APIs.
* `react-dom`: Renders React nodes in the browser DOM.
* `@expo/metro-runtime`: Supports dynamic development runtime loads in Web browsers.

### Scripts Configuration:
We added convenient run script delegates in the project package configs:
* **Root [package.json](file:///Users/ajay/Documents/ReactNativeAppProduction/package.json)**:
  ```json
  "web": "npm run web -w apps/app"
  ```
* **App Shell [package.json](file:///Users/ajay/Documents/ReactNativeAppProduction/apps/app/package.json)**:
  ```json
  "web": "npx expo start --web"
  ```

---

## 3. Best Practices for Multi-Platform Code Sharing

When sharing code between native apps (iOS/Android) and browsers (Web), use these strategies to handle platform differences:

### 1. Platform-Specific Extensions (Declarative Separation)
If a component has radically different layouts or relies on web-only APIs (like browser `window` or `document`), separate the code using extension suffixes. Metro and Webpack resolve these automatically:
* `MyComponent.tsx` (Default fallback for iOS and Android)
* `MyComponent.web.tsx` (Targeted override compiled *only* on Web)

### 2. Runtime Platform API Checks (Dynamic Checks)
For minor logical variances, use React Native's `Platform` module:
```typescript
import { Platform } from 'react-native';

if (Platform.OS === 'web') {
  // Execute web-specific API (e.g. reading URL query params)
} else {
  // Execute native API (e.g. accessing biometric keychain)
}
```

### 3. Responsive Styling
Web screens typically have landscape widescreen layouts, whereas native phones use portrait viewports.
* Use **Flexbox** structures that adapt to both dimensions.
* Use libraries (like `react-native-safe-area-context`) to manage screen notches on iOS/Android while falling back to standard margins on the web.
* Avoid absolute pixel layouts; use percentage-based dimensions or flex layouts.

---

## 4. Handling Non-Compatible Native Modules

Some third-party native libraries do not support the web platform. Here is how to handle them:

1. **Check Compatibility**: Before installing a library, check if it lists web support.
2. **Implement Web Mocks / Fallbacks**: If a library fails on the web, create a `.web.tsx` file that mocks its behaviors. For example:
   * **Native Secure Storage**: On native, it uses Keychain/EncryptedSharedPreferences. On the web, you should mock it using browser **SessionStorage** or secure HTTP cookies.
3. **Conditional Imports**: Ensure native-only modules are not imported directly in shared JS files that are compiled on the web.

---

## 5. Running and Building for Web

### Running Web Development Server:
To start the application locally in your default web browser, run:
```bash
npm run web
```
This launches Metro, compiles the JS code, and hosts the app on `http://localhost:8081`.

### Compiling Web Production Bundle:
To generate static HTML/JS files that you can deploy to static hosting (like Firebase Hosting, Netlify, or Vercel), run:
```bash
npx expo export
```
The compiled production bundle is saved under the `dist/` directory.
