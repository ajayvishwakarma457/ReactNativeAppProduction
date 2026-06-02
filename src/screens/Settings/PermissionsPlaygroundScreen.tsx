import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { 
  check, 
  request, 
  PERMISSIONS, 
  RESULTS, 
  checkNotifications, 
  requestNotifications,
  PermissionStatus
} from 'react-native-permissions';
import { useTheme } from '../../context/ThemeContext';

interface PermissionRowProps {
  title: string;
  description: string;
  status: PermissionStatus | 'loading';
  onRequest: () => void;
  icon: string;
}

const PermissionRow: React.FC<PermissionRowProps> = ({ title, description, status, onRequest, icon }) => {
  const { theme } = useTheme();

  const getStatusDetails = () => {
    switch (status) {
      case 'loading':
        return { text: 'Checking...', color: theme.textMuted, bg: theme.cardBorder };
      case RESULTS.GRANTED:
        return { text: 'Granted', color: '#10B981', bg: '#10B98115' };
      case RESULTS.DENIED:
        return { text: 'Denied', color: '#F59E0B', bg: '#F59E0B15' };
      case RESULTS.BLOCKED:
        return { text: 'Blocked', color: '#EF4444', bg: '#EF444415' };
      case RESULTS.UNAVAILABLE:
        return { text: 'Unavailable', color: theme.textMuted, bg: theme.cardBorder };
      default:
        return { text: 'Unknown', color: theme.textMuted, bg: theme.cardBorder };
    }
  };

  const badge = getStatusDetails();

  return (
    <View style={[styles.permissionCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      <View style={styles.cardHeader}>
        <View style={styles.titleCol}>
          <Text style={{ fontSize: 24, marginRight: 10 }}>{icon}</Text>
          <View>
            <Text style={[styles.permissionTitle, { color: theme.text }]}>{title}</Text>
            <Text style={[styles.permissionDesc, { color: theme.textMuted }]}>{description}</Text>
          </View>
        </View>
        <View style={[styles.badge, { backgroundColor: badge.bg }]}>
          <Text style={[styles.badgeText, { color: badge.color }]}>{badge.text}</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.requestBtn, { backgroundColor: theme.primary }]} 
        onPress={onRequest}
        disabled={status === 'loading' || status === RESULTS.GRANTED || status === RESULTS.UNAVAILABLE}
      >
        <Text style={[styles.requestBtnText, { color: theme.background }]}>
          {status === RESULTS.GRANTED ? 'Access Active' : 'Request Permission'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export const PermissionsPlaygroundScreen: React.FC = () => {
  const { theme } = useTheme();
  const [cameraStatus, setCameraStatus] = useState<PermissionStatus | 'loading'>('loading');
  const [locationStatus, setLocationStatus] = useState<PermissionStatus | 'loading'>('loading');
  const [notificationStatus, setNotificationStatus] = useState<PermissionStatus | 'loading'>('loading');

  const getTargetPermissions = () => {
    const camera = Platform.select({
      ios: PERMISSIONS.IOS.CAMERA,
      android: PERMISSIONS.ANDROID.CAMERA,
    })!;

    const location = Platform.select({
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    })!;

    return { camera, location };
  };

  const checkAllPermissions = async () => {
    const targets = getTargetPermissions();

    try {
      const cam = await check(targets.camera);
      setCameraStatus(cam);

      const loc = await check(targets.location);
      setLocationStatus(loc);

      const notif = await checkNotifications();
      setNotificationStatus(notif.status);
    } catch (error) {
      console.warn('[Permissions Check Error]', error);
    }
  };

  useEffect(() => {
    checkAllPermissions();
  }, []);

  const handleRequestCamera = async () => {
    const targets = getTargetPermissions();
    try {
      const res = await request(targets.camera);
      setCameraStatus(res);
    } catch (error) {
      console.warn('[Camera Request Error]', error);
    }
  };

  const handleRequestLocation = async () => {
    const targets = getTargetPermissions();
    try {
      const res = await request(targets.location);
      setLocationStatus(res);
    } catch (error) {
      console.warn('[Location Request Error]', error);
    }
  };

  const handleRequestNotifications = async () => {
    try {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const res = await request('android.permission.POST_NOTIFICATIONS' as any);
        setNotificationStatus(res);
      } else {
        const res = await requestNotifications(['alert', 'sound', 'badge']);
        setNotificationStatus(res.status);
      }
    } catch (error) {
      console.warn('[Notifications Request Error]', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Platform Permissions</Text>
        <Text style={[styles.headerSubtitle, { color: theme.textMuted }]}>
          Monitor and request native system resources access dynamically.
        </Text>
      </View>

      <PermissionRow
        title="Camera Access"
        description="Allows taking pictures and video captures in roadmap exercises."
        status={cameraStatus}
        onRequest={handleRequestCamera}
        icon="📷"
      />

      <PermissionRow
        title="Location Services"
        description="Provides position accuracy coordinates during map updates."
        status={locationStatus}
        onRequest={handleRequestLocation}
        icon="📍"
      />

      <PermissionRow
        title="Local Notifications"
        description="Sends updates, push messages, and system alerts to notification tray."
        status={notificationStatus}
        onRequest={handleRequestNotifications}
        icon="🔔"
      />

      <TouchableOpacity 
        style={[styles.checkBtn, { borderColor: theme.cardBorder }]} 
        onPress={checkAllPermissions}
      >
        <Text style={[styles.checkBtnText, { color: theme.primary }]}>🔄 Re-check Current Statuses</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
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
  permissionCard: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  permissionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  permissionDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  requestBtn: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  requestBtnText: {
    fontWeight: '700',
    fontSize: 14,
  },
  checkBtn: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  checkBtnText: {
    fontWeight: '600',
    fontSize: 14,
  },
});
