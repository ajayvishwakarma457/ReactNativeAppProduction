import reducer, {
  increment,
  decrement,
  toggleLikePost,
  resetCounter,
  CounterState,
} from '../src/store/counterSlice';

describe('counterSlice Reducer', () => {
  const initialState: CounterState = {
    value: 0,
    likedPosts: [],
  };

  it('should return initial state when passed undefined', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should increment the counter value', () => {
    const nextState = reducer(initialState, increment());
    expect(nextState.value).toBe(1);
  });

  it('should decrement the counter value', () => {
    const stateWithVal = { value: 2, likedPosts: [] };
    const nextState = reducer(stateWithVal, decrement());
    expect(nextState.value).toBe(1);
  });

  it('should toggle liking a post: add ID and increment value when not liked', () => {
    const nextState = reducer(initialState, toggleLikePost(42));
    expect(nextState.likedPosts).toContain(42);
    expect(nextState.value).toBe(1);
  });

  it('should toggle liking a post: remove ID and decrement value when already liked', () => {
    const stateWithLike = { value: 1, likedPosts: [42] };
    const nextState = reducer(stateWithLike, toggleLikePost(42));
    expect(nextState.likedPosts).not.toContain(42);
    expect(nextState.value).toBe(0);
  });

  it('should reset counter state back to zero values', () => {
    const activeState = { value: 5, likedPosts: [1, 2, 3] };
    const nextState = reducer(activeState, resetCounter());
    expect(nextState.value).toBe(0);
    expect(nextState.likedPosts).toEqual([]);
  });
});
