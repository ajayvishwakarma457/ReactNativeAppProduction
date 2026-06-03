import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../src/store/counterSlice';
import { postsApi } from '../src/store/apiSlice';
import * as apiSlice from '../src/store/apiSlice';
import { HomeScreen } from '../src/screens/Home/HomeScreen';
import { ThemeProvider } from '../src/context/ThemeContext';

jest.mock('../src/store/apiSlice', () => {
  const actual = jest.requireActual('../src/store/apiSlice');
  return {
    ...actual,
    useGetPostsQuery: jest.fn(),
  };
});

describe('HomeScreen Integration Flow', () => {
  const mockPosts = [
    { id: 1, title: 'Integration Title 1', body: 'Body description 1' },
    { id: 2, title: 'Integration Title 2', body: 'Body description 2' },
  ];

  let store: any;
  const mockNavigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    store = configureStore({
      reducer: {
        counter: counterReducer,
        [postsApi.reducerPath]: postsApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(postsApi.middleware),
    });

    (apiSlice.useGetPostsQuery as jest.Mock).mockReturnValue({
      data: mockPosts,
      error: null,
      isLoading: false,
      isFetching: false,
      refetch: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders posts from mock api and handles bookmark interaction correctly', () => {
    const { getByText, getAllByText } = render(
      <Provider store={store}>
        <ThemeProvider>
          <HomeScreen navigation={mockNavigation} />
        </ThemeProvider>
      </Provider>
    );

    // Verify both posts render successfully
    expect(getByText('Integration Title 1')).toBeTruthy();
    expect(getByText('Integration Title 2')).toBeTruthy();

    // Verify initial Bookmarks count in header is 0
    expect(getByText('⭐ 0')).toBeTruthy();

    // Click bookmark star on first post (unliked star is ☆)
    const stars = getAllByText('☆');
    fireEvent.press(stars[0]);

    // Verify Bookmark count updates to 1
    expect(getByText('⭐ 1')).toBeTruthy();

    // Click bookmark star on first post again (which is now liked star ★)
    const activeStar = getByText('★');
    fireEvent.press(activeStar);

    // Verify Bookmark count decreases back to 0
    expect(getByText('⭐ 0')).toBeTruthy();
  });

  it('navigates to details screen when a card is pressed', () => {
    const { getByText } = render(
      <Provider store={store}>
        <ThemeProvider>
          <HomeScreen navigation={mockNavigation} />
        </ThemeProvider>
      </Provider>
    );

    // Click first card title
    fireEvent.press(getByText('Integration Title 1'));

    // Verify navigation was triggered with correct parameters
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Details', {
      itemId: '1',
      title: 'Integration Title 1',
      desc: 'Body description 1',
    });
  });
});
