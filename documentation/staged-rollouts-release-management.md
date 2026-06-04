# Staged Rollouts and Release Management Guide

This guide details the industry-standard procedures for orchestrating **Staged Rollouts** and managing application releases across iOS (Apple App Store) and Android (Google Play Store).

---

## 1. What are Staged Rollouts?

A **Staged Rollout** (called *Phased Release* on iOS and *Staged Rollout* on Android) is the practice of distributing an app update to a small percentage of users first, rather than releasing it to 100% of your audience immediately.

### Key Benefits:
* **Risk Mitigation**: Catch critical regressions, crashes, or backend overloads early when only 1% of users are exposed.
* **Release Control**: Pause the rollout immediately if metrics look bad.
* **Hotfix Deployment**: Push quick patches to the rollout group without affecting the rest of the user base.

---

## 2. iOS Phased Releases (App Store Connect)

Apple supports a fixed 7-day phased release schedule for app updates.

### How it Works:
Once enabled, the update is distributed automatically over 7 days to users with automatic updates enabled:
* **Day 1**: 1% of users
* **Day 2**: 2% of users
* **Day 3**: 5% of users
* **Day 4**: 10% of users
* **Day 5**: 20% of users
* **Day 6**: 50% of users
* **Day 7**: 100% of users

*Note: Users can still manually download the update from the App Store page at any point.*

### Step-by-Step Configuration:
1. Log into **App Store Connect**.
2. Select your App, and create a new App Version for your update.
3. Under the **Phased Release for Automatic Updates** section, select **Release update over a 7-day period using phased release**.
4. Submit the app for review as normal. Once approved, the phased release schedule begins.

### Management Controls:
At any point during the 7-day period, you can:
* **Pause Phased Release**: Stop the automatic update rollout (up to a maximum of 30 days total).
* **Resume Phased Release**: Continue automatic distribution along the schedule.
* **Release to All Users**: Immediately push the update to 100% of users, bypassing the remaining schedule.

---

## 3. Android Staged Rollouts (Google Play Console)

Google Play Console offers flexible staged rollouts, allowing you to choose and update your target user percentages dynamically.

### How it Works:
* You define custom percentages (e.g., 1%, 5%, 20%, 50%, 100%).
* You can update or pause these percentages manually at any time.

### Step-by-Step Configuration:
1. Log into **Google Play Console**.
2. Navigate to your app, and go to **Production** under the Release section.
3. Click **Create new release**, upload your signed `.aab` file, and fill in the release notes.
4. On the review screen, click **Edit release** or **Review release**.
5. Under the rollout configuration, select **Staged rollout** and enter your starting percentage (e.g. `10%`).
6. Click **Start rollout to Production**.

### Management Controls:
* **Increase Percentage**: To expand the release to more users, go to the release dashboard, click **Update rollout**, and enter a higher percentage (e.g., raise it from `10%` to `50%`).
* **Halt Rollout**: If a bug is detected, click **Halt rollout**. This stops the update from reaching any new users. Users who have already downloaded the update will keep it.
* **Resume Rollout**: Resume distribution to the previous or a higher percentage.

---

## 4. Hotfixing & Incident Response during Rollout

If a critical crash is detected while a rollout is active:

### Case A: JavaScript-only Bug (EAS Update Hotfix)
If the bug is in the JS layer, you can use **EAS Update** to deploy a hotfix instantly to all users on the rollout channel:
```bash
npx eas update --branch production --message "Hotfix: Fix checkout validation bug"
```
Devices that downloaded the buggy release will receive the JS hotfix on their next launch.

### Case B: Native Native-layer Bug (Binary Hotfix)
If the bug resides in native libraries or configurations:
1. **iOS**: In App Store Connect, **Pause** the Phased Release. Submit a new binary version (e.g. `1.0.2` if the buggy one was `1.0.1`) to App Store Connect, request an **Expedited Review**, and start a new Phased Release.
2. **Android**: In Google Play Console, **Halt** the rollout. Build a new release binary with an incremented `versionCode` (e.g. `versionCode 2` to replace `versionCode 1`), create a new release on the Production track, and roll it out to the target percentage (or directly to 100% to overwrite the buggy version).

---

## 5. Monitoring Release Health Metrics

Before increasing the rollout percentage, verify application health via:

1. **Firebase Crashlytics**:
   * Monitor the **Crash-Free Users** metric. The industry standard is to keep this above **99.9%**.
   * Inspect the console for any new crashes tagged with the new release version.
2. **Google Play Vitals**:
   * Check **ANR (App Not Responding)** rates and crash rates on the Play Console. Ensure they are well below Google's bad behavior thresholds.
3. **App Store Connect Quality Metrics**:
   * Inspect crash logs submitted by iOS devices under the App Store Connect Analytics tab.
