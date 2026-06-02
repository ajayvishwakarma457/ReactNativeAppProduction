import 'react-native-gesture-handler';
/**
 * @format
 */

import { AppRegistry } from 'react-native';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';

// Initialize mock Firebase App if not present natively to prevent start-up crashes
try {
  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: 'mock-api-key-for-local-playground-only',
      appId: '1:1234567890:ios:1234567890',
      projectId: 'mock-project-id',
      messagingSenderId: '1234567890',
      databaseURL: 'https://mock-project-id.firebaseio.com',
      storageBucket: 'mock-project-id.appspot.com',
    });
  }
} catch (error) {
  console.warn('[Firebase Init Fallback Error]', error);
}

// Register background handler
try {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('[Background Message] Received:', remoteMessage);
  });
} catch (error) {
  console.warn('[Firebase Messaging Background Handler Error]', error);
}

AppRegistry.registerComponent(appName, () => App);
