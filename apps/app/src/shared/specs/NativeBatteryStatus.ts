import { TurboModule, TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  getBatteryStatus(): {
    level: number;
    isCharging: boolean;
  };
}

export default TurboModuleRegistry.getEnforcing<Spec>('BatteryStatus');
