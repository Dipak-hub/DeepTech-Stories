"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerHaptic = exports.HapticImpactStyle = void 0;
let ExpoHaptics = null;
try {
    ExpoHaptics = require('expo-haptics');
}
catch (e) { }
let RNHapticFeedback = null;
try {
    RNHapticFeedback = require('react-native-haptic-feedback').default;
}
catch (e) { }
var HapticImpactStyle;
(function (HapticImpactStyle) {
    HapticImpactStyle["Light"] = "light";
    HapticImpactStyle["Medium"] = "medium";
    HapticImpactStyle["Heavy"] = "heavy";
})(HapticImpactStyle || (exports.HapticImpactStyle = HapticImpactStyle = {}));
/**
 * Trigger a haptic feedback impact.
 * Works with expo-haptics or react-native-haptic-feedback.
 */
const triggerHaptic = (style = HapticImpactStyle.Light) => {
    // 1. Try Expo
    if (ExpoHaptics) {
        const expoStyle = style === HapticImpactStyle.Heavy ? ExpoHaptics.ImpactFeedbackStyle.Heavy :
            style === HapticImpactStyle.Medium ? ExpoHaptics.ImpactFeedbackStyle.Medium :
                ExpoHaptics.ImpactFeedbackStyle.Light;
        ExpoHaptics.impactAsync(expoStyle).catch(() => { });
        return;
    }
    // 2. Try RN Haptic Feedback (CLI)
    if (RNHapticFeedback) {
        const rnStyle = style === HapticImpactStyle.Heavy ? 'impactHeavy' :
            style === HapticImpactStyle.Medium ? 'impactMedium' :
                'impactLight';
        RNHapticFeedback.trigger(rnStyle, {
            enableVibrateFallback: false,
            ignoreAndroidSystemSettings: false,
        });
        return;
    }
};
exports.triggerHaptic = triggerHaptic;
