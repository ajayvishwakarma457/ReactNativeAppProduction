#include "FastMathJSI.h"

namespace facebook {
namespace jsi {

// High-performance iterative Fibonacci calculation in C++
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

void installFastMath(Runtime& runtime) {
  auto fibonacciFunc = Function::createFromHostFunction(
    runtime,
    PropNameID::forAscii(runtime, "nativeCalculateFibonacci"),
    1, // argument count
    [](Runtime& rt, const Value& thisVal, const Value* args, size_t count) -> Value {
      if (count < 1 || !args[0].isNumber()) {
        throw jsi::JSError(rt, "First argument must be a number");
      }
      
      int n = static_cast<int>(args[0].asNumber());
      if (n < 0) {
        throw jsi::JSError(rt, "Number must be non-negative");
      }
      
      long long result = calculateFibonacci(n);
      return Value(static_cast<double>(result));
    }
  );

  runtime.global().setProperty(runtime, "nativeCalculateFibonacci", std::move(fibonacciFunc));
}

} // namespace jsi
} // namespace facebook
