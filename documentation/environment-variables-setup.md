# Environment Variables Configuration - react-native-config

This document details how we configure and consume environment variables across our JavaScript/TypeScript code and native platform layers (iOS and Android) using the industry-standard library `react-native-config`.

---

## 1. Setup Files
- **Environment variables**: [.env](file:///Users/ajay/Documents/ReactNativeAppProduction/.env)
- **Reference Template**: [.env.example](file:///Users/ajay/Documents/ReactNativeAppProduction/.env.example)

---

## 2. Consuming Variables

### In JavaScript / TypeScript
Import the standard config wrapper and access variables as properties:
```typescript
import Config from 'react-native-config';

// Accessing the base API endpoint
const apiBaseUrl = Config.API_URL;
```

### In Android
#### inside `build.gradle` (or `AndroidManifest.xml`)
Your `.env` variables are exposed inside the Gradle build files. For example, to read `APP_ENV` inside `build.gradle`:
```gradle
project.env.get("APP_ENV")
```
Or to reference inside `AndroidManifest.xml` via manifest placeholders:
```gradle
android {
    defaultConfig {
        manifestPlaceholders = [APP_ENV: project.env.get("APP_ENV")]
    }
}
```

### In iOS
#### inside Build Settings or `Info.plist`
Use native build configuration schemes. You can map variables into your target's **Info.plist** file by adding custom fields referencing the `.env` keys:
```xml
<key>ApiUrl</key>
<string>$(API_URL)</string>
```

---

## 3. Multiple Environments (e.g. Staging, Production)

To configure separate configurations for multiple environments:

### Android Multi-env setup
1. Create environment files: `.env.staging` and `.env.production`.
2. Define build flavors or build type mappings inside `android/app/build.gradle`:
   ```gradle
   project.ext.envConfigFiles = [
       debug: ".env",
       staging: ".env.staging",
       release: ".env.production"
   ]
   ```

### iOS Multi-env setup
1. Create environment files: `.env.staging` and `.env.production`.
2. Add custom build schemes (e.g. `Staging`, `Production`) in Xcode.
3. Configure a pre-build shell script phase inside Xcode schemas settings to copy the target environment file to `.env`:
   ```bash
   cp "${PROJECT_DIR}/../.env.staging" "${PROJECT_DIR}/../.env"
   ```

---

## 4. Troubleshooting & Caching
If your environment variables do not update after changing `.env`:
- **Android**: Run `cd android && ./gradlew clean` to clear gradle cache.
- **iOS**: Clean the build folder in Xcode (`Cmd + Shift + K`) and delete the build derived data.
- Restart Metro packager with cleared cache: `npx react-native start --reset-cache`.
