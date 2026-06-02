import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Switch } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getStorage } from '../services/storage';
import { useMMKVString, useMMKVNumber } from 'react-native-mmkv';
import { NewAppScreen } from '@react-native/new-app-screen';
import { apiClient } from '../services/api';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTheme } from '../context/ThemeContext';

// Root Navigators Types
export type HomeStackParamList = {
  Home: undefined;
  Details: { itemId: string; title: string; desc: string };
};

export type TabParamList = {
  HomeStack: undefined;
  Persistence: undefined;
  Profile: undefined;
};

export type DrawerParamList = {
  MainTabs: undefined;
  Settings: undefined;
  HooksPlayground: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

// --- SCREENS ---

interface Post {
  id: number;
  title: string;
  body: string;
}

// 1. Home Screen (inside Stack)
function HomeScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<Post[]>('/posts?_limit=3');
      setPosts(response.data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while fetching data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <ScrollView contentContainerStyle={[styles.scrollContainer, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Welcome to NativeApp</Text>
        <Text style={[styles.headerSubtitle, { color: theme.textMuted }]}>Live API Dashboard powered by Axios Client.</Text>
      </View>

      <Text style={styles.sectionLabel}>LATEST LIVE BLOGS (REST API)</Text>

      {isLoading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textMuted }]}>Fetching articles...</Text>
        </View>
      )}

      {!isLoading && error && (
        <View style={[styles.errorCard, { backgroundColor: theme.error + '15', borderColor: theme.error }]}>
          <Text style={[styles.errorTitle, { color: theme.error }]}>⚠️ Fetching Failed</Text>
          <Text style={[styles.errorDesc, { color: theme.text }]}>{error}</Text>
          <TouchableOpacity style={[styles.retryButton, { backgroundColor: theme.error }]} onPress={fetchPosts}>
            <Text style={styles.retryButtonText}>Retry Request</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isLoading && !error && posts.map((post) => (
        <TouchableOpacity
          key={post.id}
          style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
          onPress={() => navigation.navigate('Details', { itemId: post.id.toString(), title: post.title, desc: post.body })}
        >
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.primary }]} numberOfLines={1}>{post.title}</Text>
            <Text style={[styles.arrowIcon, { color: theme.primary }]}>➔</Text>
          </View>
          <Text style={[styles.cardDesc, { color: theme.textMuted }]} numberOfLines={2}>{post.body}</Text>
        </TouchableOpacity>
      ))}

      {!isLoading && !error && (
        <TouchableOpacity style={[styles.refreshButton, { backgroundColor: theme.card, borderColor: theme.cardBorder }]} onPress={fetchPosts}>
          <Text style={[styles.refreshButtonText, { color: theme.primary }]}>🔄 Refresh Feed</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

// 2. Details Screen (inside Stack)
function DetailsScreen({ route, navigation }: any) {
  const { theme } = useTheme();
  const { itemId, title, desc } = route.params;

  return (
    <View style={[styles.detailsContainer, { backgroundColor: theme.background }]}>
      <View style={[styles.detailCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <Text style={[styles.detailTag, { color: theme.primary, backgroundColor: theme.primary + '15' }]}>BLOCK #{itemId}</Text>
        <Text style={[styles.detailTitle, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.detailDesc, { color: theme.textMuted }]}>{desc}</Text>
        
        <TouchableOpacity style={[styles.backButton, { backgroundColor: theme.primary }]} onPress={() => navigation.goBack()}>
          <Text style={[styles.backButtonText, { color: theme.background }]}>Go Back to List</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Home Stack Group
function HomeStackNavigator() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.card },
        headerTintColor: theme.text,
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: theme.background },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Dashboard' }} />
      <Stack.Screen name="Details" component={DetailsScreen} options={({ route }) => ({ title: route.params?.title })} />
    </Stack.Navigator>
  );
}

// 3. MMKV Persistence Screen (moved to Tab)
function PersistenceScreen() {
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
}

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

type ProfileFormValues = z.infer<typeof profileSchema>;

// 4. Profile Tab Screen
function ProfileScreen() {
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
            <Text style={styles.profileAvatar}>👤</Text>
            <Text style={[styles.profileName, { color: theme.text }]}>{username || 'Guest User'}</Text>
            <Text style={[styles.profileRole, { color: theme.primary }]}>Developer</Text>

            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={[styles.statNum, { color: theme.text }]}>{count ?? 0}</Text>
                <Text style={[styles.statLabel, { color: theme.textMuted }]}>Clicks Saved</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statNum, { color: theme.text }]}>5</Text>
                <Text style={[styles.statLabel, { color: theme.textMuted }]}>Completed Pointers</Text>
              </View>
            </View>

            <TouchableOpacity style={[styles.editProfileButton, { backgroundColor: theme.primary }]} onPress={() => setIsEditing(true)}>
              <Text style={[styles.editProfileButtonText, { color: theme.background }]}>✏️ Edit Profile</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <Text style={[styles.formHeaderTitle, { color: theme.primary }]}>✏️ Edit Profile</Text>
            
            {/* Username Input */}
            <View style={styles.formField}>
              <Text style={[styles.formFieldLabel, { color: theme.text }]}>Username</Text>
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.formInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.cardBorder }, errors.username && styles.inputErrorBorder]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Enter username"
                    placeholderTextColor={theme.textMuted}
                  />
                )}
              />
              {errors.username && <Text style={[styles.formErrorText, { color: theme.error }]}>{errors.username.message}</Text>}
            </View>

            {/* Email Input */}
            <View style={styles.formField}>
              <Text style={[styles.formFieldLabel, { color: theme.text }]}>Email</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.formInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.cardBorder }, errors.email && styles.inputErrorBorder]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="example@domain.com"
                    placeholderTextColor={theme.textMuted}
                  />
                )}
              />
              {errors.email && <Text style={[styles.formErrorText, { color: theme.error }]}>{errors.email.message}</Text>}
            </View>

            {/* Age Input */}
            <View style={styles.formField}>
              <Text style={[styles.formFieldLabel, { color: theme.text }]}>Age</Text>
              <Controller
                control={control}
                name="age"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.formInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.cardBorder }, errors.age && styles.inputErrorBorder]}
                    onBlur={onBlur}
                    onChangeText={(val) => onChange(val ? parseInt(val, 10) : '')}
                    value={value ? value.toString() : ''}
                    keyboardType="numeric"
                    placeholder="Enter age (must be >= 18)"
                    placeholderTextColor={theme.textMuted}
                  />
                )}
              />
              {errors.age && <Text style={[styles.formErrorText, { color: theme.error }]}>{errors.age.message}</Text>}
            </View>

            {/* Password Input */}
            <View style={styles.formField}>
              <Text style={[styles.formFieldLabel, { color: theme.text }]}>Password</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.formInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.cardBorder }, errors.password && styles.inputErrorBorder]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry
                    placeholder="Min 8 chars, 1 uppercase, 1 number"
                    placeholderTextColor={theme.textMuted}
                  />
                )}
              />
              {errors.password && <Text style={[styles.formErrorText, { color: theme.error }]}>{errors.password.message}</Text>}
            </View>

            <View style={styles.formActionRow}>
              <TouchableOpacity style={[styles.formActionButton, styles.cancelBtn, { borderColor: theme.textMuted }]} onPress={() => setIsEditing(false)}>
                <Text style={[styles.cancelBtnText, { color: theme.textMuted }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.formActionButton, styles.saveBtn, { backgroundColor: theme.primary }]} onPress={handleSubmit(onSubmit)}>
                <Text style={[styles.saveBtnText, { color: theme.background }]}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// Bottom Tabs Navigator Group
