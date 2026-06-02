import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAppDispatch, useAppSelector } from '../../store';
import { toggleLikePost } from '../../store/counterSlice';

interface DetailsScreenProps {
  route: any;
  navigation: any;
}

export const DetailsScreen: React.FC<DetailsScreenProps> = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { itemId, title, desc } = route.params;
  const dispatch = useAppDispatch();
  const idNumber = parseInt(itemId, 10);
  
  const likedPosts = useAppSelector((state) => state.counter.likedPosts);
  const isLiked = likedPosts.includes(idNumber);

  return (
    <View style={[styles.detailsContainer, { backgroundColor: theme.background }]}>
      <View style={[styles.detailCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <View style={styles.cardHeaderRow}>
          <Text style={[styles.detailTag, { color: theme.primary, backgroundColor: theme.primary + '15' }]}>BLOCK #{itemId}</Text>
          <TouchableOpacity 
            style={{ padding: 6 }} 
            onPress={() => dispatch(toggleLikePost(idNumber))}
          >
            <Text style={{ fontSize: 18, color: isLiked ? '#F59E0B' : theme.textMuted }}>
              {isLiked ? '★ Bookmarked' : '☆ Bookmark'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.detailTitle, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.detailDesc, { color: theme.textMuted }]}>{desc}</Text>
        
        <TouchableOpacity style={[styles.backButton, { backgroundColor: theme.primary }]} onPress={() => navigation.goBack()}>
          <Text style={[styles.backButtonText, { color: theme.background }]}>Go Back to List</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  detailTag: {
    fontSize: 11,
    fontWeight: '800',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
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
});
