import Foundation
import React

@objc(DeviceHelper)
class DeviceHelper: NSObject {
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
  
  @objc
  func getDeviceModel(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    #if targetEnvironment(simulator)
      let model = "iOS Simulator (\(UIDevice.current.model))"
    #else
      let model = UIDevice.current.name
    #endif
    resolve(model)
  }
}
