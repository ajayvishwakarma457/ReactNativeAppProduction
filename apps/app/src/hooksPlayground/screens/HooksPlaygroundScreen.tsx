import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { useTheme } from '@app/shared/context/ThemeContext';
import { useToggle } from '@app/shared/hooks/useToggle';
import { useInterval } from '@app/shared/hooks/useInterval';

interface CallbackChildProps {
  onClick: () => void;
  renderCount: number;
}

// --- Child Component for useCallback Demo ---
const CallbackChild = React.memo(({ onClick, renderCount }: CallbackChildProps) => {
  const { theme } = useTheme();
  const childRenders = useRef(0);
  childRenders.current++;
  
  return (
    <View style={[styles.childContainer, { backgroundColor: theme.background, borderColor: theme.cardBorder }]}>
      <Text style={[styles.childTitle, { color: theme.text }]}>Child Component (React.memo)</Text>
      <Text style={[styles.childMeta, { color: theme.textMuted }]}>Render Count: <Text style={[styles.boldText, { color: theme.primary }]}>{childRenders.current}</Text></Text>
      <Text style={[styles.childMeta, { color: theme.textMuted }]}>Trigger Count: <Text style={[styles.boldText, { color: theme.primary }]}>{renderCount}</Text></Text>
      <TouchableOpacity style={[styles.childBtn, { backgroundColor: theme.primary }]} onPress={onClick}>
        <Text style={[styles.childBtnText, { color: theme.background }]}>Trigger Child Callback</Text>
      </TouchableOpacity>
    </View>
  );
});

// Nth Prime calculation function for useMemo Demo
function findNthPrime(n: number): number {
  if (n <= 0) return 0;
  let count = 0;
  let num = 1;
  while (count < n) {
    num++;
    let isPrime = true;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) count++;
  }
  return num;
}

