# Fabric Native Components (New Architecture)

This document details the configuration and implementation of a custom **Fabric Native Component** in our React Native project under the New Architecture.

---

## 1. Directory Structure

Our custom Fabric component is structured inside the application workspace:

```
ReactNativeAppProduction/
├── apps/app/
│   ├── package.json                   # Contains codegenConfig specs (type: all)
│   └── src/
│       ├── shared/specs/
│       │   └── CenteredTextNativeComponent.ts  # Component TypeScript Spec
│       └── apisPlayground/screens/
│           └── TurboModuleScreen.tsx        # Integrates custom Fabric component
└── apps/app/ios/App/
    ├── RTNCenteredText.h               # Objective-C Header file
    └── RTNCenteredText.mm              # Objective-C++ View implementation
```

---

## 2. Step-by-Step Implementation

### Step 1: Define TypeScript Specification (`CenteredTextNativeComponent.ts`)
The spec file must define the properties and register the component via `codegenNativeComponent`:

```typescript
import { HostComponent, ViewProps } from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

export interface CenteredTextProps extends ViewProps {
  text?: string;
  textColor?: string;
}

export default codegenNativeComponent<CenteredTextProps>(
  'RTNCenteredText'
) as HostComponent<CenteredTextProps>;
```

---

### Step 2: Configure Codegen in `package.json`
Configure the `codegenConfig` block inside `apps/app/package.json` to compile components:

```json
  "codegenConfig": {
    "name": "AppSpec",
    "type": "all",
    "jsSrcsDir": "src/shared/specs"
  }
```

Running `pod install` compiles the component specifications and generates the C++ descriptor and shadow nodes under the ReactCodegen directories:
* Output files: `Props.h`, `ShadowNodes.h`, `ComponentDescriptors.h` inside `react/renderer/components/AppSpec/`.

---

### Step 3: Implement Native Objective-C++ View (`RTNCenteredText.mm`)
We implement the custom component view inheriting from `RCTViewComponentView`. It overrides `updateProps` to map C++ generated props directly to iOS `UILabel` properties:

```objc
#import "RTNCenteredText.h"
#import <react/renderer/components/AppSpec/Props.h>

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

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps {
  const auto &oldViewProps = *std::static_pointer_cast<RTNCenteredTextProps const>(_props);
  const auto &newViewProps = *std::static_pointer_cast<RTNCenteredTextProps const>(props);

  if (oldViewProps.text != newViewProps.text) {
    _label.text = RCTNSStringFromString(newViewProps.text);
  }

  if (oldViewProps.textColor != newViewProps.textColor) {
    if (newViewProps.textColor.length() > 0) {
       _label.textColor = [self colorFromHexString:RCTNSStringFromString(newViewProps.textColor)];
    }
  }

  [super updateProps:props oldProps:oldProps];
}

+ (ComponentDescriptorProvider)componentDescriptorProvider {
  return concreteComponentDescriptorProvider<RTNCenteredTextComponentDescriptor>();
}

- (void)layoutSubviews {
  [super layoutSubviews];
  _label.frame = self.bounds;
}

@end
```

---

### Step 4: Frontend Screen Integration (`TurboModuleScreen.tsx`)
We render the custom native component in React Native with layout style properties:

```typescript
import RTNCenteredText from '../../shared/specs/CenteredTextNativeComponent';

<RTNCenteredText
  text="🏎️ Direct draw via C++ Fabric Component!"
  textColor={theme.primary}
  style={{ width: '100%', height: 60 }}
/>
```

---

## 3. Verification & Execution

To test the implementation in the iOS simulator:
1. Open the drawer menu and navigate to **Turbo Module**.
2. Below the battery metrics card, you will see a container styled with a dashed indigo border.
3. The text `"🏎️ Direct draw via C++ Fabric Component!"` is rendered inside this container. It is drawn and centered natively by the iOS `UILabel` initialized and managed by the Fabric layout engine.
