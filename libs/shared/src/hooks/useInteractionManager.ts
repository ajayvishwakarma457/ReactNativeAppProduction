import { useEffect, useState } from 'react';
import { InteractionManager } from 'react-native';

/**
 * A custom hook that defers execution of a callback until screen transitions
 * and other active animations have finished.
 *
 * @param callback The function to execute after interactions have finished.
 */
export const useInteractionManager = (callback?: () => void) => {
  const [interactionsComplete, setInteractionsComplete] = useState(false);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setInteractionsComplete(true);
      if (callback) {
        callback();
      }
    });

    return () => {
      task.cancel();
    };
  }, [callback]);

  return interactionsComplete;
};
export default useInteractionManager;
