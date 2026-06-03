# EAS Build, EAS Update & App Versioning Guide

This guide details how Expo Application Services (EAS) and app versioning are configured and run in this Bare React Native application.

---

## 1. Prerequisites & CLI Installation

To interact with the EAS cloud build and update systems, install the global EAS command-line interface tool:

```bash
npm install -g eas-cli
```

Ensure you are logged into your Expo account:

```bash
eas login
```

---

## 2. Project Linking & Initialization

Link your local project to your Expo developer dashboard by running:

```bash
npx eas project:init
# OR
npx eas init
```

This will link the project, register it on the Expo dashboard, and automatically update the `projectId` and update `url` values inside your `app.json`.

---

## 3. App Versioning Management (`app.json`)

All app store and dynamic OTA versions are configured in the `app.json` configuration file at the root.

```json
{
  "expo": {
    "version": "1.0.0",
    "ios": {
      "buildNumber": "1"
    },
    "android": {
      "versionCode": 1
    }
  }
}
```

### Versioning Fields
1. **`expo.version`**: The user-facing app version (e.g., `1.0.1`). This is synced to the iOS `CFBundleShortVersionString` and Android `versionName`.
2. **`expo.ios.buildNumber`**: The internal build number for iOS. Must increment with every App Store Connect upload (e.g. `2`).
3. **`expo.android.versionCode`**: The internal version integer code for Android (Google Play). Must increment with every Google Play Console upload (e.g. `2`).

---

## 4. Triggering EAS Builds

You can run builds in the cloud using the profiles defined in [eas.json](file:///Users/ajay/Documents/ReactNativeAppProduction/eas.json).

### Build Profiles
* **`development`**: Creates a debug build containing the Expo development client to run and test local JS edits.
* **`preview`**: Builds internal test releases (Ad-Hoc / internal distribution) linked to update channels.
* **`production`**: Prepares release-ready production binaries targeting App Store and Google Play submissions.

### CLI Build Commands
```bash
# Build for Android (Production)
npx eas build --platform android --profile production

# Build for iOS (Production)
npx eas build --platform ios --profile production

# Build both platforms concurrently
npx eas build --platform all --profile production
```

---

## 5. Deploying Over-The-Air (OTA) Updates

Deploy JS or asset changes instantly to existing builds using EAS Update.

### How Updates Work
Existing app builds track specific **channels** defined in `eas.json` matching the build profiles. The app downloads new bundles matched with the current native configuration (`appVersion` runtime policy).

### Publish Updates
```bash
# Deploy changes to the preview channel
npx eas update --branch preview --message "Fix UI bug in api dashboard"

# Deploy changes to the production channel
npx eas update --branch production --message "Release v1.0.1 hotfix"
```