export const HooksPlaygroundScreen: React.FC = () => {
  const { theme } = useTheme();
  // render counter using useRef
  const parentRenders = useRef(0);
  parentRenders.current++;

  // 1. useInterval Timer State
  const [seconds, setSeconds] = useState(0);
  const [timerActive, toggleTimerActive, setTimerActive] = useToggle(false);

  useInterval(() => {
    setSeconds((prev) => prev + 1);
  }, timerActive ? 1000 : null);

  // 2. useCallback States
  const [useMemoizedCallback, toggleMemoizedCallback] = useToggle(true);
  const [callbackCount, setCallbackCount] = useState(0);
  const [dummyState, setDummyState] = useState(0); // unrelated state to force parent render

  const incrementChild = useCallback(() => {
    setCallbackCount((prev) => prev + 1);
  }, []);

  const incrementChildUnmemoized = () => {
    setCallbackCount((prev) => prev + 1);
  };

  // 3. useMemo States
  const [useMemoizedCalculation, toggleMemoizedCalculation] = useToggle(true);
  const [primeIndex, setPrimeIndex] = useState(1500); // 1500th prime
  const [unrelatedInput, setUnrelatedInput] = useState('');

  const primeResult = useMemo(() => {
    return findNthPrime(primeIndex);
  }, [primeIndex]);

  // Execute directly during render if unmemoized
  const primeResultUnmemoized = useMemoizedCalculation ? 0 : findNthPrime(primeIndex);

  const finalPrimeResult = useMemoizedCalculation ? primeResult : primeResultUnmemoized;

  // 4. useRef States
  const inputRef = useRef<TextInput>(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  // 5. Reanimated Scale Shared Value
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.9);
    opacity.value = withTiming(0.8, { duration: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    opacity.value = withTiming(1, { duration: 150 });
  };

  return (
    <ScrollView contentContainerStyle={[styles.playgroundScrollContainer, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Hooks Playground</Text>
        <Text style={[styles.headerSubtitle, { color: theme.textMuted }]}>
          Visualizing React lifecycle, memoization, and references.
        </Text>
        <Text style={[styles.parentRenderCounter, { color: theme.textMuted }]}>
          Parent component renders: <Text style={[styles.boldText, { color: theme.primary }]}>{parentRenders.current}</Text>
        </Text>
      </View>

      {/* 1. useEffect Card */}
      <View style={[styles.playgroundCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <Text style={[styles.cardTitlePlayground, { color: theme.primary }]}>⏱️ useEffect (Stopwatch)</Text>
        <Text style={[styles.cardDescPlayground, { color: theme.textMuted }]}>
          Sets up an interval timer when active, and cleans it up using the return function on pause/unmount.
        </Text>
        <View style={styles.timerContainer}>
          <Text style={[styles.timerText, { color: theme.text }]}>{seconds}s</Text>
          <View style={styles.timerActions}>
            <TouchableOpacity 
              style={[styles.timerBtn, timerActive ? styles.pauseBtn : styles.startBtn]} 
              onPress={toggleTimerActive}
            >
              <Text style={styles.timerBtnText}>{timerActive ? 'Pause' : 'Start'}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.timerBtn, styles.resetBtnPlayground]} 
              onPress={() => { setTimerActive(false); setSeconds(0); }}
            >
              <Text style={styles.timerBtnText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 2. useCallback Card */}
      <View style={[styles.playgroundCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <Text style={[styles.cardTitlePlayground, { color: theme.primary }]}>🎯 useCallback (Optimization)</Text>
        <Text style={[styles.cardDescPlayground, { color: theme.textMuted }]}>
          When disabled, updating parent state re-creates the click handler, forcing the memoized child component to re-render.
        </Text>
        
        <View style={[styles.toggleRow, { backgroundColor: theme.background }]}>
          <Text style={[styles.toggleLabel, { color: theme.text }]}>Memoize callback with useCallback</Text>
          <Switch 
            value={useMemoizedCallback} 
            onValueChange={toggleMemoizedCallback} 
            thumbColor={theme.primary}
            trackColor={{ false: theme.border, true: theme.backgroundAlt }}
          />
        </View>

        <TouchableOpacity 
          style={[styles.parentBtn, { borderColor: theme.cardBorder }]} 
          onPress={() => setDummyState((prev) => prev + 1)}
        >
          <Text style={[styles.parentBtnText, { color: theme.primary }]}>Re-render Parent (State: {dummyState})</Text>
        </TouchableOpacity>

        <CallbackChild 
          onClick={useMemoizedCallback ? incrementChild : incrementChildUnmemoized} 
          renderCount={callbackCount} 
        />
      </View>

      {/* 3. useMemo Card */}
      <View style={[styles.playgroundCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <Text style={[styles.cardTitlePlayground, { color: theme.primary }]}>🧮 useMemo (Compute Caching)</Text>
        <Text style={[styles.cardDescPlayground, { color: theme.textMuted }]}>
          Calculates the {primeIndex}th prime number. Try typing in the unrelated input. If useMemo is disabled, typing will lag because it recalculates on every render.
        </Text>
        
        <View style={[styles.toggleRow, { backgroundColor: theme.background }]}>
          <Text style={[styles.toggleLabel, { color: theme.text }]}>Memoize computation with useMemo</Text>
          <Switch 
            value={useMemoizedCalculation} 
            onValueChange={toggleMemoizedCalculation} 
            thumbColor={theme.primary}
            trackColor={{ false: theme.border, true: theme.backgroundAlt }}
          />
        </View>

        <View style={styles.calcRow}>
          <Text style={[styles.calcLabel, { color: theme.text }]}>Nth Prime Index:</Text>
          <TextInput 
            style={[styles.calcInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.cardBorder }]}
            value={primeIndex.toString()}
            keyboardType="numeric"
            onChangeText={(val) => setPrimeIndex(val ? Math.min(parseInt(val, 10), 3000) : 0)}
          />
        </View>

        <Text style={[styles.resultText, { color: theme.text }]}>Result: <Text style={[styles.boldText, { color: theme.primary }]}>{finalPrimeResult}</Text></Text>

        <TextInput
          style={[styles.formInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.cardBorder }]}
          value={unrelatedInput}
          onChangeText={setUnrelatedInput}
          placeholder="Type here to test render lag..."
          placeholderTextColor={theme.textMuted}
        />
      </View>

      {/* 4. useRef Card */}
      <View style={[styles.playgroundCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <Text style={[styles.cardTitlePlayground, { color: theme.primary }]}>🔗 useRef (Refs & Mutation)</Text>
        <Text style={[styles.cardDescPlayground, { color: theme.textMuted }]}>
          Maintains a reference to the TextInput component to focus it programmatically.
        </Text>
        
        <TextInput 
          ref={inputRef}
          style={[styles.formInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.cardBorder }]}
          placeholder="I will be focused programmatically..."
          placeholderTextColor={theme.textMuted}
        />

        <TouchableOpacity style={[styles.refBtn, { backgroundColor: theme.primary }]} onPress={focusInput}>
          <Text style={[styles.refBtnText, { color: theme.background }]}>Focus Input Field</Text>
        </TouchableOpacity>
      </View>
      {/* 5. Reanimated v3 Card */}
      <Animated.View style={[styles.playgroundCard, animatedStyle, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <Text style={[styles.cardTitlePlayground, { color: theme.primary }]}>🎬 Reanimated (Native UI Thread)</Text>
        <Text style={[styles.cardDescPlayground, { color: theme.textMuted }]}>
          This card scale and opacity values are managed directly on the UI thread using Reanimated Worklets. Press on it to test smooth physics spring responsiveness.
        </Text>
        <TouchableOpacity 
          activeOpacity={1}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={{ width: '100%', padding: 12, backgroundColor: theme.primary + '15', borderRadius: 8, alignItems: 'center' }}
        >
          <Text style={{ color: theme.primary, fontWeight: '700' }}>PRESS ME TO SCALE</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
  parentRenderCounter: {
    fontSize: 13,
    marginTop: 6,
  },
  boldText: {
    fontWeight: '600',
  },
  playgroundScrollContainer: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 40,
  },
  playgroundCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
  },
  cardTitlePlayground: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardDescPlayground: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  timerContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  timerText: {
    fontSize: 48,
    fontWeight: '800',
    marginBottom: 16,
  },
  timerActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  timerBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  startBtn: {
    backgroundColor: '#10B981',
  },
  pauseBtn: {
    backgroundColor: '#F59E0B',
  },
  resetBtnPlayground: {
    backgroundColor: '#64748B',
  },
  timerBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  parentBtn: {
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  parentBtnText: {
    fontWeight: '600',
    fontSize: 14,
  },
  childContainer: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginTop: 10,
  },
  childTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  childMeta: {
    fontSize: 13,
    marginBottom: 4,
  },
  childBtn: {
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  childBtnText: {
    fontWeight: '700',
    fontSize: 13,
  },
  calcRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  calcLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 10,
  },
  calcInput: {
    flex: 1,
    height: 40,
    borderRadius: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
  },
  resultText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  refBtn: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  refBtnText: {
    fontWeight: '700',
    fontSize: 15,
  },
  formInput: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    borderWidth: 1,
  },
});
