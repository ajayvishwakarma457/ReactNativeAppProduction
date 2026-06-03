import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { AppText } from './AppText';

export interface AppButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'error' | 'outline';
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  loading = false,
  variant = 'primary',
  style,
  disabled,
  ...props
}) => {
  const { theme } = useTheme();

  const getButtonStyle = () => {
    switch (variant) {
      case 'error':
        return { backgroundColor: theme.error };
      case 'outline':
        return { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.cardBorder };
      default:
        return { backgroundColor: theme.primary };
    }
  };

  const getTextStyle = () => {
    if (variant === 'outline') {
      return { color: theme.primary };
    }
    return { color: theme.background };
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        (disabled || loading) && styles.disabled,
        style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'outline' ? theme.primary : theme.background} />
      ) : (
        <AppText style={[styles.text, getTextStyle()]}>
          {title}
        </AppText>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    width: '100%',
  },
  text: {
    fontWeight: '700',
    fontSize: 15,
  },
  disabled: {
    opacity: 0.6,
  },
});
