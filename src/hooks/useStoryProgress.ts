import { useCallback, useEffect, useRef } from 'react';
import {
  useSharedValue,
  withTiming,
  cancelAnimation,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

interface Options {
  duration: number;
  paused: boolean;
  onComplete: () => void;
}

export function useStoryProgress({ duration, paused, onComplete }: Options) {
  const progress = useSharedValue(0);
  const doneCalled = useRef(false);

  const start = useCallback(() => {
    doneCalled.current = false;
    progress.value = 0;
    progress.value = withTiming(1, { duration, easing: Easing.linear }, (finished) => {
      if (finished && !doneCalled.current) {
        doneCalled.current = true;
        runOnJS(onComplete)();
      }
    });
  }, [duration, onComplete]);

  const pause = useCallback(() => cancelAnimation(progress), []);

  const resume = useCallback(() => {
    const remaining = (1 - progress.value) * duration;
    progress.value = withTiming(1, { duration: remaining, easing: Easing.linear }, (finished) => {
      if (finished && !doneCalled.current) {
        doneCalled.current = true;
        runOnJS(onComplete)();
      }
    });
  }, [duration, onComplete]);

  useEffect(() => {
    if (paused) pause();
    else resume();
  }, [paused]);

  return { progress, start, pause, resume };
}
