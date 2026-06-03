import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { useTheme } from '@app/shared/context/ThemeContext';
import { useGetPostsQuery } from '../../shared/store/apiSlice';
import { useAppDispatch, useAppSelector, RootState } from '../../shared/store';
import { toggleLikePost } from '../store/counterSlice';
import { PostCard } from '../components/organisms/PostCard';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  
  // RTK Query API Hook call
  const { data: posts, error, isLoading, isFetching, refetch } = useGetPostsQuery(3);
  
  // Redux store selections & dispatch
  const dispatch = useAppDispatch();
  const likedPosts = useAppSelector((state: RootState) => state.counter.likedPosts);
  const likesCount = useAppSelector((state: RootState) => state.counter.value);

  const handlePress = useCallback((item: any) => {
    navigation.navigate('Details', { itemId: item.id.toString(), title: item.title, desc: item.body });
  }, [navigation]);

  const handleLikePress = useCallback((id: number) => {
    dispatch(toggleLikePost(id));
  }, [dispatch]);

  const renderItem = useCallback(({ item }: { item: any }) => {
    const isLiked = likedPosts.includes(item.id);
    return (
      <PostCard
        item={item}
        theme={theme}
        isLiked={isLiked}
        onPress={handlePress}
        onLikePress={handleLikePress}
      />
    );
  }, [theme, likedPosts, handlePress, handleLikePress]);

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Welcome to NativeApp</Text>
            <Text style={[styles.headerSubtitle, { color: theme.textMuted }]}>API Cache & State powered by Redux + RTK Query.</Text>
          </View>
          <View style={{ backgroundColor: theme.primary + '15', borderColor: theme.primary, borderWidth: 1, borderRadius: 12, paddingVertical: 8, paddingHorizontal: 12, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: theme.primary }}>⭐ {likesCount}</Text>
            <Text style={{ fontSize: 9, color: theme.textMuted, marginTop: 2, fontWeight: '700' }}>BOOKMARKS</Text>
          </View>
        </View>
      </View>
      <Text style={styles.sectionLabel}>LATEST LIVE BLOGS (RTK QUERY)</Text>
    </View>
  );

  const renderFooter = () => {
    if (isLoading || error) return null;
    return (
      <TouchableOpacity 
        style={[styles.refreshButton, { backgroundColor: theme.card, borderColor: theme.cardBorder }]} 
        onPress={refetch}
        disabled={isFetching}
      >
        <Text style={[styles.refreshButtonText, { color: theme.primary }]}>
          {isFetching ? '⏳ Updating...' : '🔄 Refresh Cache'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {isLoading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textMuted }]}>Fetching articles...</Text>
        </View>
      )}

      {!isLoading && error && (
        <View style={styles.errorContainer}>
          {renderHeader()}
          <View style={[styles.errorCard, { backgroundColor: theme.error + '15', borderColor: theme.error }]}>
            <Text style={[styles.errorTitle, { color: theme.error }]}>⚠️ Fetching Failed</Text>
            <Text style={[styles.errorDesc, { color: theme.text }]}>
              {('message' in (error as any)) ? (error as any).message : 'Something went wrong.'}
            </Text>
            <TouchableOpacity style={[styles.retryButton, { backgroundColor: theme.error }]} onPress={refetch}>
              <Text style={styles.retryButtonText}>Retry Request</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {!isLoading && !error && (
        React.createElement(FlashList as any, {
          data: posts || [],
          renderItem: renderItem,
          estimatedItemSize: 115,
          ListHeaderComponent: renderHeader,
          ListFooterComponent: renderFooter,
          contentContainerStyle: styles.listContentContainer,
        })
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContentContainer: {
    padding: 16,
  },
  errorContainer: {
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
  centerContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
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
});
