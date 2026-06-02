import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { RootNavigator } from './src/navigation/index';
import { ThemeProvider } from './src/context/ThemeContext';
import { store } from './src/store';
import { notificationsService } from './src/services/notifications';
import { useAppState } from './src/hooks/useAppState';
import { backgroundTasksService } from './src/services/backgroundTasks';

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
