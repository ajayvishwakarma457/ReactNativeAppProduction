# Fabric Renderer (New Architecture)

This document details the architecture, key concepts, and performance enhancements of **Fabric**, the new rendering pipeline of React Native's New Architecture.

---

## 1. What is Fabric?

**Fabric** is React Native's modern rendering system designed to replace the legacy rendering engine. Fabric is written in C++ and communicates directly with the JavaScript runtime via **JSI (JavaScript Interface)**.

Under the legacy architecture, UI modifications were serialized into JSON-like objects and sent asynchronously across the bridge to the UI thread, which then mapped them to native platform views. Fabric eliminates the bridge entirely, enabling direct C++ to Native UI rendering.

---

## 2. Key Architectural Improvements

### 1. Direct JSI Interaction (No Bridge)
Because Fabric is written in C++, the JavaScript engine (Hermes) can invoke rendering commands directly and synchronously. This means native views are created and updated instantly without JSON serialization bottlenecks.

### 2. Multi-Threaded Execution & Thread Safety
Fabric can execute layout calculations and rendering operations across different threads:
* **JS Thread**: Executes React component lifecycles.
* **Layout Thread (C++)**: Calculates flexbox layout structures (via Yoga layout engine).
* **UI Thread**: Draws native components on screen.

Furthermore, Fabric supports **synchronous layouts** on the UI thread, resolving issues like visual jumps, keyboard displacement lag, and rendering delays in long list views.

### 3. Unified Layout Engine (Yoga in C++)
Yoga executes layouts directly in C++ on host native objects, allowing layout computations to run in parallel without blocking main UI draw loops.

### 4. Flatter View Hierarchy
Fabric simplifies the native view tree structure, generating fewer intermediate wrapper containers. This results in reduced memory footprint and faster rendering times on the screen.

---

## 3. Compare: Legacy vs. Fabric Renderer

| Feature | Legacy Renderer | Fabric (New Architecture) |
| :--- | :--- | :--- |
| **Communication Layer** | Async JSON Bridge | Direct JSI Bindings (C++) |
| **Layout Calculations** | Native-side Yoga callbacks | Shared C++ Host Yoga engine |
| **Synchronous Actions** | Unsupported (causes UI delay/glitches) | Fully supported (instant keyboard/scroll sync) |
| **View Trees** | Deep nesting of helper wrappers | Flat, highly optimized view trees |
| **User Experience (UX)** | Frequent rendering drops in list scrolls | Smooth 60fps/120fps fluid scrolling |

---

## 4. How Custom Fabric Components are Created

To build custom UI elements with the Fabric Renderer, the New Architecture relies on the following steps:

1. **TypeScript Interface Spec**:
   Define the component props using strict type definitions (e.g. `RTNMyButtonProps`).
2. **Codegen Compilation**:
   Codegen reads the spec and compiles the necessary C++ classes, generating type-safe shadow nodes (`ShadowNode`) that coordinate with Yoga.
3. **Native View Implementation**:
   Implement the platform-specific drawing codes in Swift/Kotlin using the generated shadow node targets.
