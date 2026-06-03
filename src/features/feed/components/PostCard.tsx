import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';

export interface PostCardProps {
  item: any;
  theme: any;
  isLiked: boolean;
  onPress: (item: any) => void;
  onLikePress: (id: number) => void;
}

export const PostCard = React.memo(({ item, theme, isLiked, onPress, onLikePress }: PostCardProps) => {
  const handlePress = () => onPress(item);
  const handleLikePress = (e: any) => {
    e?.stopPropagation?.();
    onLikePress(item.id);
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
      onPress={handlePress}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={{ uri: `https://picsum.photos/id/${((item.id * 7) % 70) + 10}/160/160` }}
          style={styles.cardImage}
          contentFit="cover"
          transition={300}
          cachePolicy="disk"
        />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.primary, flex: 1 }]} numberOfLines={1}>{item.title}</Text>
            <TouchableOpacity 
              style={{ padding: 6, marginLeft: 8 }} 
              onPress={handleLikePress}
            >
              <Text style={{ fontSize: 20, color: isLiked ? '#F59E0B' : theme.textMuted }}>
                {isLiked ? '★' : '☆'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.cardDesc, { color: theme.textMuted }]} numberOfLines={2}>{item.body}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
  },
  cardImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
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
});