function TabNavigator() {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopWidth: 1,
          borderTopColor: theme.cardBorder,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="Persistence"
        component={PersistenceScreen}
        options={{
          tabBarLabel: 'MMKV Cache',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>⚡</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

// --- Child Component for useCallback Demo ---
const CallbackChild = React.memo(({ onClick, renderCount }: { onClick: () => void; renderCount: number }) => {
  const { theme } = useTheme();
  const childRenders = useRef(0);
  childRenders.current++;
  
  return (
    <View style={[styles.childContainer, { backgroundColor: theme.background, borderColor: theme.cardBorder }]}>
      <Text style={[styles.childTitle, { color: theme.text }]}>Child Component (React.memo)</Text>
      <Text style={[styles.childMeta, { color: theme.textMuted }]}>Render Count: <Text style={[styles.boldText, { color: theme.primary }]}>{childRenders.current}</Text></Text>
      <Text style={[styles.childMeta, { color: theme.textMuted }]}>Trigger Count: <Text style={[styles.boldText, { color: theme.primary }]}>{renderCount}</Text></Text>
      <TouchableOpacity style={[styles.childBtn, { backgroundColor: theme.primary }]} onPress={onClick}>
        <Text style={[styles.childBtnText, { color: theme.background }]}>Trigger Child Callback</Text>
      </TouchableOpacity>
    </View>
  );
});

// Nth Prime calculation function for useMemo Demo
function findNthPrime(n: number): number {
  if (n <= 0) return 0;
  let count = 0;
  let num = 1;
  while (count < n) {
    num++;
    let isPrime = true;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) count++;
  }
  return num;
}

// 4.5. Hooks Playground Screen
function HooksPlaygroundScreen() {
  const { theme } = useTheme();
  // render counter using useRef
  const parentRenders = useRef(0);
  parentRenders.current++;

  // 1. useEffect Timer State
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (timerActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timerActive]);

  // 2. useCallback States
  const [useMemoizedCallback, setUseMemoizedCallback] = useState(true);
  const [callbackCount, setCallbackCount] = useState(0);
  const [dummyState, setDummyState] = useState(0); // unrelated state to force parent render

  const incrementChild = useCallback(() => {
    setCallbackCount((prev) => prev + 1);
  }, []);

  const incrementChildUnmemoized = () => {
    setCallbackCount((prev) => prev + 1);
  };

  // 3. useMemo States
  const [useMemoizedCalculation, setUseMemoizedCalculation] = useState(true);
  const [primeIndex, setPrimeIndex] = useState(1500); // 1500th prime
  const [unrelatedInput, setUnrelatedInput] = useState('');

  const primeResult = useMemo(() => {
    return findNthPrime(primeIndex);
  }, [primeIndex]);

  // Execute directly during render if unmemoized
  const primeResultUnmemoized = useMemoizedCalculation ? 0 : findNthPrime(primeIndex);

  const finalPrimeResult = useMemoizedCalculation ? primeResult : primeResultUnmemoized;

  // 4. useRef States
  const inputRef = useRef<TextInput>(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <ScrollView contentContainerStyle={[styles.playgroundScrollContainer, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Hooks Playground</Text>
        <Text style={[styles.headerSubtitle, { color: theme.textMuted }]}>
          Visualizing React lifecycle, memoization, and references.
        </Text>
        <Text style={[styles.parentRenderCounter, { color: theme.textMuted }]}>
          Parent component renders: <Text style={[styles.boldText, { color: theme.primary }]}>{parentRenders.current}</Text>
        </Text>
      </View>

      {/* 1. useEffect Card */}
      <View style={[styles.playgroundCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <Text style={[styles.cardTitlePlayground, { color: theme.primary }]}>⏱️ useEffect (Stopwatch)</Text>
        <Text style={[styles.cardDescPlayground, { color: theme.textMuted }]}>
          Sets up an interval timer when active, and cleans it up using the return function on pause/unmount.
        </Text>
        <View style={styles.timerContainer}>
          <Text style={[styles.timerText, { color: theme.text }]}>{seconds}s</Text>
          <View style={styles.timerActions}>
            <TouchableOpacity 
              style={[styles.timerBtn, timerActive ? styles.pauseBtn : styles.startBtn]} 
              onPress={() => setTimerActive(!timerActive)}
            >
              <Text style={styles.timerBtnText}>{timerActive ? 'Pause' : 'Start'}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.timerBtn, styles.resetBtnPlayground]} 
              onPress={() => { setTimerActive(false); setSeconds(0); }}
            >
              <Text style={styles.timerBtnText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 2. useCallback Card */}
      <View style={[styles.playgroundCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <Text style={[styles.cardTitlePlayground, { color: theme.primary }]}>🎯 useCallback (Optimization)</Text>
        <Text style={[styles.cardDescPlayground, { color: theme.textMuted }]}>
          When disabled, updating parent state re-creates the click handler, forcing the memoized child component to re-render.
        </Text>
        
        <View style={[styles.toggleRow, { backgroundColor: theme.background }]}>
          <Text style={[styles.toggleLabel, { color: theme.text }]}>Memoize callback with useCallback</Text>
          <Switch 
            value={useMemoizedCallback} 
            onValueChange={setUseMemoizedCallback} 
            thumbColor={theme.primary}
            trackColor={{ false: theme.border, true: theme.backgroundAlt }}
          />
        </View>

        <TouchableOpacity 
          style={[styles.parentBtn, { borderColor: theme.cardBorder }]} 
          onPress={() => setDummyState((prev) => prev + 1)}
        >
          <Text style={[styles.parentBtnText, { color: theme.primary }]}>Re-render Parent (State: {dummyState})</Text>
        </TouchableOpacity>

        <CallbackChild 
          onClick={useMemoizedCallback ? incrementChild : incrementChildUnmemoized} 
          renderCount={callbackCount} 
        />
      </View>

      {/* 3. useMemo Card */}
      <View style={[styles.playgroundCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <Text style={[styles.cardTitlePlayground, { color: theme.primary }]}>🧮 useMemo (Compute Caching)</Text>
        <Text style={[styles.cardDescPlayground, { color: theme.textMuted }]}>
          Calculates the {primeIndex}th prime number. Try typing in the unrelated input. If useMemo is disabled, typing will lag because it recalculates on every render.
        </Text>
        
        <View style={[styles.toggleRow, { backgroundColor: theme.background }]}>
          <Text style={[styles.toggleLabel, { color: theme.text }]}>Memoize computation with useMemo</Text>
          <Switch 
            value={useMemoizedCalculation} 
            onValueChange={setUseMemoizedCalculation} 
            thumbColor={theme.primary}
            trackColor={{ false: theme.border, true: theme.backgroundAlt }}
          />
        </View>

        <View style={styles.calcRow}>
          <Text style={[styles.calcLabel, { color: theme.text }]}>Nth Prime Index:</Text>
          <TextInput 
            style={[styles.calcInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.cardBorder }]}
            value={primeIndex.toString()}
            keyboardType="numeric"
            onChangeText={(val) => setPrimeIndex(val ? Math.min(parseInt(val, 10), 3000) : 0)}
          />
        </View>

        <Text style={[styles.resultText, { color: theme.text }]}>Result: <Text style={[styles.boldText, { color: theme.primary }]}>{finalPrimeResult}</Text></Text>

        <TextInput
          style={[styles.formInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.cardBorder }]}
          value={unrelatedInput}
          onChangeText={setUnrelatedInput}
          placeholder="Type here to test render lag..."
          placeholderTextColor={theme.textMuted}
        />
      </View>

      {/* 4. useRef Card */}
      <View style={[styles.playgroundCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <Text style={[styles.cardTitlePlayground, { color: theme.primary }]}>🔗 useRef (Refs & Mutation)</Text>
        <Text style={[styles.cardDescPlayground, { color: theme.textMuted }]}>
          Maintains a reference to the TextInput component to focus it programmatically.
        </Text>
        
        <TextInput 
          ref={inputRef}
          style={[styles.formInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.cardBorder }]}
          placeholder="I will be focused programmatically..."
          placeholderTextColor={theme.textMuted}
        />

        <TouchableOpacity style={[styles.refBtn, { backgroundColor: theme.primary }]} onPress={focusInput}>
          <Text style={[styles.refBtnText, { color: theme.background }]}>Focus Input Field</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// 5. Settings Screen (Inside Drawer)
function SettingsScreen() {
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
}

// Custom Drawer Menu Content
function CustomDrawerContent(props: any) {
  const safeAreaInsets = useSafeAreaInsets();
  const { theme } = useTheme();
  
  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: theme.background }}>
      <View style={[styles.drawerHeader, { paddingTop: Math.max(safeAreaInsets.top, 20), borderBottomColor: theme.cardBorder }]}>
        <Text style={[styles.drawerHeaderLogo, { color: theme.text }]}>📱 Navigation</Text>
        <Text style={[styles.drawerHeaderSubtitle, { color: theme.textMuted }]}>Context, Stack, Tabs & Drawer</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

// Root Drawer Navigator
export function RootNavigator() {
  const { theme } = useTheme();
  
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: theme.card, borderBottomWidth: 1, borderBottomColor: theme.cardBorder },
        headerTintColor: theme.text,
        headerTitleStyle: { fontWeight: '700' },
        drawerActiveTintColor: theme.primary,
        drawerInactiveTintColor: theme.textMuted,
        drawerStyle: { backgroundColor: theme.background, width: 260 },
      }}
    >
      <Drawer.Screen name="MainTabs" component={TabNavigator} options={{ title: 'Main App Flow', drawerLabel: 'Main Application' }} />
      <Drawer.Screen name="HooksPlayground" component={HooksPlaygroundScreen} options={{ title: 'Hooks in Depth', drawerLabel: 'Hooks Playground' }} />
      <Drawer.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings Panel', drawerLabel: 'Settings' }} />
    </Drawer.Navigator>
  );
}

// Styles
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
    marginTop: 8,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  card: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  arrowIcon: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
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
  detailTag: {
    fontSize: 11,
    fontWeight: '800',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 16,
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
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '700',
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
  drawerHeader: {
    padding: 16,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  drawerHeaderLogo: {
    fontSize: 22,
    fontWeight: '800',
  },
  drawerHeaderSubtitle: {
    fontSize: 12,
    marginTop: 4,
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
  centerContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  errorCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  errorDesc: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  refreshButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  refreshButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  profileScrollContainer: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
  },
  profileCenter: {
    alignItems: 'center',
    width: '100%',
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
  playgroundScrollContainer: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 40,
  },
  parentRenderCounter: {
    fontSize: 13,
    marginTop: 6,
  },
  playgroundCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
  },
  cardTitlePlayground: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardDescPlayground: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  timerContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  timerText: {
    fontSize: 48,
    fontWeight: '800',
    marginBottom: 16,
  },
  timerActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  timerBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  startBtn: {
    backgroundColor: '#10B981',
  },
  pauseBtn: {
    backgroundColor: '#F59E0B',
  },
  resetBtnPlayground: {
    backgroundColor: '#64748B',
  },
  timerBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  parentBtn: {
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  parentBtnText: {
    fontWeight: '600',
    fontSize: 14,
  },
  childContainer: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginTop: 10,
  },
  childTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  childMeta: {
    fontSize: 13,
    marginBottom: 4,
  },
  childBtn: {
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  childBtnText: {
    fontWeight: '700',
    fontSize: 13,
  },
  calcRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  calcLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 10,
  },
  calcInput: {
    flex: 1,
    height: 40,
    borderRadius: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
  },
  resultText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  refBtn: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  refBtnText: {
    fontWeight: '700',
    fontSize: 15,
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
});
