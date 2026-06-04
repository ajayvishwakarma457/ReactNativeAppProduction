import { HostComponent, ViewProps } from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

export interface CenteredTextProps extends ViewProps {
  text?: string;
  textColor?: string;
}

export default codegenNativeComponent<CenteredTextProps>(
  'RTNCenteredText'
) as HostComponent<CenteredTextProps>;
