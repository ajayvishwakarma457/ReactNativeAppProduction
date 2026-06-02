import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CounterState {
  value: number;
  likedPosts: number[];
}

const initialState: CounterState = {
  value: 0,
  likedPosts: [],
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    toggleLikePost: (state, action: PayloadAction<number>) => {
      const postId = action.payload;
      const index = state.likedPosts.indexOf(postId);
      if (index > -1) {
        state.likedPosts.splice(index, 1);
        state.value = Math.max(0, state.value - 1);
      } else {
        state.likedPosts.push(postId);
        state.value += 1;
      }
    },
    resetCounter: (state) => {
      state.value = 0;
      state.likedPosts = [];
    },
  },
});

export const { increment, decrement, toggleLikePost, resetCounter } = counterSlice.actions;
export default counterSlice.reducer;
