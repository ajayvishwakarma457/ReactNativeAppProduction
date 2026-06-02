import { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export function useAppState(onBackground?: () => void, onForeground?: () => void) {
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const handleStateChange = (nextAppState: AppStateStatus) => {
      console.log(`[AppState] Application state transitioned: ${appState} -> ${nextAppState}`);
      
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('[AppState] Application moved to active (foreground)');
        if (onForeground) {
          onForeground();
        }
      }
      
      if (appState === 'active' && nextAppState.match(/inactive|background/)) {
        console.log('[AppState] Application moved to background');
        if (onBackground) {
          onBackground();
        }
      }
      
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleStateChange);

    return () => {
      subscription.remove();
    };
  }, [appState, onBackground, onForeground]);

  return appState;
}
