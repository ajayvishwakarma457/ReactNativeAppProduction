#import <ReactAppDependencyProvider/RCTAppDependencyProvider.h>
#import <ReactCodegen/RCTThirdPartyComponentsProvider.h>
#import "RTNCenteredText.h"

@interface RCTAppDependencyProvider (AppCustom)
@end

@implementation RCTAppDependencyProvider (AppCustom)

- (nonnull NSDictionary<NSString *, Class<RCTComponentViewProtocol>> *)thirdPartyFabricComponents {
  static NSDictionary<NSString *, Class<RCTComponentViewProtocol>> *components = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    NSDictionary *original = [RCTThirdPartyComponentsProvider thirdPartyFabricComponents];
    NSMutableDictionary *dict = [[NSMutableDictionary alloc] initWithDictionary:original];
    dict[@"RTNCenteredText"] = [RTNCenteredTextComponentView class];
    components = [dict copy];
  });
  return components;
}

@end
