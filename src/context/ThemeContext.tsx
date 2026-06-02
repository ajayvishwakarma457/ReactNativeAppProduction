import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { getStorage } from '../services/storage';

export interface ThemeColors {
  background: string;
  backgroundAlt: string;
  card: string;
  cardBorder: string;
  text: string;
  textMuted: string;
  primary: string;
  accent: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

export type ThemeMode = 'light' | 'dark';

export interface ThemeContextType {
  theme: ThemeColors;
  themeMode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const lightTheme: ThemeColors = {
  background: '#F8FAFC',
  backgroundAlt: '#F1F5F9',
  card: '#FFFFFF',
  cardBorder: '#E2E8F0',
  text: '#0F172A',
  textMuted: '#64748B',
  primary: '#0EA5E9',
  accent: '#0284C7',
  border: '#CBD5E1',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

const darkTheme: ThemeColors = {
  background: '#0F172A',
  backgroundAlt: '#020617',
  card: '#1E293B',
  cardBorder: '#334155',
  text: '#F8FAFC',
  textMuted: '#94A3B8',
  primary: '#38BDF8',
  accent: '#7DD3FC',
  border: '#334155',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const storageInstance = getStorage();
  
  // Lazy init theme from MMKV or default to system preference
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    if (storageInstance) {
      const savedMode = storageInstance.getString('app.theme_mode');
      if (savedMode === 'light' || savedMode === 'dark') {
        return savedMode;
      }
    }
    return systemScheme === 'dark' ? 'dark' : 'light';
  });

  const toggleTheme = () => {
    const nextMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeModeState(nextMode);
    if (storageInstance) {
      storageInstance.set('app.theme_mode', nextMode);
    }
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    if (storageInstance) {
      storageInstance.set('app.theme_mode', mode);
    }
  };

  const isDark = themeMode === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, themeMode, isDark, toggleTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
