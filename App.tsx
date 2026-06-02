import React, { useState } from 'react';
import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View, Button, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { getStorage } from './src/services/storage';
import { useMMKVString, useMMKVNumber } from 'react-native-mmkv';

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

  // Retrieve MMKV instance lazily
  const storageInstance = getStorage();

  // MMKV Hooks for live state persistence (falls back to default instance if custom fails)
  const [persistedText, setPersistedText] = useMMKVString('app.username', storageInstance ?? undefined);
  const [persistedCount, setPersistedCount] = useMMKVNumber('app.counter', storageInstance ?? undefined);

  // Fallbacks
  const count = persistedCount ?? 0;
  const username = persistedText ?? '';

  if (shouldCrash) {
    return <CrashComponent />;
  }

  const handleIncrement = () => {
    if (storageInstance) {
      storageInstance.set('app.counter', count + 1);
    } else {
      setPersistedCount(count + 1);
    }
  };

  const handleClear = () => {
    if (storageInstance) {
      storageInstance.clearAll();
    }
  };

  return (
    <View style={styles.container}>
      {/* Top actions/controllers bar */}
      <View style={[
        styles.crashTriggerBox, 
        { paddingTop: Math.max(safeAreaInsets.top, 16) }
      ]}>
        <Button
          title="Trigger Render Crash"
          color="#EF4444"
          onPress={() => setShouldCrash(true)}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* MMKV Persistence Card */}
        <View style={styles.dashboardCard}>
          <Text style={styles.cardTitle}>⚡ MMKV Local Persistence</Text>
          <Text style={styles.cardSubtitle}>
            Super fast, synchronous key-value storage engine.
          </Text>

          {/* Text Persistence */}
          <View style={styles.section}>
            <Text style={styles.label}>Persistent Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setPersistedText}
              placeholder="Type your name here..."
              placeholderTextColor="#64748B"
            />
            <Text style={styles.persistentIndicator}>
              Saved value: <Text style={styles.boldText}>{username ? username : '(none)'}</Text>
            </Text>
          </View>

          {/* Counter Persistence */}
          <View style={styles.section}>
            <Text style={styles.label}>Persistent Counter</Text>
            <View style={styles.counterRow}>
              <Text style={styles.counterValue}>{count}</Text>
              <TouchableOpacity style={styles.button} onPress={handleIncrement}>
                <Text style={styles.buttonText}>+ Increment</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Reset Action */}
          <TouchableOpacity style={styles.resetButton} onPress={handleClear}>
            <Text style={styles.resetButtonText}>Clear All MMKV Data</Text>
          </TouchableOpacity>
        </View>

        <NewAppScreen
          templateFileName="App.tsx"
          safeAreaInsets={{ ...safeAreaInsets, top: 0 }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  crashTriggerBox: {
    paddingBottom: 16,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  dashboardCard: {
    margin: 16,
    padding: 20,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#38BDF8',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    paddingBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E2E8F0',
    marginBottom: 8,
  },
  input: {
    height: 48,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#F8FAFC',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#334155',
  },
  persistentIndicator: {
    marginTop: 8,
    fontSize: 13,
    color: '#94A3B8',
  },
  boldText: {
    color: '#38BDF8',
    fontWeight: '600',
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  counterValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  button: {
    backgroundColor: '#38BDF8',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#0F172A',
    fontWeight: '700',
    fontSize: 15,
  },
  resetButton: {
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#EF4444',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default App;


