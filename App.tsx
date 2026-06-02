import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { RootNavigator } from './src/navigation/index';
import { ThemeProvider } from './src/context/ThemeContext';
import { store } from './src/store';

function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <ThemeProvider>
            <ErrorBoundary>
              <NavigationContainer>
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
