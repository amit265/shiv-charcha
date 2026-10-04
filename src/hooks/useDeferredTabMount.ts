import { useState, useEffect } from 'react';
import { InteractionManager } from 'react-native';

/**
 * Custom hook to eliminate tab switching lag by displaying a smooth loading state
 * while heavy data/UI trees mount after tab transition animations complete.
 */
export function useDeferredTabMount(delayMs: number = 30) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const task = InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        if (isMounted) setIsReady(true);
      }, delayMs);
    });

    return () => {
      isMounted = false;
      task.cancel();
    };
  }, [delayMs]);

  return isReady;
}
