# Secure Storage Implementation Guide (expo-secure-store)

This document outlines the design, implementation, and integration of the secure storage module inside our React Native monorepo application using **`expo-secure-store`**.

---

## 1. Why `expo-secure-store`?

While general app data, caching, and layout preferences can be saved in high-performance storage like **MMKV** (unencrypted by default), any highly sensitive user data must be encrypted to protect against access on compromised or rooted devices.

We use `expo-secure-store` to encrypt and store data:
* **iOS**: Data is stored securely inside the **Keychain Services API**.
* **Android**: Data is encrypted using AES-256 GCM and stored in **EncryptedSharedPreferences** backed by the hardware-level **Android Keystore**.

### Common Use Cases:
* User Authentication Tokens (JWTs, Access & Refresh Tokens).
* Private User API Keys.
* Personally Identifiable Information (PII).

---

## 2. Shared Library Implementation

We implemented a type-safe wrapper inside our shared library workspace at `libs/shared/src/services/secureStorage.ts` to expose a clean, promise-based API.

### Service Code:
```typescript
import * as SecureStore from 'expo-secure-store';

export interface ISecureStorage {
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<string | null>;
  removeItem(key: string): Promise<void>;
  hasItem(key: string): Promise<boolean>;
}

export const SecureStorageService: ISecureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`SecureStorage: Error setting item for key "${key}":`, error);
      throw error;
    }
  },

  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`SecureStorage: Error getting item for key "${key}":`, error);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`SecureStorage: Error removing item for key "${key}":`, error);
      throw error;
    }
  },

  async hasItem(key: string): Promise<boolean> {
    try {
      const item = await this.getItem(key);
      return item !== null;
    } catch {
      return false;
    }
  },
};
```

---

## 3. How to Consume the Service

The service is fully exported from the shared library entrypoint ([libs/shared/src/index.ts](file:///Users/ajay/Documents/ReactNativeAppProduction/libs/shared/src/index.ts)).

### Usage Example:
```typescript
import { SecureStorageService } from '@app/shared';

// Saving a JWT Token
await SecureStorageService.setItem('authToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');

// Retrieving a JWT Token
const token = await SecureStorageService.getItem('authToken');

// Deleting a token on logout
await SecureStorageService.removeItem('authToken');
```

---

## 4. Verification & Testing

We have added comprehensive unit tests under [__tests__/SecureStorage.test.ts](file:///Users/ajay/Documents/ReactNativeAppProduction/__tests__/SecureStorage.test.ts) to verify storage behavior and mock the native module calls cleanly:

```bash
npm test
```
The test suite validates:
1. Writing values to the store and reading them back.
2. Graceful handling and returning `null` for keys that do not exist.
3. Verification of token existence using the `hasItem` method.
4. Correct deletion and cleanup of keys using `removeItem`.
