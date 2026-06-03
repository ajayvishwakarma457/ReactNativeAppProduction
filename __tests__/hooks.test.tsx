import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { Keyboard, BackHandler } from 'react-native';
import { useToggle } from '../src/shared/hooks/useToggle';
import { useDebounce } from '../src/shared/hooks/useDebounce';
import { useKeyboard } from '../src/shared/hooks/useKeyboard';
import { useBackHandler } from '../src/shared/hooks/useBackHandler';
import { useInterval } from '../src/shared/hooks/useInterval';

// Mock Keyboard and BackHandler if not fully mocked by preset
jest.spyOn(Keyboard, 'addListener');
jest.spyOn(BackHandler, 'addEventListener');

jest.useFakeTimers();

describe('Custom Hooks Library', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('useToggle', () => {
    it('uses the initial value provided', () => {
      const { result } = renderHook(() => useToggle(true));
      expect(result.current[0]).toBe(true);
    });

    it('toggles value from true to false', () => {
      const { result } = renderHook(() => useToggle(true));
      act(() => {
        result.current[1]();
      });
      expect(result.current[0]).toBe(false);
    });

    it('sets the value explicitly using the setter', () => {
      const { result } = renderHook(() => useToggle(false));
      act(() => {
        result.current[2](true);
      });
      expect(result.current[0]).toBe(true);
    });
  });

  describe('useDebounce', () => {
    it('returns the initial value and debounces fast updates', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }: { value: string; delay: number }) => useDebounce(value, delay),
        { initialProps: { value: 'first', delay: 300 } }
      );
      expect(result.current).toBe('first');

      rerender({ value: 'second', delay: 300 });
      expect(result.current).toBe('first'); // still first

      act(() => {
        jest.advanceTimersByTime(300);
      });
      expect(result.current).toBe('second'); // updated
    });
  });

  describe('useKeyboard', () => {
    it('monitors and reports device keyboard show/hide events', () => {
      const { result } = renderHook(() => useKeyboard());
      expect(result.current.isKeyboardVisible).toBe(false);
      expect(result.current.keyboardHeight).toBe(0);

      // Verify Keyboard.addListener calls are registered
      expect(Keyboard.addListener).toHaveBeenCalledWith('keyboardDidShow', expect.any(Function));
      expect(Keyboard.addListener).toHaveBeenCalledWith('keyboardDidHide', expect.any(Function));
    });
  });

  describe('useBackHandler', () => {
    it('registers hardwareBackPress listener on mount', () => {
      const mockHandler = jest.fn();
      renderHook(() => useBackHandler(mockHandler));
      expect(BackHandler.addEventListener).toHaveBeenCalledWith('hardwareBackPress', mockHandler);
    });
  });

  describe('useInterval', () => {
    it('triggers callback cyclically on time tick', () => {
      const mockCallback = jest.fn();
      renderHook(() => useInterval(mockCallback, 100));

      expect(mockCallback).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(100);
      });
      expect(mockCallback).toHaveBeenCalledTimes(1);

      act(() => {
        jest.advanceTimersByTime(200);
      });
      expect(mockCallback).toHaveBeenCalledTimes(3);
    });

    it('does not trigger callback when delay is null', () => {
      const mockCallback = jest.fn();
      renderHook(() => useInterval(mockCallback, null));

      act(() => {
        jest.advanceTimersByTime(500);
      });
      expect(mockCallback).not.toHaveBeenCalled();
    });
  });
});
