# JavaScript Interface (JSI): Replacing the Bridge

JSI (JavaScript Interface) is the core technology of React Native's New Architecture. It replaces the classic asynchronous serialized JSON Bridge with a direct, high-performance C++ binding layer between JavaScript and the native platform.

This guide explains what JSI is, how it works under the hood, and how it dramatically improves performance in React Native.

---

## 1. What is JSI?

JSI is a unified, engine-independent C++ API layer. It allows the JavaScript engine (Hermes, JavaScriptCore, V8) to communicate directly with C++ host objects. 

Under the old architecture, JavaScript could not interact with native code directly. With JSI, the JS engine can invoke C++ methods **synchronously** and hold reference mappings in memory, bypassing the bridge completely.

---

## 2. JSI vs. The Bridge Architecture

| Feature | The Classic Bridge | JSI (New Architecture) |
| :--- | :--- | :--- |
| **Communication Type** | Asynchronous only | Synchronous or Asynchronous |
| **Data Serialization** | Required (Serialized to JSON strings) | Not required (Direct sharing of memory/references) |
| **Thread Execution** | Queue-based execution batching | Direct C++ thread execution |
| **Latency** | High (serialization + batch queuing overhead) | Zero (Instant native invocation) |
| **Autoloading** | All modules loaded at launch | Lazy-loaded on-demand |

---

## 3. Key Concepts of JSI

JSI operates using C++ types mapped to JavaScript primitives:

* **`jsi::Runtime`**: Represents the JavaScript execution environment. Native modules access the runtime to inject variables and functions directly into the JS global scope.
* **`jsi::Value`**: A wrapper representing any JavaScript value (number, string, object, function).
* **`jsi::HostObject`**: A C++ class that can be passed to JavaScript as an object. JS can read properties and call methods on this C++ object directly.

---

## 4. How JSI works in Practice: A C++ Binding Example

Below is a conceptual example of how a native C++ module uses JSI to register a fast synchronous math multiplication function directly into the JS global scope.

### Native C++ Registration
```cpp
#include <jsi/jsi.h>

using namespace facebook;

void installMathModule(jsi::Runtime& runtime) {
  // 1. Create a C++ host function
  auto multiply = jsi::Function::createFromHostFunction(
    runtime,
    jsi::PropNameID::forAscii(runtime, "multiply"),
    2, // Number of arguments
    [](jsi::Runtime& rt, const jsi::Value& thisVal, const jsi::Value* args, size_t count) -> jsi::Value {
      if (count < 2) return jsi::Value::undefined();
      
      double a = args[0].asNumber();
      double b = args[1].asNumber();
      
      // Return result directly to JS execution frame
      return jsi::Value(a * b);
    }
  );

  // 2. Bind the function directly into the JavaScript global namespace
  runtime.global().setProperty(runtime, "nativeMultiply", multiply);
}
```

### JavaScript Invocation
Once registered, JavaScript can invoke it synchronously like any standard JS function:
```javascript
// Invoked instantly with zero serialization overhead
const result = global.nativeMultiply(5, 10); 
console.log(result); // 50
```

---

## 5. Real-World Libraries Powered by JSI

Many high-performance React Native libraries rely entirely on JSI for speed:

1. **`react-native-mmkv`**: A key-value storage engine that is 30x+ faster than AsyncStorage. It uses JSI to write and read directly to MMKV's C++ storage instances synchronously.
2. **`react-native-reanimated`**: Synchronizes gesture events and frame updates on the UI thread by executing "Worklet" functions directly via JSI-bound runtime channels.
3. **`react-native-nitro-modules`**: An advanced JSI-binding framework that autogenerates type-safe C++ bindings between Swift/Kotlin and JavaScript.
