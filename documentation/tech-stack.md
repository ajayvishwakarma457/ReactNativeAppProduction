# App Technology Stack

This document tracks the current frameworks, libraries, tools, and configurations used in this React Native application. It is updated automatically as packages are installed or upgraded.

---

## 1. Core Stack
| Component | Technology | Version | Description |
| :--- | :--- | :--- | :--- |
| **Framework** | [React Native](https://reactnative.dev/) | `0.85.3` | Bare CLI React Native setup. |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | `^5.8.3` | Static typing interface for JavaScript. |
| **JS Engine** | [Hermes](https://hermesengine.dev/) | Integrated | High-performance JS engine optimized for React Native. |
| **UI Library** | [React](https://react.dev/) | `19.2.3` | Core component library. |

---

## 2. Core Libraries & Dependencies
| Package Name | Category | Version | Purpose |
| :--- | :--- | :--- | :--- |
| [`react-native-mmkv`](https://github.com/mrousavy/react-native-mmkv) | Storage | `^4.3.1` | Ultra-fast synchronous key-value local storage. |
| [`react-native-nitro-modules`](https://github.com/mrousavy/nitro) | C++ JSI Bridging | `^0.35.9` | C++ bindings enabling ultra-fast performance. |
| [`react-native-safe-area-context`](https://github.com/th3rdwave/react-native-safe-area-context) | UI / Layout | `^5.5.2` | Context provider for handling safe area notch/insets dynamically. |
| **React Context API** | State Management | Native (`react`) | Global theme context (`ThemeContext`) with persisted MMKV Light/Dark states. |
| [`@reduxjs/toolkit`](https://redux-toolkit.js.org/) | State Management | `^2.6.0` | Global state management (includes RTK Query for data fetching and caching). |
| [`react-redux`](https://react-redux.js.org/) | State Management | `^9.2.0` | React bindings for Redux. |
| [`@react-native-firebase/app`](https://rnfirebase.io/) | Notifications / Cloud | `^24.0.0` | React Native Firebase core application manager. |
| [`@react-native-firebase/messaging`](https://rnfirebase.io/messaging/usage) | Push Notifications | `^24.0.0` | React Native Firebase cloud messaging hooks and listeners. |
| [`@react-navigation/native`](https://reactnavigation.org/) | Navigation | `^7.2.5` | Core routing and navigation state provider. |
| [`@react-navigation/native-stack`](https://reactnavigation.org/) | Navigation | `^7.16.0` | Native-based screen navigation stack transitions. |
| [`@react-navigation/bottom-tabs`](https://reactnavigation.org/) | Navigation | `^7.16.2` | Screen layout organizing bottom-tab buttons. |
| [`@react-navigation/drawer`](https://reactnavigation.org/) | Navigation | `^7.10.3` | Side collapsible drawer menu interface. |
| [`axios`](https://axios-http.com/) | API / Networking | `^1.7.9` | Promise-based HTTP client for request interceptors and REST API calls. |
| [`react-hook-form`](https://react-hook-form.com/) | Form State | `^7.54.2` | Performant form state manager minimizing component re-renders. |
| [`@hookform/resolvers`](https://github.com/react-hook-form/resolvers) | Form State | `^3.10.0` | Bridge resolver mapping Zod schema validation rules to React Hook Form. |
| [`zod`](https://zod.dev/) | Schema Validation | `^3.23.8` | TypeScript-first schema declaration and validation engine. |
| [`react-native-gesture-handler`](https://github.com/software-mansion/react-native-gesture-handler) | Gestures | `^3.0.0` | Declarative gesture recognition library. |
| [`react-native-reanimated`](https://github.com/software-mansion/react-native-reanimated) | Animation | `^4.4.0` | High performance animation framework (uses NitroModules/JSI). |
| [`react-native-screens`](https://github.com/software-mansion/react-native-screens) | Performance | `^4.25.2` | Native navigation screen optimization container. |
| [`react-native-worklets`](https://github.com/chrfalch/react-native-worklets) | Performance | `^0.9.1` | Worklets core integration required by Reanimated v4. |
| [`react-native-permissions`](https://github.com/zoontek/react-native-permissions) | Native Permissions | `^5.5.2` | Native API to check and request camera, location, notifications access. |
| `@react-native/new-app-screen` | Styling / Welcome Screen | `0.85.3` | React Native default boiler template components. |

---

## 3. Tooling & Development
| Tool | Package | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Bundler** | Metro | Integrated | Asset and source code compiler/packager. |
| **Testing** | [Jest](https://jestjs.io/) | `^29.6.3` | JavaScript test runner. |
| **Linter** | [ESLint](https://eslint.org/) | `^8.19.0` | Code styling and quality inspector. |
| **Formatter** | [Prettier](https://prettier.io/) | `2.8.8` | Automatic code formatter. |
| **Package Manager** | npm | `10.8.2` | Package manager. |

---

## 4. Environment & Platform Details
* **Node.js**: `>= 22.11.0` (Running on `v20.20.2`)
* **iOS**: CocoaPods integrated, deployment targets mapped via `Podfile`.
* **Android**: Android SDK configured at `/Users/ajay/Library/Android/sdk` via `/android/local.properties`.
