# Atomic Design Principles in React Native

This document defines how UI components are classified, structured, and scaled inside our project using **Atomic Design principles** combined with a modular folder architecture.

---

## 1. Classification & Hierarchy

UI components are organized into hierarchical, reusable building blocks:

###  Atoms
The most basic, functional UI blocks. They cannot be broken down further.
* **Location**: `src/shared/components/atoms/`
* **Examples**:
  - `AppText.tsx`: Custom text wrapper enforcing theme-aware typography.
  - `AppButton.tsx`: Theme-aware touchable button supporting action states and activity load indicators.

### 🧪 Molecules
Combinations of two or more Atoms functioning together as a unit.
* **Location**: `src/shared/components/molecules/`
* **Examples**:
  - `FormField.tsx`: Combines `AppText` (label atom), `TextInput` (raw atom), and a second `AppText` (error atom).

### 🦠 Organisms
Complex interface components composed of Molecules and/or Atoms. They handle discrete, functional sections of a page.
* **Location**: `src/features/[feature_name]/components/organisms/`
* **Examples**:
  - `PostCard.tsx`: Integrates images (atom), titles/descriptions (atoms), and bookmark action icons (atoms/molecules).

### 📄 Pages (Screens)
The final realization of the page layouts showing actual runtime data.
* **Location**: `src/features/[feature_name]/screens/`
* **Examples**:
  - `HomeScreen.tsx`: Instantiates the dashboard container and maps posts to `PostCard` organisms.
  - `ProfileScreen.tsx`: Binds forms with `FormField` molecules and `AppButton` action triggers.

---

## 2. Component Code Snippet

### Molecule Example: `FormField.tsx`
This custom molecule encapsulates layout styling and state checks:

```typescript
import React from 'react';
import { View, TextInput, TextInputProps, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { AppText } from '../atoms/AppText';

export interface FormFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ label, error, ...props }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <AppText variant="bold">{label}</AppText>
      <TextInput
        style={[styles.input, { borderColor: error ? theme.error : theme.cardBorder }]}
        {...props}
      />
      {error && <AppText variant="caption" colorType="error">{error}</AppText>}
    </View>
  );
};
```
