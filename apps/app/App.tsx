import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { ErrorBoundary } from '@app/shared/components/ErrorBoundary';
import { RootNavigator } from './src/shared/navigation/index';
import { ThemeProvider } from '@app/shared/context/ThemeContext';
import { store } from './src/shared/store';
import { notificationsService } from '@app/shared/services/notifications';
import { useAppState } from '@app/shared/hooks/useAppState';
import { backgroundTasksService } from '@app/shared/services/backgroundTasks';

const linking = {
  prefixes: ['rnp://', 'https://rnp-app.com'],
  config: {
    screens: {
      MainTabs: {
        screens: {
          HomeStack: {
            screens: {
              Home: 'home',
              Details: 'details/:title',
            },
          },
          Persistence: 'persistence',
          Profile: 'profile',
        },
      },
      HooksPlayground: 'hooks',
      Settings: 'settings',
      PermissionsPlayground: 'permissions',
    },
  },
};

function App() {
  useAppState(
    () => {
      backgroundTasksService.executeBackgroundSync();
    },
    () => {
      const syncStatus = backgroundTasksService.getSyncStatus();
      console.log('[AppState] Resumed. Last sync time:', syncStatus.lastSyncTime);
    }
  );

  useEffect(() => {
    const setupNotifications = async () => {
      const hasPermission = await notificationsService.requestUserPermission();
      if (hasPermission) {
        await notificationsService.getFCMToken();
      }
    };

    setupNotifications();
    const unsubscribe = notificationsService.initializeListeners();

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <ThemeProvider>
            <ErrorBoundary>
              <NavigationContainer linking={linking as any}>
                <RootNavigator />
              </NavigationContainer>
            </ErrorBoundary>
          </ThemeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}

export default App;
