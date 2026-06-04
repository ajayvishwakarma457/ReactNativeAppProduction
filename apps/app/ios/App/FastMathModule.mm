#import <React/RCTBridgeModule.h>
#import <React/RCTBridge+Private.h>
#import "FastMathJSI.h"

@interface FastMathModule : NSObject <RCTBridgeModule>
@end

@implementation FastMathModule

RCT_EXPORT_MODULE(FastMathModule);

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

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

@end
