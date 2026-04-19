export declare enum HapticImpactStyle {
    Light = "light",
    Medium = "medium",
    Heavy = "heavy"
}
/**
 * Trigger a haptic feedback impact.
 * Works with expo-haptics or react-native-haptic-feedback.
 */
export declare const triggerHaptic: (style?: HapticImpactStyle) => void;
