import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getStorage } from '../services/storage';
import { useMMKVString, useMMKVNumber } from 'react-native-mmkv';
import { NewAppScreen } from '@react-native/new-app-screen';

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
};

const Stack = createNativeStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

// --- SCREENS ---

// 1. Home Screen (inside Stack)
function HomeScreen({ navigation }: any) {
  const sampleItems = [
    { id: '1', title: 'React Native CLI', desc: 'Powerful bare workflow giving you full control over native platforms.' },
    { id: '2', title: 'Error Boundaries', desc: 'Gracefully catch rendering exceptions and prevent hard app crashes.' },
    { id: '3', title: 'MMKV Local Cache', desc: 'Lightning-fast, C++ JSI-backed storage for instant local state sync.' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome to NativeApp</Text>
        <Text style={styles.headerSubtitle}>Explore the foundation steps of your roadmap.</Text>
      </View>

      <Text style={styles.sectionLabel}>LEARNING BLOCKS</Text>
      {sampleItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.card}
          onPress={() => navigation.navigate('Details', { itemId: item.id, title: item.title, desc: item.desc })}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.arrowIcon}>➔</Text>
          </View>
          <Text style={styles.cardDesc} numberOfLines={2}>{item.desc}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

// 2. Details Screen (inside Stack)
function DetailsScreen({ route, navigation }: any) {
  const { itemId, title, desc } = route.params;

  return (
    <View style={styles.detailsContainer}>
      <View style={styles.detailCard}>
        <Text style={styles.detailTag}>BLOCK #{itemId}</Text>
        <Text style={styles.detailTitle}>{title}</Text>
        <Text style={styles.detailDesc}>{desc}</Text>
        
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back to List</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Home Stack Group
function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0F172A' },
        headerTintColor: '#F8FAFC',
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: '#0F172A' },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Dashboard' }} />
      <Stack.Screen name="Details" component={DetailsScreen} options={({ route }) => ({ title: route.params?.title })} />
    </Stack.Navigator>
  );
}

// 3. MMKV Persistence Screen (moved to Tab)
function PersistenceScreen() {
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.dashboardCard}>
        <Text style={styles.cardTitle}>⚡ MMKV Local Persistence</Text>
        <Text style={styles.cardSubtitle}>
          Super fast, synchronous key-value storage engine.
        </Text>

        <View style={styles.section}>
          <Text style={styles.label}>Persistent Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setPersistedText}
            placeholder="Type your name here..."
            placeholderTextColor="#64748B"
          />
          <Text style={styles.persistentIndicator}>
            Saved value: <Text style={styles.boldText}>{username ? username : '(none)'}</Text>
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Persistent Counter</Text>
          <View style={styles.counterRow}>
            <Text style={styles.counterValue}>{count}</Text>
            <TouchableOpacity style={styles.actionButton} onPress={handleIncrement}>
              <Text style={styles.actionButtonText}>+ Increment</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={handleClear}>
          <Text style={styles.resetButtonText}>Clear All MMKV Data</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// 4. Profile Tab Screen
function ProfileScreen() {
  const storageInstance = getStorage();
  const [username] = useMMKVString('app.username', storageInstance ?? undefined);
  const [count] = useMMKVNumber('app.counter', storageInstance ?? undefined);

  return (
    <View style={styles.detailsContainer}>
      <View style={styles.detailCard}>
        <Text style={styles.profileAvatar}>👤</Text>
        <Text style={styles.profileName}>{username || 'Guest User'}</Text>
        <Text style={styles.profileRole}>Developer</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{count ?? 0}</Text>
            <Text style={styles.statLabel}>Clicks Saved</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>3</Text>
            <Text style={styles.statLabel}>Completed Pointers</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// Bottom Tabs Navigator Group
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0F172A',
          borderTopWidth: 1,
          borderTopColor: '#1E293B',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#38BDF8',
        tabBarInactiveTintColor: '#64748B',
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

// 5. Settings Screen (Inside Drawer)
function SettingsScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  return (
    <View style={[styles.detailsContainer, { paddingTop: safeAreaInsets.top }]}>
      <View style={styles.detailCard}>
        <Text style={styles.detailTitle}>⚙️ Settings</Text>
        <Text style={styles.detailDesc}>
          Configure your React Native Roadmap app parameters. Additional features will appear here as we advance.
        </Text>
        <View style={styles.settingsItem}>
          <Text style={styles.settingsLabel}>Dark Mode</Text>
          <Text style={styles.settingsValue}>Always On</Text>
        </View>
        <View style={styles.settingsItem}>
          <Text style={styles.settingsLabel}>JS Engine</Text>
          <Text style={styles.settingsValue}>Hermes</Text>
        </View>
      </View>
    </View>
  );
}

// Custom Drawer Menu Content
function CustomDrawerContent(props: any) {
  const safeAreaInsets = useSafeAreaInsets();
  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: '#0F172A' }}>
      <View style={[styles.drawerHeader, { paddingTop: Math.max(safeAreaInsets.top, 20) }]}>
        <Text style={styles.drawerHeaderLogo}>📱 Navigation</Text>
        <Text style={styles.drawerHeaderSubtitle}>Stack, Tabs, & Drawer</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

// Root Drawer Navigator
export function RootNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: '#0F172A', borderBottomWidth: 1, borderBottomColor: '#1E293B' },
        headerTintColor: '#F8FAFC',
        headerTitleStyle: { fontWeight: '700' },
        drawerActiveTintColor: '#38BDF8',
        drawerInactiveTintColor: '#94A3B8',
        drawerStyle: { backgroundColor: '#0F172A', width: 260 },
      }}
    >
      <Drawer.Screen name="MainTabs" component={TabNavigator} options={{ title: 'Main App Flow', drawerLabel: 'Main Application' }} />
      <Drawer.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings Panel', drawerLabel: 'Settings' }} />
    </Drawer.Navigator>
  );
}

// Styles
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#0F172A',
    padding: 16,
  },
  header: {
    marginBottom: 24,
    marginTop: 8,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
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
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
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
    color: '#38BDF8',
  },
  arrowIcon: {
    color: '#38BDF8',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardDesc: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  detailCard: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  detailTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#38BDF8',
    backgroundColor: '#38BDF815',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 16,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 12,
    textAlign: 'center',
  },
  detailDesc: {
    fontSize: 15,
    color: '#94A3B8',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#38BDF8',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '700',
  },
  dashboardCard: {
    padding: 20,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTitleMMKV: {
    fontSize: 20,
    fontWeight: '700',
    color: '#38BDF8',
    marginBottom: 6,
  },
  cardSubtitleMMKV: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E2E8F0',
    marginBottom: 8,
  },
  input: {
    height: 48,
    backgroundColor: '#0F172A',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#F8FAFC',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#334155',
  },
  persistentIndicator: {
    marginTop: 8,
    fontSize: 13,
    color: '#94A3B8',
  },
  boldText: {
    color: '#38BDF8',
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
    color: '#F8FAFC',
  },
  actionButton: {
    backgroundColor: '#38BDF8',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#0F172A',
    fontWeight: '700',
    fontSize: 15,
  },
  resetButton: {
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#EF4444',
    fontWeight: '600',
    fontSize: 14,
  },
  drawerHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    marginBottom: 10,
  },
  drawerHeaderLogo: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  drawerHeaderSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  settingsLabel: {
    fontSize: 15,
    color: '#E2E8F0',
  },
  settingsValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#38BDF8',
  },
  profileAvatar: {
    fontSize: 60,
    marginBottom: 12,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    color: '#38BDF8',
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
    color: '#F8FAFC',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
  },
});
