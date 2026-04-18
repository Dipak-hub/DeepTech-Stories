"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarRing = AvatarRing;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_reanimated_1 = __importStar(require("react-native-reanimated"));
const expo_linear_gradient_1 = require("expo-linear-gradient");
const AnimatedPressable = react_native_reanimated_1.default.createAnimatedComponent(react_native_1.Pressable);
function AvatarRing({ user, isViewed, size = 68, unviewedColors = ['#f09433', '#e6683c', '#dc2743', '#cc2366', '#bc1888'], viewedColor = '#E0E0E0', getUserAvatarUrl, getUserName, onPress, }) {
    const scale = (0, react_native_reanimated_1.useSharedValue)(1);
    const opacity = (0, react_native_reanimated_1.useSharedValue)(1);
    const onPressIn = (0, react_1.useCallback)(() => {
        scale.value = (0, react_native_reanimated_1.withSpring)(0.92, { damping: 15, stiffness: 300 });
        opacity.value = (0, react_native_reanimated_1.withTiming)(0.8, { duration: 100 });
    }, [scale, opacity]);
    const onPressOut = (0, react_1.useCallback)(() => {
        scale.value = (0, react_native_reanimated_1.withSpring)(1, { damping: 12, stiffness: 250 });
        opacity.value = (0, react_native_reanimated_1.withTiming)(1, { duration: 150 });
    }, [scale, opacity]);
    const animStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));
    const RING = 3;
    const GAP = 3;
    const outer = size + (RING + GAP) * 2;
    const avatarUrl = getUserAvatarUrl(user);
    const username = getUserName(user);
    return (<AnimatedPressable onPress={() => onPress(user)} onPressIn={onPressIn} onPressOut={onPressOut} style={[styles.wrap, animStyle]}>
      <react_native_1.View style={{ width: outer, height: outer, alignItems: 'center', justifyContent: 'center' }}>
        {isViewed ? (<react_native_1.View style={{
                position: 'absolute',
                width: outer,
                height: outer,
                borderRadius: outer / 2,
                borderWidth: 1.5,
                borderColor: viewedColor,
            }}/>) : (<expo_linear_gradient_1.LinearGradient colors={unviewedColors} start={{ x: 0.1, y: 0.9 }} end={{ x: 0.9, y: 0.1 }} style={{
                position: 'absolute',
                width: outer,
                height: outer,
                borderRadius: outer / 2,
            }}/>)}

        <react_native_1.View style={{
            position: 'absolute',
            width: size + GAP * 2,
            height: size + GAP * 2,
            borderRadius: (size + GAP * 2) / 2,
            backgroundColor: '#fff',
        }}/>

        <react_native_1.Image source={{ uri: avatarUrl }} style={[
            styles.avatar,
            { width: size, height: size, borderRadius: size / 2 },
        ]} resizeMode="cover"/>
      </react_native_1.View>

      <react_native_1.Text style={[styles.name, { maxWidth: outer + 12 }]} numberOfLines={1}>
        {username}
      </react_native_1.Text>
    </AnimatedPressable>);
}
const styles = react_native_1.StyleSheet.create({
    wrap: {
        alignItems: 'center',
        marginHorizontal: 8,
    },
    avatar: {
        backgroundColor: '#eee',
        borderWidth: react_native_1.StyleSheet.hairlineWidth,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    name: {
        marginTop: 6,
        fontSize: 12,
        color: '#000',
        fontWeight: '400',
        textAlign: 'center',
        letterSpacing: -0.2,
    },
});
