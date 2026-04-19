let ExpoHaptics: any = null;
try {
  ExpoHaptics = require('expo-haptics');
} catch (e) {}

let RNHapticFeedback: any = null;
try {
  RNHapticFeedback = require('react-native-haptic-feedback').default;
} catch (e) {}

export enum HapticImpactStyle {
  Light = 'light',
  Medium = 'medium',
  Heavy = 'heavy',
}

/**
 * Trigger a haptic feedback impact.
 * Works with expo-haptics or react-native-haptic-feedback.
 */
export const triggerHaptic = (style: HapticImpactStyle = HapticImpactStyle.Light) => {
  // 1. Try Expo
  if (ExpoHaptics) {
    const expoStyle = 
      style === HapticImpactStyle.Heavy ? ExpoHaptics.ImpactFeedbackStyle.Heavy :
      style === HapticImpactStyle.Medium ? ExpoHaptics.ImpactFeedbackStyle.Medium :
      ExpoHaptics.ImpactFeedbackStyle.Light;
      
    ExpoHaptics.impactAsync(expoStyle).catch(() => {});
    return;
  }

  // 2. Try RN Haptic Feedback (CLI)
  if (RNHapticFeedback) {
    const rnStyle = 
      style === HapticImpactStyle.Heavy ? 'impactHeavy' :
      style === HapticImpactStyle.Medium ? 'impactMedium' :
      'impactLight';
      
    RNHapticFeedback.trigger(rnStyle, {
      enableVibrateFallback: false,
      ignoreAndroidSystemSettings: false,
    });
    return;
  }
};
