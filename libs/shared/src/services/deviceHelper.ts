import { NativeModules } from 'react-native';

const { DeviceHelper } = NativeModules;

export interface IDeviceHelper {
  getDeviceModel(): Promise<string>;
}

export const deviceHelper: IDeviceHelper = {
  getDeviceModel: async (): Promise<string> => {
    if (!DeviceHelper) {
      return 'Unknown Device (Helper not available)';
    }
    return DeviceHelper.getDeviceModel();
  },
};
