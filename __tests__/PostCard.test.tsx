import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PostCard } from '../src/features/feed/components/PostCard';

describe('PostCard Component', () => {
  const mockItem = {
    id: 1,
    title: 'Test Post Title',
    body: 'Test post body description that is longer.',
  };

  const mockTheme = {
    card: '#FFFFFF',
    cardBorder: '#CCCCCC',
    primary: '#007AFF',
    textMuted: '#8E8E93',
  };

  const mockPress = jest.fn();
  const mockLikePress = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders title and body description correctly', () => {
    const { getByText } = render(
      <PostCard
        item={mockItem}
        theme={mockTheme}
        isLiked={false}
        onPress={mockPress}
        onLikePress={mockLikePress}
      />
    );

    expect(getByText('Test Post Title')).toBeTruthy();
    expect(getByText('Test post body description that is longer.')).toBeTruthy();
  });

  it('displays outline star when isLiked is false', () => {
    const { getByText } = render(
      <PostCard
        item={mockItem}
        theme={mockTheme}
        isLiked={false}
        onPress={mockPress}
        onLikePress={mockLikePress}
      />
    );

    expect(getByText('☆')).toBeTruthy();
  });

  it('displays filled star when isLiked is true', () => {
    const { getByText } = render(
      <PostCard
        item={mockItem}
        theme={mockTheme}
        isLiked={true}
        onPress={mockPress}
        onLikePress={mockLikePress}
      />
    );

    expect(getByText('★')).toBeTruthy();
  });

  it('triggers onPress callback when the card container is pressed', () => {
    const { getByText } = render(
      <PostCard
        item={mockItem}
        theme={mockTheme}
        isLiked={false}
        onPress={mockPress}
        onLikePress={mockLikePress}
      />
    );

    fireEvent.press(getByText('Test Post Title'));
    expect(mockPress).toHaveBeenCalledWith(mockItem);
  });

  it('triggers onLikePress callback when the bookmark star is pressed', () => {
    const { getByText } = render(
      <PostCard
        item={mockItem}
        theme={mockTheme}
        isLiked={false}
        onPress={mockPress}
        onLikePress={mockLikePress}
      />
    );

    fireEvent.press(getByText('☆'));
    expect(mockLikePress).toHaveBeenCalledWith(mockItem.id);
  });
});
