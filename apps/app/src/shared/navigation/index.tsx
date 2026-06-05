import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@app/shared/context/ThemeContext';
import { HomeStackParamList, TabParamList, DrawerParamList } from '@app/shared/types/navigation';

// Import Screens
import { HomeScreen } from '../../feed/screens/HomeScreen';
import { DetailsScreen } from '../../feed/screens/DetailsScreen';
import { PersistenceScreen } from '../../persistence/screens/PersistenceScreen';
import { ProfileScreen } from '../../profile/screens/ProfileScreen';
import { SettingsScreen } from '../../settings/screens/SettingsScreen';
import { HooksPlaygroundScreen } from '../../hooksPlayground/screens/HooksPlaygroundScreen';
import { PermissionsPlaygroundScreen } from '../../permissions/screens/PermissionsPlaygroundScreen';
import { APIsPlaygroundScreen } from '../../apisPlayground/screens/APIsPlaygroundScreen';
import { TurboModuleScreen } from '../../apisPlayground/screens/TurboModuleScreen';
import { CodeReviewRFCsScreen } from '../screens/CodeReviewRFCsScreen';
import { MentoringJuniorDevsScreen } from '../screens/MentoringJuniorDevsScreen';


const Stack = createNativeStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

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
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>📊</Text>,
        }}
      />
      <Tab.Screen
        name="Persistence"
        component={PersistenceScreen}
        options={{
          tabBarLabel: 'Persistence',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>💾</Text>,
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
      <Drawer.Screen name="PermissionsPlayground" component={PermissionsPlaygroundScreen} options={{ title: 'Platform Permissions', drawerLabel: 'Permissions Panel' }} />
      <Drawer.Screen name="APIsPlayground" component={APIsPlaygroundScreen} options={{ title: 'APIs & Networking', drawerLabel: 'APIs Playground' }} />
      <Drawer.Screen name="TurboModulePlayground" component={TurboModuleScreen} options={{ title: 'Turbo Module Spec', drawerLabel: 'Turbo Module' }} />
      <Drawer.Screen name="CodeReviewRFCs" component={CodeReviewRFCsScreen} options={{ title: 'Code Review & RFCs', drawerLabel: 'Code Review & RFCs' }} />
      <Drawer.Screen name="MentoringJuniorDevs" component={MentoringJuniorDevsScreen} options={{ title: 'Mentoring Junior Devs', drawerLabel: 'Mentoring Junior Devs' }} />
    </Drawer.Navigator>


  );
}

const styles = StyleSheet.create({
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
});
