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
