# Rendering Optimizations - React.memo, useCallback & useMemo

This document explains the React Native performance optimization strategies applied to avoid unnecessary re-renders of list items and UI elements.

## Core Concepts

### 1. React.memo (Component Memoization)
By default, React re-renders a child component whenever its parent component re-renders. Wrapping a component in `React.memo` makes React perform a shallow comparison of its props:
- If props haven't changed, React skips rendering the component and reuses the last rendered result.
- This is extremely valuable for list items (e.g. inside `FlashList` or `FlatList`) because when one list item changes (such as clicking a bookmark), we do not want the remaining 50 unchanged items in the list to re-render.

### 2. useCallback (Function Reference Stability)
In JavaScript, functions are objects, so a function defined inside a component is recreated on every render:
```typescript
// Recreated on every render!
const handlePress = () => { ... };
```
Passing this function to a child component (even one wrapped in `React.memo`) breaks memoization because the function reference changes on every render.
Wrapping it in `useCallback` returns a memoized version of the callback that only changes if one of the dependencies has changed:
```typescript
const handlePress = useCallback(() => { ... }, []);
```

### 3. useMemo (Value Computation Caching)
Caching expensive computations so they aren't executed on every single render pass.
```typescript
const memoizedVal = useMemo(() => expensiveCalculation(param), [param]);
```

---

## Codebase Implementation

### HomeScreen Optimizations
We refactored `HomeScreen` to optimize performance of the blog posts list:

1. **Extracted `PostCard` Component**:
   Extracted the individual list item renderer to a module-level component wrapped in `React.memo`:
   ```typescript
   const PostCard = React.memo(({ item, theme, isLiked, onPress, onLikePress }: PostCardProps) => { ... });
   ```

2. **Memoized Handlers**:
   Used `useCallback` to ensure reference stability for event handlers:
   ```typescript
   const handlePress = useCallback((item: any) => {
     navigation.navigate('Details', { itemId: item.id.toString(), title: item.title, desc: item.body });
   }, [navigation]);

   const handleLikePress = useCallback((id: number) => {
     dispatch(toggleLikePost(id));
   }, [dispatch]);
   ```

3. **Stable `renderItem`**:
   Memoized the `renderItem` prop passed to the `FlashList`:
   ```typescript
   const renderItem = useCallback(({ item }: { item: any }) => {
     const isLiked = likedPosts.includes(item.id);
     return (
       <PostCard
         item={item}
         theme={theme}
         isLiked={isLiked}
         onPress={handlePress}
         onLikePress={handleLikePress}
       />
     );
   }, [theme, likedPosts, handlePress, handleLikePress]);
   ```

---

## Visualizing Re-renders
You can view interactive examples of memoization tradeoffs and re-renders in action on the **Hooks Playground Screen** (`/hooks` page).
- Toggle **useCallback** on and off to observe how unmemoized functions force child components (even those with `React.memo`) to re-render.
- Toggle **useMemo** on and off while typing to feel the difference in rendering frame lag.
