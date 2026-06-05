import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@app/shared/context/ThemeContext';
import { AppText } from '@app/shared/components/atoms/AppText';
import { AppButton } from '@app/shared/components/atoms/AppButton';
import BatteryStatus from '../../shared/specs/NativeBatteryStatus';
import RTNCenteredText from '../../shared/specs/RTNCenteredTextNativeComponent';

export const TurboModuleScreen: React.FC = () => {
  const { theme } = useTheme();
  const [status, setStatus] = useState<{ level: number; isCharging: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = () => {
    setLoading(true);
    try {
      if (BatteryStatus) {
        const res = BatteryStatus.getBatteryStatus();
        setStatus(res);
      }
    } catch (e) {
      console.warn('[TurboModule Error]', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <AppText variant="bold" style={styles.title}>
          ⚡ Turbo Module Spec (New Architecture)
        </AppText>
        <AppText variant="subtitle" style={[styles.subtitle, { color: theme.textMuted }]}>
          This screen demonstrates a custom native module communicating synchronously over the JavaScript Interface (JSI) with type safety via React Native Codegen.
        </AppText>

        {loading ? (
          <ActivityIndicator size="large" color={theme.primary} style={styles.loader} />
        ) : status ? (
          <View style={styles.statusContainer}>
            <View style={styles.row}>
              <AppText variant="bold">Battery Level:</AppText>
              <AppText variant="body" style={{ color: theme.primary, fontWeight: '700' }}>
                {status.level.toFixed(0)}%
              </AppText>
            </View>
            <View style={styles.row}>
              <AppText variant="bold">Charging State:</AppText>
              <AppText variant="body" style={{ color: theme.primary, fontWeight: '700' }}>
                {status.isCharging ? '🔌 Charging' : '🔋 Discharging'}
              </AppText>
            </View>
          </View>
        ) : (
          <AppText variant="body" style={[styles.placeholder, { color: theme.textMuted }]}>
            No battery status retrieved.
          </AppText>
        )}

        <AppButton title="Fetch Battery Status (JSI)" onPress={fetchStatus} />

        <RTNCenteredText
          text="🏎️ Direct draw via C++ Fabric Component!"
          textColor={theme.primary}
          style={styles.fabricComponent}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 24,
  },
  statusContainer: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  placeholder: {
    textAlign: 'center',
    marginBottom: 24,
  },
  loader: {
    marginVertical: 24,
  },
  fabricComponent: {
    width: '100%',
    height: 60,
    marginTop: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#6366F1',
    backgroundColor: 'rgba(99, 102, 241, 0.03)',
  },
});
