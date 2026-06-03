# Nx Monorepo Setup Guide

This document details the configuration and architecture of the newly established **Nx Monorepo** for our bare React Native project. It outlines the project's folder layout, how path resolution works via TypeScript/Metro, and the commands to build, test, and run the app.

---

## 1. Directory Architecture

The workspace is organized into **Applications** (`apps/`) and **Libraries** (`libs/`):

```
/ (Workspace Root)
├── package.json                 # Shared dependencies and workspaces config
├── nx.json                      # Nx orchestration rules
├── tsconfig.base.json           # Global compiler settings & path mappings
├── jest.config.js               # Global Jest configuration
├── apps/
│   └── app/                     # Mobile React Native Application
│       ├── android/             # Android native project (points to root node_modules)
│       ├── ios/                 # iOS native project (points to root node_modules)
│       ├── App.tsx              # Application Root
│       ├── index.js             # App Entry Point
│       ├── metro.config.js      # Custom Metro resolver for monorepos
│       └── tsconfig.json        # Extends tsconfig.base.json
└── libs/
    └── shared/                  # Shared Business Logic & UI library
        ├── package.json         # Package configuration
        ├── tsconfig.json        # Extends tsconfig.base.json
        └── src/                 # Reusable components, hooks, stores, context
```

---

## 2. Import Path Mappings (`@app/shared/*`)

To keep imports clean and decoupled, we use the `@app/shared` workspace scope mapped through TypeScript and Metro:

* **TypeScript Resolution**: Configured in [tsconfig.base.json](file:///Users/ajay/Documents/ReactNativeAppProduction/tsconfig.base.json):
  ```json
  "paths": {
    "@app/shared/*": ["libs/shared/src/*"]
  }
  ```
  This allows imports like:
  ```typescript
  import { useTheme } from '@app/shared/context/ThemeContext';
  import { AppButton } from '@app/shared/components/atoms/AppButton';
  ```
* **Metro Resolution**: Managed inside [apps/app/metro.config.js](file:///Users/ajay/Documents/ReactNativeAppProduction/apps/app/metro.config.js) using:
  - `watchFolders`: Tells Metro to monitor files in the root folder (especially `libs/shared`).
  - `resolver.extraNodeModules`: Directly maps the `@app/shared` prefix to the physical path `libs/shared/src`.

---

## 3. Running the Project

All commands should be executed from the **workspace root**:

### Start Metro Bundler
To launch the Metro bundler:
```bash
npm start
```

### Run on iOS Simulator
To build and launch the app on an iOS simulator:
```bash
npm run ios
```

### Run on Android Emulator
To build and launch the app on an Android emulator:
```bash
npm run android
```

---

## 4. Testing & Verification

We use Jest to run tests across the workspace and TypeScript to typecheck the whole project.

### Run Tests
```bash
npm test
```

### Run TypeScript Type Check
To compile and type-check the source files:
```bash
npx tsc --noEmit
```

---

## 5. Adding New Shared Components/Hooks
When adding a new reusable hook, component, or utility:
1. Place it in the appropriate folder under `libs/shared/src/` (e.g., `libs/shared/src/components/atoms/NewButton.tsx`).
2. If desired, export it in `libs/shared/src/index.ts` or import it directly using the path:
   ```typescript
   import { NewButton } from '@app/shared/components/atoms/NewButton';
   ```
