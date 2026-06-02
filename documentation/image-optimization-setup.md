# React Native Performance Image Optimization Guide

This document covers the implementation, design strategies, and configuration details for optimized image rendering in our React Native application using `@expo/image` with autolinking inside a bare React Native project.

---

## 1. Why `expo-image`?

`expo-image` is a modern, high-performance image component designed specifically for React Native. It uses `SDWebImage` on iOS and `Glide` on Android under the hood, solving many performance issues present in the standard React Native `<Image>` component.

### Performance Enhancements:
* **Disk & Memory Caching**: Automated caching policies ensure images are downloaded once and cached on disk.
* **Recycling Compatibility**: Integrated directly with layout scrap-and-recycle structures like `FlashList` for smooth 60 FPS scrolling.
* **Transition Effects**: Native cross-fade animations on image source changes to prevent flickering.
* **Placeholders**: Supports Blurhash, Thumbhash, or local assets as progressive placeholder layouts during downloads.

---

## 2. Setup & Installation

### Step 1: Install Expo autolinking support
We initialized Expo module configurations inside our bare React Native app:
```bash
npx install-expo-modules@latest
```

### Step 2: Install `expo-image`
```bash
npm install expo-image
```

### Step 3: Run CocoaPods linking (iOS)
```bash
cd ios && pod install
```

---

## 3. Implementation Details

We refactored both the dashboard post list feed and details view to utilize optimized images.

### A. Dashboard Feed List Card (`HomeScreen.tsx`)
Added a square thumbnail to the left of the article details, utilizing disk cache:
```typescript
import { Image } from 'expo-image';

<Image
  source={{ uri: `https://picsum.photos/id/${((item.id * 7) % 70) + 10}/160/160` }}
  style={styles.cardImage}
  contentFit="cover"
  transition={300}
  cachePolicy="disk"
/>
```

### B. Post Details Hero Banner (`DetailsScreen.tsx`)
Added a full-bleed banner at the top of the details card overlay:
```typescript
<Image
  source={{ uri: `https://picsum.photos/id/${((idNumber * 7) % 70) + 10}/600/400` }}
  style={styles.heroImage}
  contentFit="cover"
  transition={300}
  cachePolicy="disk"
/>
```

---

## 4. Caching & Cache Policies

`expo-image` supports several cache policies:
1. `disk` (Default for remote resources): Saves downloaded files to disk storage. Highly recommended.
2. `memory`: Caches assets purely in heap memory. Instant reload but purged when the app process is closed.
3. `memory-disk`: Uses memory cache first for immediate access, falling back to disk cache before calling network.
4. `none`: Disables cache storage. Useful for dynamic user uploads/profiles.
