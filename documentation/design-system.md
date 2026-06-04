# Design System Creation and Maintenance

This document details the implementation, structure, and maintenance protocols of the application's unified **Design System**.

---

## 1. Core Architecture (Design Tokens)

The design system is built using cohesive tokens defined in the [ThemeContext](file:///Users/ajay/Documents/ReactNativeAppProduction/libs/shared/src/context/ThemeContext.tsx) of our shared library. These tokens define the visual personality of the app and automatically map to both **Light** and **Dark** modes.

### Theme Tokens Interface
All color palettes adhere to the `ThemeColors` contract:

```typescript
export interface ThemeColors {
  primary: string;       // Accent / Active branding color
  background: string;    // App viewport background color
  card: string;          // Card background color
  text: string;          // Primary text color
  textMuted: string;     // Subtitles / disabled text color
  border: string;        // Divider lines
  cardBorder: string;    // Card boundaries
  error: string;         // Failure states / invalid input color
}
```

### Curated Color Palettes
* **Light Theme**:
  - Primary Accent: Slate Indigo (`#6366F1`)
  - Neutral Background: Off-White (`#F8FAFC`)
  - Text Primary: Deep Slate (`#0F172A`)
* **Dark Theme (Slate Premium)**:
  - Primary Accent: Vivid Indigo (`#818CF8`)
  - Neutral Background: Deep Night (`#0F172A`)
  - Text Primary: High-Contrast Slate (`#F8FAFC`)

---

## 2. Component Hierarchy (Atomic Design)

We structure all user interface elements hierarchically to maximize reusability across platforms:

### 1. Atoms (Basic Visual Elements)
* **[AppText](file:///Users/ajay/Documents/ReactNativeAppProduction/libs/shared/src/components/atoms/AppText.tsx)**: Automatically handles typography families (standard, semi-bold, bold), sizes (heading, sub-heading, standard, caption), and text coloring according to theme tokens.
* **[AppButton](file:///Users/ajay/Documents/ReactNativeAppProduction/libs/shared/src/components/atoms/AppButton.tsx)**: Standardized touchable button featuring normal, outline, active, loading indicator, and disabled states.

### 2. Molecules (Component Combinations)
* **[FormField](file:///Users/ajay/Documents/ReactNativeAppProduction/libs/shared/src/components/molecules/FormField.tsx)**: Combines text inputs, label headers, and error states under validation patterns.

### 3. Organisms (Context-Bound Features)
* **[PostCard](file:///Users/ajay/Documents/ReactNativeAppProduction/apps/app/src/feed/components/organisms/PostCard.tsx)**: Modular layout component integrating typography atoms, image containers, and like/bookmark state indicators.

---

## 3. Maintenance & Scaling Guidelines

To ensure the design system remains consistent, clean, and scalable as new features are added:

1. **Strict Token Usage**:
   Never hardcode HEX/RGBA color literals inside feature components. Always resolve styling properties from the `useTheme()` hook:
   ```typescript
   const { theme } = useTheme();
   // Right: { color: theme.textMuted }
   // Wrong: { color: '#64748B' }
   ```
2. **Platform Fallbacks**:
   When using animations (via Reanimated) or custom gesture detectors, build fallback interfaces for the web using standard platform checks to preserve interactive behaviors.
3. **Typography Standardizing**:
   Use `AppText` for all text blocks to maintain typographic scaling and family consistency.
