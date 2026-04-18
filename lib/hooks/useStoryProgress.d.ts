interface Options {
    duration: number;
    paused: boolean;
    onComplete: () => void;
}
export declare function useStoryProgress({ duration, paused, onComplete }: Options): {
    progress: import("react-native-reanimated").SharedValue<number>;
    start: () => void;
    pause: () => void;
    resume: () => void;
};
export {};
