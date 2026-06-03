#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(DeviceHelper, NSObject)

RCT_EXTERN_METHOD(getDeviceModel:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
