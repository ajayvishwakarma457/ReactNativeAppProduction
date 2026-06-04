import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useMMKVString, useMMKVNumber } from 'react-native-mmkv';
import { getStorage } from '@app/shared/services/storage';
import { SecureStorageService } from '@app/shared/services/secureStorage';
import { useTheme } from '@app/shared/context/ThemeContext';

export const PersistenceScreen: React.FC = () => {
  const { theme } = useTheme();
  const storageInstance = getStorage();
  const [persistedText, setPersistedText] = useMMKVString('app.username', storageInstance ?? undefined);
  const [persistedCount, setPersistedCount] = useMMKVNumber('app.counter', storageInstance ?? undefined);
  
  // State for Secure Storage demonstration
  const [secureInput, setSecureInput] = React.useState('');
  const [loadedSecureValue, setLoadedSecureValue] = React.useState<string | null>('(not loaded)');

  const count = persistedCount ?? 0;
  const username = persistedText ?? '';

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

  const handleSaveSecure = async () => {
    try {
      await SecureStorageService.setItem('secure.user_token', secureInput);
      setLoadedSecureValue('(saved - click load to view)');
    } catch (e) {
      console.error(e);
    }
  };

  const handleLoadSecure = async () => {
    try {
      const val = await SecureStorageService.getItem('secure.user_token');
      setLoadedSecureValue(val !== null ? val : '(none found)');
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteSecure = async () => {
    try {
      await SecureStorageService.removeItem('secure.user_token');
      setLoadedSecureValue('(deleted)');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.scrollContainer, { backgroundColor: theme.background }]}>
      {/* MMKV Card */}
      <View style={[styles.dashboardCard, { backgroundColor: theme.card, borderColor: theme.cardBorder, marginBottom: 20 }]}>
        <Text style={[styles.cardTitleMMKV, { color: theme.primary }]}>⚡ MMKV Local Persistence</Text>
        <Text style={[styles.cardSubtitleMMKV, { color: theme.textMuted }]}>
          Super fast, synchronous key-value storage engine.
        </Text>

        <View style={[styles.section, { borderBottomColor: theme.cardBorder }]}>
          <Text style={[styles.label, { color: theme.text }]}>Persistent Username</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.cardBorder }]}
            value={username}
            onChangeText={setPersistedText}
            placeholder="Type your name here..."
            placeholderTextColor={theme.textMuted}
          />
          <Text style={[styles.persistentIndicator, { color: theme.textMuted }]}>
            Saved value: <Text style={[styles.boldText, { color: theme.primary }]}>{username ? username : '(none)'}</Text>
          </Text>
        </View>

        <View style={[styles.section, { borderBottomColor: theme.cardBorder }]}>
          <Text style={[styles.label, { color: theme.text }]}>Persistent Counter</Text>
          <View style={styles.counterRow}>
            <Text style={[styles.counterValue, { color: theme.text }]}>{count}</Text>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.primary }]} onPress={handleIncrement}>
              <Text style={[styles.actionButtonText, { color: theme.background }]}>+ Increment</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={[styles.resetButton, { borderColor: theme.error }]} onPress={handleClear}>
          <Text style={[styles.resetButtonText, { color: theme.error }]}>Clear All MMKV Data</Text>
        </TouchableOpacity>
      </View>

      {/* Secure Storage Card */}
      <View style={[styles.dashboardCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <Text style={[styles.cardTitleMMKV, { color: theme.primary }]}>🔐 Secure Encrypted Storage</Text>
        <Text style={[styles.cardSubtitleMMKV, { color: theme.textMuted }]}>
          Expo SecureStore: Encrypted Keychain (iOS) & Keystore (Android) for JWT tokens.
        </Text>

        <View style={[styles.section, { borderBottomColor: theme.cardBorder }]}>
          <Text style={[styles.label, { color: theme.text }]}>Sensitive Data (e.g. JWT Token)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.cardBorder }]}
            value={secureInput}
            onChangeText={setSecureInput}
            secureTextEntry={true}
            placeholder="Enter sensitive token..."
            placeholderTextColor={theme.textMuted}
          />
          
          <View style={styles.secureActionsRow}>
            <TouchableOpacity style={[styles.smallButton, { backgroundColor: theme.primary }]} onPress={handleSaveSecure}>
              <Text style={[styles.actionButtonText, { color: theme.background }]}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.smallButton, { backgroundColor: theme.primary }]} onPress={handleLoadSecure}>
              <Text style={[styles.actionButtonText, { color: theme.background }]}>Load</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.smallButton, { backgroundColor: theme.error }]} onPress={handleDeleteSecure}>
              <Text style={[styles.actionButtonText, { color: theme.background }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.text }]}>Secure Storage Readback</Text>
          <Text style={[styles.persistentIndicator, { color: theme.text }]}>
            Value: <Text style={[styles.boldText, { color: theme.primary }]}>{loadedSecureValue}</Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  dashboardCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  cardTitleMMKV: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardSubtitleMMKV: {
    fontSize: 13,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    borderBottomWidth: 1,
    paddingBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    borderWidth: 1,
  },
  persistentIndicator: {
    marginTop: 8,
    fontSize: 13,
  },
  boldText: {
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
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  actionButtonText: {
    fontWeight: '700',
    fontSize: 15,
  },
  resetButton: {
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  resetButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  secureActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  smallButton: {
    flex: 0.3,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
