# Unit Testing Guide - Jest + React Native Testing Library (RNTL)

This document provides guidelines, commands, and best practices for writing and executing unit tests in the React Native application.

## Test Environment Config
- **Test Runner**: Jest
- **Testing Utility**: React Native Testing Library (`@testing-library/react-native`)
- **Global Configuration**: [jest.config.js](file:///Users/ajay/Documents/ReactNativeAppProduction/jest.config.js)
- **Mock Definitions**: [jestSetup.js](file:///Users/ajay/Documents/ReactNativeAppProduction/jestSetup.js)

---

## Commands

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npx jest --watch
```

### Run specific test files
```bash
npx jest PostCard
```

---

## Mocks inside `jestSetup.js`
To verify component logic without crashing on native code, we mock platforms and libraries:
1. **MMKV**: In-memory `Map`-backed key-value storage engine mock.
2. **Firebase**: Stub checks and messaging callbacks.
3. **Reanimated**: Stubs out interpolations, animatable views, easing functions, and values.
4. **Expo Image**: Renders a standard React Native `View` placeholder.
5. **Permissions**: Standard permission request/check mocks.

---

## Writing Tests

### 1. Testing Components (e.g. `PostCard.test.tsx`)
Verify rendering and prop callback triggers:
```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PostCard } from '../src/screens/Home/HomeScreen';

describe('PostCard Component', () => {
  it('renders elements and triggers callbacks', () => {
    const mockPress = jest.fn();
    const { getByText } = render(
      <PostCard
        item={{ id: 1, title: 'Hello', body: 'World' }}
        theme={{ card: '#fff' }}
        isLiked={false}
        onPress={mockPress}
        onLikePress={jest.fn()}
      />
    );
    expect(getByText('Hello')).toBeTruthy();
    fireEvent.press(getByText('Hello'));
    expect(mockPress).toHaveBeenCalled();
  });
});
```

### 2. Testing Reducers & Slices (e.g. `counterSlice.test.ts`)
Verify state modifications:
```typescript
import reducer, { increment } from '../src/store/counterSlice';

describe('counterSlice Reducer', () => {
  it('increments state value', () => {
    const state = { value: 0, likedPosts: [] };
    const nextState = reducer(state, increment());
    expect(nextState.value).toBe(1);
  });
});
```
