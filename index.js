import 'react-native-gesture-handler';
/**
 * @format
 */

import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';

// Register background handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('[Background Message] Received:', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
