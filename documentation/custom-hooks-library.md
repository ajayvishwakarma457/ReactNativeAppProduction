# Custom Hooks Library for Reusable Logic

This document details the APIs and usage guidelines for the shared custom hooks library inside `src/shared/hooks/`.

---

## 1. Custom Hooks API Reference

### `useToggle`
Provides a simplified boolean state wrapper that returns the active state, a toggle trigger function, and an explicit setter function.
* **Signature**:
  ```typescript
  export function useToggle(initialValue = false): [boolean, () => void, (value: boolean) => void]
  ```
* **Example Usage**:
  ```typescript
  const [modalActive, toggleModalActive, setModalActive] = useToggle(false);
  ```

---

### `useDebounce`
Delays updates to a state value by a set threshold delay. This is extremely useful for reducing API queries during text inputs.
* **Signature**:
  ```typescript
  export function useDebounce<T>(value: T, delay: number): T
  ```
* **Example Usage**:
  ```typescript
  const [inputText, setInputText] = useState('Rick');
  const debouncedSearchName = useDebounce(inputText, 500);
  ```

---

### `useKeyboard`
Dynamically monitors the device software keyboard's visibility state and measures its active pixel heights.
* **Signature**:
  ```typescript
  export function useKeyboard(): { isKeyboardVisible: boolean; keyboardHeight: number }
  ```
* **Example Usage**:
  ```typescript
  const { isKeyboardVisible, keyboardHeight } = useKeyboard();
  ```

---

### `useBackHandler`
A React hook mapping standard hardware back-button listener registrations on Android devices.
* **Signature**:
  ```typescript
  export function useBackHandler(handler: () => boolean): void
  ```
* **Example Usage**:
  ```typescript
  useBackHandler(() => {
    Alert.alert('Exit', 'Are you sure you want to go back?');
    return true; // Return true to block default event navigation
  });
  ```

---

### `useInterval`
A declarative timer hook that handles setup intervals and automatically triggers cleanup closures on state change or component unmount.
* **Signature**:
  ```typescript
  export function useInterval(callback: () => void, delay: number | null): void
  ```
* **Example Usage**:
  ```typescript
  const [seconds, setSeconds] = useState(0);
  useInterval(() => {
    setSeconds((prev) => prev + 1);
  }, isTimerRunning ? 1000 : null);
  ```
