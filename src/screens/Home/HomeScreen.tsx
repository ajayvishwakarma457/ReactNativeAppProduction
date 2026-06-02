import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '../../context/ThemeContext';
import { useGetPostsQuery } from '../../store/apiSlice';
import { useAppDispatch, useAppSelector } from '../../store';
import { toggleLikePost } from '../../store/counterSlice';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  
  // RTK Query API Hook call
  const { data: posts, error, isLoading, isFetching, refetch } = useGetPostsQuery(3);
  
  // Redux store selections & dispatch
  const dispatch = useAppDispatch();
  const likedPosts = useAppSelector((state) => state.counter.likedPosts);
  const likesCount = useAppSelector((state) => state.counter.value);

  const renderItem = ({ item }: { item: any }) => {
    const isLiked = likedPosts.includes(item.id);
    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
        onPress={() => navigation.navigate('Details', { itemId: item.id.toString(), title: item.title, desc: item.body })}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: theme.primary, flex: 1 }]} numberOfLines={1}>{item.title}</Text>
          <TouchableOpacity 
            style={{ padding: 6, marginLeft: 8 }} 
            onPress={(e) => {
              e.stopPropagation();
              dispatch(toggleLikePost(item.id));
            }}
          >
            <Text style={{ fontSize: 20, color: isLiked ? '#F59E0B' : theme.textMuted }}>
              {isLiked ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.cardDesc, { color: theme.textMuted }]} numberOfLines={2}>{item.body}</Text>
      </TouchableOpacity>
    );
  };

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
  cardDesc: {
    fontSize: 14,
    lineHeight: 20,
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
