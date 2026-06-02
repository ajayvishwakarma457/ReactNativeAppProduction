import { Alert, Platform } from 'react-native';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

export interface NotificationServiceConfig {
  onTokenReceived?: (token: string) => void;
  onNotificationReceivedForeground?: (message: FirebaseMessagingTypes.RemoteMessage) => void;
}

class NotificationsService {
  private token: string | null = null;

  public async requestUserPermission(): Promise<boolean> {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('[NotificationService] Permission status:', authStatus);
      }
      return enabled;
    } catch (error) {
      console.warn('[NotificationService] Permission request failed', error);
      return false;
    }
  }

  public async getFCMToken(): Promise<string | null> {
    try {
      // APNs registration is required before calling FCM on iOS
      if (Platform.OS === 'ios') {
        const apnsToken = await messaging().getAPNSToken();
        if (!apnsToken) {
          console.warn('[NotificationService] APNs Token is not ready yet');
        }
      }

      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        this.token = fcmToken;
        console.log('[NotificationService] Device FCM Token:', fcmToken);
        return fcmToken;
      }
      return null;
    } catch (error) {
      console.warn('[NotificationService] Failed to retrieve FCM token', error);
      return null;
    }
  }

  public initializeListeners(config?: NotificationServiceConfig): () => void {
    // 1. Foreground message handler
    const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
      console.log('[NotificationService] Foreground message received:', remoteMessage);
      
      if (config?.onNotificationReceivedForeground) {
        config.onNotificationReceivedForeground(remoteMessage);
      } else {
        // Fallback banner
        Alert.alert(
          remoteMessage.notification?.title || 'Notification Received',
          remoteMessage.notification?.body || ''
        );
      }
    });

    // 2. Background click handler (App was running in background)
    const unsubscribeNotificationOpened = messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('[NotificationService] App opened from background notification click:', remoteMessage);
    });

    // 3. Quit state handler (App was closed completely)
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log('[NotificationService] App opened from quit state notification click:', remoteMessage);
        }
      })
      .catch((error) => {
        console.warn('[NotificationService] getInitialNotification error', error);
      });

    // Return combined cleanup function
    return () => {
      unsubscribeForeground();
      unsubscribeNotificationOpened();
    };
  }
}

export const notificationsService = new NotificationsService();
