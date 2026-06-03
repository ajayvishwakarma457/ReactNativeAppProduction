import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useMMKVString, useMMKVNumber } from 'react-native-mmkv';
import { getStorage } from '@app/shared/services/storage';
import { useTheme } from '@app/shared/context/ThemeContext';

export const PersistenceScreen: React.FC = () => {
  const { theme } = useTheme();
  const storageInstance = getStorage();
  const [persistedText, setPersistedText] = useMMKVString('app.username', storageInstance ?? undefined);
  const [persistedCount, setPersistedCount] = useMMKVNumber('app.counter', storageInstance ?? undefined);

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

  return (
    <ScrollView contentContainerStyle={[styles.scrollContainer, { backgroundColor: theme.background }]}>
      <View style={[styles.dashboardCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
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
});
