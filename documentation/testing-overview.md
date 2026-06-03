# Testing Strategy Overview - Unit, Integration, Snapshot & E2E

This document details the testing architecture, configurations, and verification methods implemented in the React Native application.

---

## 1. Unit Testing
* **Definition**: Validates business logic, state mutations, and standalone functions in complete isolation.
* **Scope**: Redux store reducers, actions, custom hooks, and formatters.
* **Files**:
  - [counterSlice.test.ts](file:///Users/ajay/Documents/ReactNativeAppProduction/__tests__/counterSlice.test.ts)
* **How to run**:
  ```bash
  npm test
  ```

---

## 2. Component Testing
* **Definition**: Testing rendering outputs, child bindings, and callback execution of reusable React components without mounting the full application.
* **Scope**: Custom components, inputs, buttons, and layouts.
* **Files**:
  - [PostCard.test.tsx](file:///Users/ajay/Documents/ReactNativeAppProduction/__tests__/PostCard.test.tsx)
* **How to run**:
  ```bash
  npx jest PostCard
  ```

---

## 3. Integration Testing
* **Definition**: Verifies the communication between components, context providers, and the Redux state store.
* **Scope**: Verifies that pressing interactive buttons (like bookmark stars) dispatches the correct Redux action and propagates store state changes back to display components (bookmarks count in the header).
* **Files**:
  - [Integration.test.tsx](file:///Users/ajay/Documents/ReactNativeAppProduction/__tests__/Integration.test.tsx)
* **How to run**:
  ```bash
  npx jest Integration
  ```

---

## 4. Snapshot Testing
* **Definition**: Captures the rendered JSON tree of a UI component and compares it to a stored baseline reference to prevent unexpected visual regressions.
* **Scope**: Card layouts and complex rendering trees.
* **Files**:
  - [Snapshot.test.tsx](file:///Users/ajay/Documents/ReactNativeAppProduction/__tests__/Snapshot.test.tsx)
* **Updating Snapshots**:
  If you intentionally changed the UI structure, update the reference snapshots by running:
  ```bash
  npx jest -u
  ```

---

## 5. End-to-End (E2E) Testing
* **Definition**: Automates simulated user gestures (taps, typing, scrolls) on native binary bundles inside an active simulator.
* **Scope**: Interactive user flows, screens transition navigation, and startup load stability.
* **Flow Script**:
  - [main_flow.yaml](file:///Users/ajay/Documents/ReactNativeAppProduction/.maestro/main_flow.yaml)
* **How to Setup & Run**:
  1. Install the Maestro command-line tool:
     ```bash
     curl -FsSL https://get.maestro.mobile.dev | bash
     ```
  2. Boot up an iOS simulator or connect an Android emulator.
  3. Compile and build the application:
     ```bash
     npm run ios # or npm run android
     ```
  4. Execute Maestro against the flow YAML script:
     ```bash
     maestro test .maestro/main_flow.yaml
     ```

---

## 6. Regression Testing
* **Definition**: Running the entire testing suite automatically in CI/CD pipelines to ensure new features do not break existing code.
* **Scope**: Run all Unit, Component, Integration, and Snapshot tests.
* **Pipeline Integration**:
  Add testing steps to your GitHub Actions workflow:
  ```yaml
  - name: Run Tests
    run: npm test
  ```
