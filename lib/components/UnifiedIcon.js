"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnifiedIcon = void 0;
const react_1 = __importDefault(require("react"));
// Try to load Expo icons
let ExpoIcons = {};
try {
    ExpoIcons.Feather = require('@expo/vector-icons').Feather;
    ExpoIcons.Ionicons = require('@expo/vector-icons').Ionicons;
}
catch (e) { }
// Try to load RN Vector Icons (CLI)
let RNVectorIcons = {};
try {
    RNVectorIcons.Feather = require('react-native-vector-icons/Feather').default;
    RNVectorIcons.Ionicons = require('react-native-vector-icons/Ionicons').default;
}
catch (e) { }
/**
 * A wrapper for icons that switches between @expo/vector-icons and react-native-vector-icons.
 */
const UnifiedIcon = ({ family, name, size = 24, color = '#fff', style }) => {
    // 1. Try Expo
    if (ExpoIcons[family]) {
        const IconComponent = ExpoIcons[family];
        return <IconComponent name={name} size={size} color={color} style={style}/>;
    }
    // 2. Try RN Vector Icons (CLI)
    if (RNVectorIcons[family]) {
        const IconComponent = RNVectorIcons[family];
        return <IconComponent name={name} size={size} color={color} style={style}/>;
    }
    // 3. Fallback: Nothing (prevent crash)
    return null;
};
exports.UnifiedIcon = UnifiedIcon;
