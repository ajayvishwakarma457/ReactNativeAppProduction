#import "BatteryStatus.h"
#import <UIKit/UIKit.h>

@implementation BatteryStatus

RCT_EXPORT_MODULE(BatteryStatus);

- (NSDictionary *)getBatteryStatus {
  // Enable battery monitoring on the device
  [UIDevice currentDevice].batteryMonitoringEnabled = YES;
  
  float level = [UIDevice currentDevice].batteryLevel;
  UIDeviceBatteryState state = [UIDevice currentDevice].batteryState;
  
  BOOL isCharging = (state == UIDeviceBatteryStateCharging || state == UIDeviceBatteryStateFull);
  
  // Return mapping to Spec shape: { level: number, isCharging: boolean }
  return @{
    @"level": @(level >= 0 ? level * 100 : 50.0),
    @"isCharging": @(isCharging)
  };
}

// Required boilerplate mapping method for TurboModules in React Native New Architecture
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeBatteryStatusSpecJSI>(params);
}

@end
