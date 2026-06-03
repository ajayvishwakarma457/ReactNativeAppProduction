import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { PostCard } from '../src/features/feed/components/PostCard';

describe('PostCard Snapshots', () => {
  const mockItem = {
    id: 1,
    title: 'Snapshot Test Title',
    body: 'Snapshot test body content representation.',
  };

  const mockTheme = {
    card: '#FFFFFF',
    cardBorder: '#CCCCCC',
    primary: '#007AFF',
    textMuted: '#8E8E93',
  };

  it('renders PostCard in unliked state correctly', () => {
    let tree: any;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <PostCard
          item={mockItem}
          theme={mockTheme}
          isLiked={false}
          onPress={jest.fn()}
          onLikePress={jest.fn()}
        />
      );
    });
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('renders PostCard in liked state correctly', () => {
    let tree: any;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <PostCard
          item={mockItem}
          theme={mockTheme}
          isLiked={true}
          onPress={jest.fn()}
          onLikePress={jest.fn()}
        />
      );
    });
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
