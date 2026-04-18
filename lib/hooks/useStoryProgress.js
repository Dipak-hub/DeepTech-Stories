"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStoryProgress = useStoryProgress;
const react_1 = require("react");
const react_native_reanimated_1 = require("react-native-reanimated");
function useStoryProgress({ duration, paused, onComplete }) {
    const progress = (0, react_native_reanimated_1.useSharedValue)(0);
    const doneCalled = (0, react_1.useRef)(false);
    const start = (0, react_1.useCallback)(() => {
        doneCalled.current = false;
        progress.value = 0;
        progress.value = (0, react_native_reanimated_1.withTiming)(1, { duration, easing: react_native_reanimated_1.Easing.linear }, (finished) => {
            if (finished && !doneCalled.current) {
                doneCalled.current = true;
                (0, react_native_reanimated_1.runOnJS)(onComplete)();
            }
        });
    }, [duration, onComplete]);
    const pause = (0, react_1.useCallback)(() => (0, react_native_reanimated_1.cancelAnimation)(progress), []);
    const resume = (0, react_1.useCallback)(() => {
        const remaining = (1 - progress.value) * duration;
        progress.value = (0, react_native_reanimated_1.withTiming)(1, { duration: remaining, easing: react_native_reanimated_1.Easing.linear }, (finished) => {
            if (finished && !doneCalled.current) {
                doneCalled.current = true;
                (0, react_native_reanimated_1.runOnJS)(onComplete)();
            }
        });
    }, [duration, onComplete]);
    (0, react_1.useEffect)(() => {
        if (paused)
            pause();
        else
            resume();
    }, [paused]);
    return { progress, start, pause, resume };
}
