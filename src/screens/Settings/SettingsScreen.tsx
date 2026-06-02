import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';

export const SettingsScreen: React.FC = () => {
  const safeAreaInsets = useSafeAreaInsets();
  const { theme, themeMode, setThemeMode } = useTheme();

  return (
    <View style={[styles.detailsContainer, { paddingTop: safeAreaInsets.top, backgroundColor: theme.background }]}>
      <View style={[styles.detailCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <Text style={[styles.detailTitle, { color: theme.text }]}>⚙️ Settings</Text>
        <Text style={[styles.detailDesc, { color: theme.textMuted }]}>
          Configure your React Native Roadmap app parameters and global theme contexts.
        </Text>

        <Text style={[styles.sectionLabel, { alignSelf: 'flex-start', marginBottom: 12 }]}>GLOBAL APP THEME</Text>
        
        <View style={styles.themeSelectorContainer}>
          <TouchableOpacity 
            style={[styles.themeOptionBtn, themeMode === 'light' && [styles.activeThemeBtn, { borderColor: theme.primary }]]} 
            onPress={() => setThemeMode('light')}
          >
            <Text style={[styles.themeOptionText, themeMode === 'light' ? { color: theme.primary, fontWeight: '700' } : { color: theme.textMuted }]}>☀️ Light Mode</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.themeOptionBtn, themeMode === 'dark' && [styles.activeThemeBtn, { borderColor: theme.primary }]]} 
            onPress={() => setThemeMode('dark')}
          >
            <Text style={[styles.themeOptionText, themeMode === 'dark' ? { color: theme.primary, fontWeight: '700' } : { color: theme.textMuted }]}>🌙 Dark Mode</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.settingsItem, { borderBottomColor: theme.cardBorder }]}>
          <Text style={[styles.settingsLabel, { color: theme.text }]}>Dynamic State Context</Text>
          <Text style={[styles.settingsValue, { color: theme.primary }]}>Active</Text>
        </View>
        <View style={[styles.settingsItem, { borderBottomColor: theme.cardBorder }]}>
          <Text style={[styles.settingsLabel, { color: theme.text }]}>JS Engine</Text>
          <Text style={[styles.settingsValue, { color: theme.primary }]}>Hermes</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  detailCard: {
    width: '100%',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    alignItems: 'center',
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  detailDesc: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 1.5,
  },
  themeSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  themeOptionBtn: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  activeThemeBtn: {
    borderWidth: 2,
    backgroundColor: '#38BDF815',
  },
  themeOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingsLabel: {
    fontSize: 15,
  },
  settingsValue: {
    fontSize: 15,
    fontWeight: '600',
  },
});
