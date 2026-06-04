# App Store Optimization (ASO) Basics Guide

This guide details the fundamentals of **App Store Optimization (ASO)** (SEO for mobile app stores) to maximize organic search visibility, click-through rates, and download conversion rates on the Apple App Store and Google Play Store.

---

## 1. What is App Store Optimization (ASO)?

ASO is the process of optimizing a mobile app's store presence to rank higher in store search results and convert page views into downloads. Over 65% of app downloads come directly from organic searches inside the app stores.

### Key Pillars of ASO:
* **Visibility**: Ranking for relevant, high-volume search terms.
* **Conversion Rate Optimization (CRO)**: Convincing store page visitors to install the app using compelling visuals and copy.

---

## 2. Text Metadata Optimization

Optimizing text fields helps the store search algorithms index your application for relevant keywords.

### iOS App Store Metadata Strategy:
| Metadata Field | Character Limit | Algorithmic Weight | Best Practice |
| :--- | :---: | :---: | :--- |
| **App Name** | 30 | **Critical** | Put your brand name + 1-2 core keywords (e.g., `AppName: Fast Expense Tracker`). |
| **Subtitle** | 30 | **High** | Highlight the primary value proposition or a secondary keyword. |
| **Keyword Field** | 100 | **High** | comma-separated words. Do **not** use spaces after commas, duplicate words, or include your app category name. |
| **Description** | 4000 | None | Not indexed for search on iOS. Write for the user: feature list, value proposition, and social proof. |

### Google Play Store Metadata Strategy:
| Metadata Field | Character Limit | Algorithmic Weight | Best Practice |
| :--- | :---: | :---: | :--- |
| **App Title** | 30 | **Critical** | Put your brand name + primary search keyword. |
| **Short Description** | 80 | **High** | A punchy summary of what the app does. Appears before clicking "read more". |
| **Long Description** | 4000 | **High** | Highly indexed for search on Android. Repeat core keywords 4-5 times naturally throughout the text. Avoid keyword stuffing. |

---

## 3. Creative Visual Asset Optimization

Compelling visuals are the primary driver of App Store Conversion Rates.

### App Icon
* Make it simple, memorable, and recognizable.
* Avoid using small text or cluttered graphics inside the icon.
* Test light and dark background contrast.

### App Screenshots
* **Captions**: Use large, readable text overlays explaining the feature shown (e.g. "Scan Receipts Instantly").
* **Key Focus**: Showcase the most popular or unique feature in the first two screenshots.
* **Aspect Ratios**:
  * **iOS**: Require screenshots for 6.5" iPhones (e.g., iPhone 15 Pro Max) and 5.5" iPhones.
  * **Android**: Require phone, 7-inch tablet, and 10-inch tablet screenshots.
* **Localization**: Translate the overlay text in screenshots for target international markets.

---

## 4. Driving Ratings and Reviews

App Store algorithms heavily favor apps with high ratings (4.5+ stars) and frequent positive reviews.

### In-App Review Prompts
Use standard native prompts to ask for reviews at moments of "high user satisfaction" (e.g. after completing a transaction, finishing a level, or saving a file):

```typescript
import * as StoreReview from 'expo-store-review';

async function requestReviewAfterMilestone() {
  try {
    // Check if the store review API is supported on the device
    if (await StoreReview.isAvailableAsync()) {
      await StoreReview.requestReview();
    }
  } catch (error) {
    console.error('Failed to trigger in-app store review:', error);
  }
}
```

* **Rule of Thumb**: Never prompt a user immediately upon app launch, or directly after a failed action/crash.

---

## 5. Localization (International ASO)

Translating metadata into other languages can dramatically increase global organic reach.
* Do not rely on raw machine translation (like Google Translate) for app titles or subtitles.
* Conduct keyword research specifically for each target country, as search terms and colloquialisms differ.

---

## 6. ASO Analytics and Iteration

ASO is not a set-it-and-forget-it task. Track your metrics and run A/B testing:
* **Product Page Optimization (PPO)** on iOS and **Store Listing Experiments** on Android allow you to A/B test different icons, screenshots, and descriptions to see which generates more downloads.
* **ASO Research Tools**: Use industry platforms like *Sensor Tower*, *AppTweak*, *Mobile Action*, or *App Radar* to monitor keyword rankings and competitor metadata.
