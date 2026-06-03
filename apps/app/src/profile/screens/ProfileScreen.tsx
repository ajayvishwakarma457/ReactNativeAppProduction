import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useMMKVString, useMMKVNumber } from 'react-native-mmkv';
import { getStorage } from '@app/shared/services/storage';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTheme } from '@app/shared/context/ThemeContext';
import { AppText } from '@app/shared/components/atoms/AppText';
import { AppButton } from '@app/shared/components/atoms/AppButton';
import { FormField } from '@app/shared/components/molecules/FormField';

const profileSchema = z.object({
  username: z.string()
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(20, { message: 'Username must be at most 20 characters' })
    .regex(/^[a-zA-Z0-9_]+$/, { message: 'Alphanumeric and underscores only' }),
  email: z.string()
    .email({ message: 'Please enter a valid email address' }),
  age: z.coerce.number({ invalid_type_error: 'Age must be a number' })
    .min(18, { message: 'You must be at least 18 years old' })
    .max(120, { message: 'Invalid age range' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Must contain at least one number' }),
});

export interface ProfileFormValues {
  username: string;
  email: string;
  age: number;
  password: string;
}

export const ProfileScreen: React.FC = () => {
  const { theme } = useTheme();
  const storageInstance = getStorage();
  const [username, setUsername] = useMMKVString('app.username', storageInstance ?? undefined);
  const [count] = useMMKVNumber('app.counter', storageInstance ?? undefined);
  const [isEditing, setIsEditing] = useState(false);

  const { control, handleSubmit, formState: { errors }, reset } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: username || '',
      email: '',
      age: 18,
      password: '',
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    // Save to MMKV persistence
    if (storageInstance) {
      storageInstance.set('app.username', data.username);
    } else {
      setUsername(data.username);
    }
    setIsEditing(false);
    reset({
      username: data.username,
      email: '',
      age: 18,
      password: '',
    });
  };

  return (
    <ScrollView contentContainerStyle={[styles.profileScrollContainer, { backgroundColor: theme.background }]}>
      <View style={[styles.detailCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        {!isEditing ? (
          <View style={styles.profileCenter}>
            <AppText style={styles.profileAvatar}>👤</AppText>
            <AppText variant="title" style={styles.profileName}>{username || 'Guest User'}</AppText>
            <AppText variant="bold" colorType="primary" style={styles.profileRole}>Developer</AppText>

            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <AppText variant="title">{count ?? 0}</AppText>
                <AppText variant="caption" colorType="muted">Clicks Saved</AppText>
              </View>
              <View style={styles.statBox}>
                <AppText variant="title">5</AppText>
                <AppText variant="caption" colorType="muted">Completed Pointers</AppText>
              </View>
            </View>

            <AppButton
              style={{ marginTop: 24 }}
              title="✏️ Edit Profile"
              onPress={() => setIsEditing(true)}
            />
          </View>
        ) : (
          <View style={styles.formContainer}>
            <AppText variant="title" colorType="primary" style={styles.formHeaderTitle}>✏️ Edit Profile</AppText>
            
            {/* Username Input */}
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormField
                  label="Username"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter username"
                  error={errors.username?.message}
                />
              )}
            />

            {/* Email Input */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormField
                  label="Email"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="example@domain.com"
                  error={errors.email?.message}
                />
              )}
            />

            {/* Age Input */}
            <Controller
              control={control}
              name="age"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormField
                  label="Age"
                  onBlur={onBlur}
                  onChangeText={(val) => onChange(val ? parseInt(val, 10) : 0)}
                  value={value ? value.toString() : ''}
                  keyboardType="numeric"
                  placeholder="Enter age (must be >= 18)"
                  error={errors.age?.message}
                />
              )}
            />

            {/* Password Input */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormField
                  label="Password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value || ''}
                  secureTextEntry
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  error={errors.password?.message}
                />
              )}
            />

            <View style={styles.formActionRow}>
              <AppButton
                style={{ flex: 1, marginRight: 10 }}
                variant="outline"
                title="Cancel"
                onPress={() => setIsEditing(false)}
              />
              <AppButton
                style={{ flex: 1, marginLeft: 10 }}
                title="Save Changes"
                onPress={handleSubmit(onSubmit)}
              />
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  profileScrollContainer: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
  },
  detailCard: {
    width: '100%',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    alignItems: 'center',
  },
  profileCenter: {
    alignItems: 'center',
    width: '100%',
  },
  profileAvatar: {
    fontSize: 60,
    marginBottom: 12,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  statBox: {
    alignItems: 'center',
  },
  statNum: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  editProfileButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 24,
    width: '100%',
    alignItems: 'center',
  },
  editProfileButtonText: {
    fontWeight: '700',
    fontSize: 15,
  },
  formContainer: {
    width: '100%',
  },
  formHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  formField: {
    marginBottom: 16,
  },
  formFieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  formInput: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    borderWidth: 1,
  },
  inputErrorBorder: {
    borderColor: '#EF4444',
  },
  formErrorText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  formActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  formActionButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtn: {
    marginRight: 10,
    borderWidth: 1,
  },
  cancelBtnText: {
    fontWeight: '600',
    fontSize: 15,
  },
  saveBtn: {
    marginLeft: 10,
  },
  saveBtnText: {
    fontWeight: '700',
    fontSize: 15,
  },
});
