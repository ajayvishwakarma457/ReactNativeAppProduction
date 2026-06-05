import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@app/shared/context/ThemeContext';
import { AppText } from '@app/shared/components/atoms/AppText';

export const PerformanceBudgetsScreen: React.FC = () => {
  const safeAreaInsets = useSafeAreaInsets();
  const { theme } = useTheme();

  // SDK Simulator logs states
  const [telemetryLog, setTelemetryLog] = useState<string>('Idle. Waiting for events...');
  const [loadingAction, setLoadingAction] = useState<'sentry' | 'datadog' | null>(null);

  // Trigger Sentry Exception Simulation
  const simulateSentryCrash = () => {
    setLoadingAction('sentry');
    setTelemetryLog('Simulating handled exception...');
    setTimeout(() => {
      try {
        // Mock error generation
        throw new TypeError("Null Pointer: Cannot read property 'displayName' of undefined");
      } catch (err: any) {
        setTelemetryLog(`[Sentry SDK] Captured exception: "${err.message}". Event successfully dispatched to ingestion cluster.`);
      } finally {
        setLoadingAction(null);
      }
    }, 1200);
  };

  // Trigger Datadog RUM Trace Simulation
  const simulateDatadogTrace = () => {
    setLoadingAction('datadog');
    setTelemetryLog('Tracing mock GET /api/v1/feed request...');
    setTimeout(() => {
      const latency = Math.floor(Math.random() * 200) + 80; // Mock latency 80-280ms
      setTelemetryLog(`[Datadog RUM] Traced API request: GET /api/v1/feed. Latency: ${latency}ms. Trace ID: tr-${Math.random().toString(36).substr(2, 9)} dispatched.`);
      setLoadingAction(null);
    }, 1000);
  };

  // Helper to render metric budget progress bar
  const renderMetricBudget = (
    label: string,
    currentValue: string,
    limit: string,
    percentage: number,
    status: 'good' | 'warning' | 'danger'
  ) => {
    const statusColor = status === 'good' ? '#10B981' : status === 'warning' ? '#F59E0B' : '#EF4444';
    return (
      <View style={[styles.metricContainer, { borderBottomColor: theme.cardBorder }]}>
        <View style={styles.metricRow}>
          <AppText variant="bold" style={{ color: theme.text }}>{label}</AppText>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <AppText variant="bold" style={{ color: statusColor }}>{currentValue}</AppText>
            <AppText variant="caption" style={{ color: theme.textMuted }}> / {limit}</AppText>
          </View>
        </View>
        <View style={[styles.progressBarBg, { backgroundColor: theme.cardBorder }]}>
          <View style={[styles.progressBarFill, { width: `${Math.min(percentage, 100)}%`, backgroundColor: statusColor }]} />
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ paddingTop: 16, paddingBottom: safeAreaInsets.bottom + 32, paddingHorizontal: 16 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <AppText variant="bold" style={[styles.title, { color: theme.text }]}>
          ⚡ Telemetry & Budgets
        </AppText>
        <AppText variant="subtitle" style={[styles.subtitle, { color: theme.textMuted }]}>
          Monitor mobile thread execution targets, heap limits, and trigger telemetry simulation scripts.
        </AppText>
      </View>

      {/* Gauges & Budgets */}
      <View style={styles.section}>
        <AppText variant="bold" style={[styles.sectionTitle, { color: theme.primary }]}>
          📊 Production Performance Budgets
        </AppText>
        <AppText variant="body" style={[styles.sectionDesc, { color: theme.textMuted }]}>
          Real-time and static budget indicators based on workspace optimization targets.
        </AppText>

        <View style={[styles.budgetsCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          {renderMetricBudget('UI Thread Framerate', '59.2 FPS', '> 58 FPS', 98, 'good')}
          {renderMetricBudget('JS Thread Framerate', '57.8 FPS', '> 55 FPS', 96, 'good')}
          {renderMetricBudget('Hermes JS Heap', '32.4 MB', '< 40 MB', 81, 'good')}
          {renderMetricBudget('App Initial Startup', '2.4s', '< 2.0s', 82, 'warning')}
          {renderMetricBudget('Compressed OTA Bundle', '10.8 MB', '< 8.0 MB', 90, 'danger')}
        </View>
      </View>

      {/* Telemetry Simulator */}
      <View style={styles.section}>
        <AppText variant="bold" style={[styles.sectionTitle, { color: theme.primary }]}>
          🚀 Telemetry Event Simulator
        </AppText>
        <AppText variant="body" style={[styles.sectionDesc, { color: theme.textMuted }]}>
          Test platform integrations by dispatching simulated traces to Sentry and Datadog channels.
        </AppText>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.simBtn, { backgroundColor: '#E11D48' }, loadingAction === 'sentry' && { opacity: 0.7 }]}
            onPress={simulateSentryCrash}
            disabled={loadingAction !== null}
            activeOpacity={0.8}
          >
            {loadingAction === 'sentry' ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <AppText variant="bold" style={styles.btnText}>🎯 Sentry Crash</AppText>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.simBtn, { backgroundColor: '#632CA6' }, loadingAction === 'datadog' && { opacity: 0.7 }]}
            onPress={simulateDatadogTrace}
            disabled={loadingAction !== null}
            activeOpacity={0.8}
          >
            {loadingAction === 'datadog' ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <AppText variant="bold" style={styles.btnText}>📊 Datadog RUM</AppText>
            )}
          </TouchableOpacity>
        </View>

        {/* Live log feedback */}
        <View style={[styles.terminal, { backgroundColor: '#0F172A', borderColor: theme.cardBorder }]}>
          <View style={styles.terminalHeader}>
            <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
            <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
            <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.terminalTitle}>telemetry-session-logger</Text>
          </View>
          <Text style={styles.terminalText}>{telemetryLog}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 13,
    marginBottom: 16,
  },
  budgetsCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
  },
  metricContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  simBtn: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  terminal: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  terminalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  terminalTitle: {
    color: '#64748B',
    fontSize: 11,
    fontFamily: 'Courier',
    marginLeft: 6,
  },
  terminalText: {
    color: '#38BDF8',
    fontFamily: 'Courier',
    fontSize: 12,
    lineHeight: 18,
  },
});
