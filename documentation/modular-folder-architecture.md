# Feature-Based / Modular Folder Architecture Guide

This document outlines the design conventions and directory structure rules implemented in this React Native application to ensure maintainability, scalability, and loose coupling.

---

## 1. Directory Blueprint

The source tree is divided into two primary zones: `features/` (domain-driven business modules) and `shared/` (common app infrastructure).

```
src/
  features/              # Domain-driven feature modules
    feed/                # Dashboard feeds and post-related actions
      components/        # Components scoped strictly to this feature
      screens/           # Screen views mapped to this domain
      store/             # Redux slices and state managers
    persistence/
      screens/
    profile/
      screens/
    settings/
      screens/
    permissions/
      screens/
    hooksPlayground/
      screens/
    apisPlayground/
      screens/
  shared/                # Core application infrastructure and shared code
    components/          # Global components (e.g. ErrorBoundary)
    context/             # App-wide contexts (e.g. ThemeContext)
    hooks/               # General utility hooks (e.g. useAppState)
    navigation/          # Global navigators and route registers
    services/            # API clients, local storage engines, notifications
    store/               # Root store setup and global queries (apiSlice)
    types/               # Global TypeScript definitions
```

---

## 2. Directory Conventions & Rules

To keep the architecture clean and scale the project without circular reference issues, follow these guidelines:

### Rule 1: Scoping Constraint
* If a component, hook, utility, or slice is only used in **one** feature, it **must** remain inside that feature's directory. 
* Do not promote files to `src/shared` until they are actively required by two or more distinct features.

### Rule 2: Unidirectional Import Rule
* Files inside `features/` may import from `shared/`.
* Files inside `shared/` **must never** import from `features/`. Violating this creates circular dependencies and breaks domain isolation.

### Rule 3: Cross-Feature Separation
* Feature folders must remain self-contained. 
* A feature folder (e.g., `features/persistence`) should not import directly from another feature folder (e.g., `features/feed`) unless importing a generic component via a shared bridge. If features need to exchange data, they must coordinate via the Redux store or global navigation routes.

---

## 3. Creating a New Feature

When introducing a new feature (e.g., `analytics`), follow these steps:
1. Create a sub-folder under `src/features/analytics/`.
2. Map your screens inside `src/features/analytics/screens/` and components inside `src/features/analytics/components/`.
3. Add any feature-specific slices inside `src/features/analytics/store/`.
4. Register navigation hooks or screen targets inside [navigation/index.tsx](file:///Users/ajay/Documents/ReactNativeAppProduction/src/shared/navigation/index.tsx).
