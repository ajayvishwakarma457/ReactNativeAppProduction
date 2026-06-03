/* eslint-env jest */
import 'react-native-gesture-handler/jestSetup';

// Mock Reanimated
jest.mock('react-native-reanimated', () => {
  const RN = require('react-native');
  return {
    default: {
      call: () => {},
    },
    useSharedValue: (val) => ({ value: val }),
    useAnimatedStyle: (fn) => ({}),
    useAnimatedGestureHandler: (handlers) => ({}),
    useDerivedValue: (fn) => ({ value: fn() }),
    withTiming: (toValue, config, cb) => toValue,
    withSpring: (toValue, config, cb) => toValue,
    withDecay: (config, cb) => 0,
    cancelAnimation: () => {},
    measure: () => ({ x: 0, y: 0, width: 0, height: 0, pageX: 0, pageY: 0 }),
    Easing: {
      linear: (x) => x,
      ease: (x) => x,
      quad: (x) => x,
      cubic: (x) => x,
      poly: (n) => (x) => x,
      sin: (x) => x,
      circle: (x) => x,
      exp: (x) => x,
      elastic: (bounciness) => (x) => x,
      back: (s) => (x) => x,
      bounce: (x) => x,
      bezier: (x1, y1, x2, y2) => ({ factory: () => (x) => x }),
      in: (easing) => easing,
      out: (easing) => easing,
      inOut: (easing) => easing,
    },
    View: RN.View,
    Text: RN.Text,
    Image: RN.Image,
    ScrollView: RN.ScrollView,
  };
});

// Mock MMKV storage engine
jest.mock('react-native-mmkv', () => {
  return {
    MMKV: jest.fn().mockImplementation(() => {
      const storage = new Map();
      return {
        set: jest.fn((key, value) => {
          storage.set(key, value);
        }),
        getString: jest.fn((key) => {
          return storage.get(key);
        }),
        getNumber: jest.fn((key) => {
          return storage.get(key);
        }),
        getBoolean: jest.fn((key) => {
          return storage.get(key);
        }),
        delete: jest.fn((key) => {
          storage.delete(key);
        }),
        clearAll: jest.fn(() => {
          storage.clear();
        }),
      };
    }),
  };
});

// Mock Firebase app initialized check
jest.mock('@react-native-firebase/app', () => {
  return {
    apps: {
      length: 1,
    },
    initializeApp: jest.fn(),
  };
});

// Mock Firebase Cloud Messaging
jest.mock('@react-native-firebase/messaging', () => {
  const messaging = () => ({
    setBackgroundMessageHandler: jest.fn(),
    getToken: jest.fn(() => Promise.resolve('mock-fcm-token')),
    onMessage: jest.fn(),
  });
  return messaging;
});

// Mock expo-image component to render a simple View
jest.mock('expo-image', () => {
  const { View } = require('react-native');
  return {
    Image: View,
  };
});

// Mock react-native-worklets
const { NativeModules } = require('react-native');
NativeModules.Worklets = {
  loadUnpackers: jest.fn(),
};
jest.mock('react-native-worklets', () => {
  return {
    createSerializable: (val) => val,
    createShareable: (val) => val,
    createWorklet: (val) => val,
    Worklets: {
      createRunOnJS: (fn) => fn,
      createRunOnUI: (fn) => fn,
      __setUnpacker: jest.fn(),
    },
  };
});

// Mock react-native-permissions
jest.mock('react-native-permissions', () => {
  return require('react-native-permissions/mock');
});

// Mock local services
jest.mock('./src/services/notifications', () => {
  return {
    notificationsService: {
      requestUserPermission: jest.fn(() => Promise.resolve(true)),
      getFCMToken: jest.fn(() => Promise.resolve('mock-token')),
      initializeListeners: jest.fn(() => () => {}),
    },
  };
});

jest.mock('./src/services/backgroundTasks', () => {
  return {
    backgroundTasksService: {
      executeBackgroundSync: jest.fn(),
      getSyncStatus: jest.fn(() => ({ lastSyncTime: 'never' })),
    },
  };
});
