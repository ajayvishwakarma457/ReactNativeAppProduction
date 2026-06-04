#import "RTNCenteredText.h"

#import <react/renderer/components/AppSpec/ComponentDescriptors.h>
#import <react/renderer/components/AppSpec/EventEmitters.h>
#import <react/renderer/components/AppSpec/Props.h>
#import <react/renderer/components/AppSpec/ShadowNodes.h>

#import <React/RCTConversions.h>

using namespace facebook::react;

@implementation RTNCenteredText {
  UILabel *_label;
}

- (instancetype)initWithFrame:(CGRect)frame {
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RTNCenteredTextProps>();
    _props = defaultProps;

    _label = [[UILabel alloc] init];
    _label.textAlignment = NSTextAlignmentCenter;
    _label.numberOfLines = 0;
    
    self.contentView = _label;
  }
  return self;
}

// Fabric Prop Update hook
- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps {
  const auto &oldViewProps = *std::static_pointer_cast<RTNCenteredTextProps const>(_props);
  const auto &newViewProps = *std::static_pointer_cast<RTNCenteredTextProps const>(props);

  if (oldViewProps.text != newViewProps.text) {
    _label.text = RCTNSStringFromString(newViewProps.text);
  }

  if (oldViewProps.textColor != newViewProps.textColor) {
    if (newViewProps.textColor.length() > 0) {
      NSString *hexColor = RCTNSStringFromString(newViewProps.textColor);
      _label.textColor = [self colorFromHexString:hexColor];
    } else {
      _label.textColor = [UIColor blackColor];
    }
  }

  [super updateProps:props oldProps:oldProps];
}

// Link component descriptor to Fabric renderer
+ (ComponentDescriptorProvider)componentDescriptorProvider {
  return concreteComponentDescriptorProvider<RTNCenteredTextComponentDescriptor>();
}

- (void)layoutSubviews {
  [super layoutSubviews];
  _label.frame = self.bounds;
}

- (UIColor *)colorFromHexString:(NSString *)hexString {
  unsigned rgbValue = 0;
  NSScanner *scanner = [NSScanner scannerWithString:hexString];
  if ([hexString hasPrefix:@"#"]) {
    [scanner setScanLocation:1];
  }
  [scanner scanHexInt:&rgbValue];
  return [UIColor colorWithRed:((rgbValue & 0xFF0000) >> 16)/255.0
                         green:((rgbValue & 0xFF00) >> 8)/255.0
                          blue:(rgbValue & 0xFF)/255.0
                         alpha:1.0];
}

@end
