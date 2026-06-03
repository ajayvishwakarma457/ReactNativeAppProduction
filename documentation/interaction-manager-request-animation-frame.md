# InteractionManager and requestAnimationFrame Guide

This document details how to optimize the JavaScript thread by scheduling tasks around animations and frame updates using React Native's `InteractionManager` and the standard `requestAnimationFrame` API.

---

## 1. Scheduling Tasks After Screen Transitions (`InteractionManager`)

When screen animations (like navigation transitions) are running, any heavy JavaScript task (such as rendering lists, initializing database caches, or processing JSON payloads) will stall the JS thread, causing frames to drop and the animation to stutter.

`InteractionManager` allows you to queue tasks to run only **after** active animations have completed.

### Basic Usage
```typescript
import { InteractionManager } from 'react-native';

InteractionManager.runAfterInteractions(() => {
  // Run expensive task here
  loadHistoricalData();
});
```

### Implementing with `useInteractionManager` Hook
We have created a reusable hook, [useInteractionManager.ts](file:///Users/ajay/Documents/ReactNativeAppProduction/libs/shared/src/hooks/useInteractionManager.ts), to handle scheduling inside functional components:

```typescript
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useInteractionManager } from '@app/shared/hooks/useInteractionManager';
import { HeavyList } from './HeavyList';

export const ScreenWithTransition: React.FC = () => {
  const isReady = useInteractionManager(); // Returns true once transition ends

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <HeavyList />;
};
```

---

## 2. Frame-by-Frame Animations (`requestAnimationFrame`)

`requestAnimationFrame` schedules a callback to run before the next frame is drawn (usually 16.6ms intervals for 60FPS). It is ideal for continuous incremental updates where calculations must match the display refresh rate without backing up the message queue.

### Example: Incremental Progress Animation
```typescript
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

export const ProgressMeter: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let animationFrameId: number;

    const updateFrame = () => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        animationFrameId = requestAnimationFrame(updateFrame);
        return prev + 1; // Increment progress per frame
      });
    };

    animationFrameId = requestAnimationFrame(updateFrame);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <View>
      <Text>Progress: {progress}%</Text>
    </View>
  );
};
```

---

## 3. Comparison of Scheduling APIs

| API | Best For | execution timing |
| :--- | :--- | :--- |
| **`requestAnimationFrame`** | Continuous updates, physics loops, incremental render loops | Runs right before next screen redraw (~16ms) |
| **`InteractionManager`** | Fetching APIs, parsing database caches, large React state updates | Runs after all active animations (drawers, pushes) finish |
| **`setTimeout(fn, 0)`** | Escaping current call stack, general deferrals | Runs on the next event loop tick (may interrupt animations) |
