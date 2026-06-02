import React, { useState } from 'react';
import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View, Button, Text } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { ErrorBoundary } from './src/components/ErrorBoundary';

// Helper component that intentionally crashes when rendered
function CrashComponent() {
  throw new Error('Simulation Crash: Render error triggered by user action!');
}

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const [shouldCrash, setShouldCrash] = useState(false);

  if (shouldCrash) {
    return <CrashComponent />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.crashTriggerBox}>
        <Button
          title="Trigger Render Crash"
          color="#EF4444"
          onPress={() => setShouldCrash(true)}
        />
      </View>
      <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  crashTriggerBox: {
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
});

export default App;

