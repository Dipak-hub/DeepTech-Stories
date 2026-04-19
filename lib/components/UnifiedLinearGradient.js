"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnifiedLinearGradient = void 0;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
let ExpoLinearGradient = null;
try {
    ExpoLinearGradient = require('expo-linear-gradient').LinearGradient;
}
catch (e) { }
let RNLinearGradient = null;
try {
    RNLinearGradient = require('react-native-linear-gradient');
}
catch (e) { }
/**
 * A wrapper for LinearGradient that works in Expo, CLI (via react-native-linear-gradient),
 * and potentially future New Arch style props.
 */
const UnifiedLinearGradient = ({ colors, start, end, locations, style, children, ...props }) => {
    // 1. Try Expo
    if (ExpoLinearGradient) {
        return (<ExpoLinearGradient colors={colors} start={start} end={end} locations={locations} style={style} {...props}>
        {children}
      </ExpoLinearGradient>);
    }
    // 2. Try React Native Linear Gradient (CLI)
    if (RNLinearGradient) {
        return (<RNLinearGradient colors={colors} start={start} end={end} locations={locations} style={style} {...props}>
        {children}
      </RNLinearGradient>);
    }
    // 3. Fallback: Standard View
    // If no gradient library is found, we use a solid background of the first color
    // or just a transparent view to prevent crashing.
    return (<react_native_1.View style={[{ backgroundColor: colors[0] || 'transparent' }, style]} {...props}>
      {children}
    </react_native_1.View>);
};
exports.UnifiedLinearGradient = UnifiedLinearGradient;
