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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressBar = void 0;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_native_reanimated_1 = __importStar(require("react-native-reanimated"));
const ProgressBar = ({ progress, isActive, isViewed, trackStyle, fillStyle }) => {
    const animatedFillStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({
        width: isViewed
            ? '100%'
            : isActive
                ? `${progress.value * 100}%`
                : '0%',
    }));
    return (<react_native_1.View style={[styles.track, trackStyle]}>
      <react_native_reanimated_1.default.View style={[styles.fill, fillStyle, animatedFillStyle]}/>
    </react_native_1.View>);
};
exports.ProgressBar = ProgressBar;
const styles = react_native_1.StyleSheet.create({
    track: {
        flex: 1,
        height: 2,
        backgroundColor: 'rgba(255,255,255,0.35)',
        borderRadius: 2,
        marginHorizontal: 2,
        overflow: 'hidden',
        // Subtle shadow so it stands out on white stories
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 1.5,
        elevation: 2,
    },
    fill: {
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: 2,
    },
});
