import { useCallback, useEffect, useRef, useState } from 'react';

export type FocusSessionStatus = 'idle' | 'running' | 'stopped';

export interface UseFocusTimerResult {
  status: FocusSessionStatus;
  focusedSeconds: number;
  focusedMinutes: number;
  start: () => void;
  stop: () => void;
}

export function useFocusTimer(): UseFocusTimerResult {
  const [status, setStatus] = useState<FocusSessionStatus>('idle');
  const [focusedSeconds, setFocusedSeconds] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef<number | null>(null);

  const clearTick = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    clearTick();
    startedAtRef.current = Date.now();
    setStatus('running');
    setFocusedSeconds(0);

    intervalRef.current = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startedAtRef.current!) / 1000);
      setFocusedSeconds(elapsedSeconds);
    }, 1000);
  }, [clearTick]);

  const stop = useCallback(() => {
    setStatus((current) => {
      if (current !== 'running') {
        return current;
      }

      if (startedAtRef.current !== null) {
        const elapsedSeconds = Math.floor((Date.now() - startedAtRef.current) / 1000);
        setFocusedSeconds(elapsedSeconds);
      }
      clearTick();
      return 'stopped';
    });
  }, [clearTick]);

  useEffect(() => {
    return () => clearTick();
  }, [clearTick]);

  return {
    status,
    focusedSeconds,
    focusedMinutes: Math.round(focusedSeconds / 60),
    start,
    stop,
  };
}
