module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['./jestSetup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-gesture-handler|@shopify/flash-list|react-native-reanimated|expo|expo-image|expo-modules-core|immer|react-redux|@react-navigation|react-native-drawer-layout|react-native-worklets)/)',
  ],
};
