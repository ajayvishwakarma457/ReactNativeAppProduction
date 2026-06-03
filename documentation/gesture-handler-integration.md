# React Native Gesture Handler Integration Guide

React Native Gesture Handler provides declarative APIs for touch and gesture tracking, running natively to deliver 60FPS/120FPS interactions. It integrates directly with React Native Reanimated to execute gestures entirely on the native UI thread.

---

## 1. Root Level Integration

We have already integrated the root container `GestureHandlerRootView` at the entry point of the application in [App.tsx](file:///Users/ajay/Documents/ReactNativeAppProduction/apps/app/App.tsx):

```typescript
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Rest of navigation and providers */}
    </GestureHandlerRootView>
  );
}
```

---

## 2. Using the Modern Gesture API (GestureDetector)

Gesture Handler v2 uses the `GestureDetector` component combined with the `Gesture` constructor object to declare gestures.

### Multi-Touch & Gesture Types
* `Gesture.Tap()`: Single/double-tap tracking.
* `Gesture.Pan()`: Dragging and swiping tracking.
* `Gesture.Pinch()`: Two-finger scale gesture tracking.
* `Gesture.Rotation()`: Angle rotation tracking.
* `Gesture.LongPress()`: Pressed-duration holding tracking.

---

## 3. Draggable Card Example (Pan Gesture + Reanimated)

Below is the standard pattern for implementing a high-performance draggable/swipeable card component using `Gesture.Pan()` and Reanimated:

```typescript
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

export const DraggableCard = () => {
  // 1. Declare Shared Values for X and Y offsets
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);

  // 2. Define the Pan Gesture
  const panGesture = Gesture.Pan()
    .onStart(() => {
      // Save current positions when drag starts
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;
    })
    .onUpdate((event) => {
      // Update values smoothly on the UI thread
      translationX.value = prevTranslationX.value + event.translationX;
      translationY.value = prevTranslationY.value + event.translationY;
    })
    .onEnd(() => {
      // Return the card to its original position using spring physics
      translationX.value = withSpring(0);
      translationY.value = withSpring(0);
    });

  // 3. Map translation offsets to an Animated Style
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translationX.value },
        { translateY: translationY.value },
      ],
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <Text style={styles.text}>Drag Me!</Text>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 150,
    height: 150,
    backgroundColor: '#38BDF8',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  text: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
```

---

## 4. Resolving Scroll and Swipe Conflicts

If you have a horizontal swipe gesture (like a swipeable row) inside a vertical `ScrollView`, the gestures will compete, causing erratic behavior.

To solve this, use relation modifiers:

### simultaneousHandlers (Simultaneous Detection)
Allows multiple gesture handlers to receive touch events simultaneously:
```typescript
const pan = Gesture.Pan();
const pinch = Gesture.Pinch();

// Detect pinch and pan at the same time
const combinedGesture = Gesture.Simultaneous(pan, pinch);
```

### requireExternalGestureToFail (Exclusive Handlers)
Waits for another gesture (like a scroll) to fail before starting the custom gesture:
```typescript
// Custom pan requires scroll behavior to fail first
const pan = Gesture.Pan().requireExternalGestureToFail(scrollViewRef);
```
