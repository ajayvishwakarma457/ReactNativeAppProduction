# C++ Modules for High-Performance Native Code (JSI)

This document details the implementation of a high-performance native C++ module bound directly to the JavaScript engine via **JSI (JavaScript Interface)** in our React Native project.

---

## 1. Why C++ and JSI?

Traditional native modules use the asynchronous JSON Bridge. This introduces overhead because arguments are serialized to JSON strings and queued for execution.

**JSI (JavaScript Interface)** allows:
* **Synchronous Execution**: JavaScript can invoke C++ functions directly in the same call frame.
* **Zero Serialization Overhead**: Direct memory mappings/references for arguments and return types.
* **High Performance**: Perfect for CPU-heavy tasks (e.g. cryptography, image filtering, mathematics, processing large datasets).

---

## 2. Directory Layout & Architecture

Our high-performance math engine is implemented in the iOS target under the `App` group:

```
apps/app/ios/App/
├── FastMathJSI.h        # C++ JSI installer interface
├── FastMathJSI.cpp      # High-performance C++ implementation
└── FastMathModule.mm    # ObjC++ wrapper module to inject JSI bindings
```

---

## 3. Implementation Details

### 1. The C++ Logic (`FastMathJSI.cpp`)
We implement an iterative Fibonacci calculator in pure C++. JSI bindings register this function synchronously:

```cpp
long long calculateFibonacci(int n) {
  if (n <= 1) return n;
  long long prev2 = 0, prev1 = 1;
  for (int i = 2; i <= n; ++i) {
    long long current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }
  return prev1;
}
```

It registers a JavaScript host function named `nativeCalculateFibonacci` in the `global` runtime context:
```cpp
runtime.global().setProperty(runtime, "nativeCalculateFibonacci", std::move(fibonacciFunc));
```

### 2. The Objective-C++ Injector (`FastMathModule.mm`)
The native module grabs the `jsi::Runtime` reference from the RCTCxxBridge and triggers the C++ bindings injection synchronously when `install()` is called:

```objc
RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(install) {
  RCTBridge *bridge = [RCTBridge currentBridge];
  if (bridge) {
    RCTCxxBridge *cxxBridge = (RCTCxxBridge *)bridge;
    if (cxxBridge.runtime) {
      facebook::jsi::Runtime *runtime = (facebook::jsi::Runtime *)cxxBridge.runtime;
      facebook::jsi::installFastMath(*runtime);
      return @YES;
    }
  }
  return @NO;
}
```

---

## 4. How to Use in JavaScript / TypeScript

To use the C++ module in your application:

1. **Install bindings** (typically during app startup or screen initialization):
   ```typescript
   import { NativeModules } from 'react-native';

   const { FastMathModule } = NativeModules;
   if (FastMathModule) {
     FastMathModule.install(); // Binds C++ functions to the global scope
   }
   ```

2. **Invoke the C++ function synchronously**:
   ```typescript
   // Fast, synchronous, zero-latency execution directly in C++
   if (typeof global.nativeCalculateFibonacci === 'function') {
     const result = global.nativeCalculateFibonacci(40);
     console.log('Fibonacci of 40 is:', result); // Output: 102334155
   }
   ```
