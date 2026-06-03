import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export interface AppTextProps extends TextProps {
  variant?: 'body' | 'title' | 'subtitle' | 'caption' | 'bold';
  colorType?: 'text' | 'primary' | 'muted' | 'error';
}

export const AppText: React.FC<AppTextProps> = ({
  children,
  style,
  variant = 'body',
  colorType = 'text',
  ...props
}) => {
  const { theme } = useTheme();

  const getVariantStyle = () => {
    switch (variant) {
      case 'title':
        return styles.title;
      case 'subtitle':
        return styles.subtitle;
      case 'caption':
        return styles.caption;
      case 'bold':
        return styles.bold;
      default:
        return styles.body;
    }
  };

  const getColorStyle = () => {
    switch (colorType) {
      case 'primary':
        return { color: theme.primary };
      case 'muted':
        return { color: theme.textMuted };
      case 'error':
        return { color: theme.error };
      default:
        return { color: theme.text };
    }
  };

  return (
    <Text
      style={[getVariantStyle(), getColorStyle(), style]}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
  },
  bold: {
    fontSize: 15,
    fontWeight: '700',
  },
});
