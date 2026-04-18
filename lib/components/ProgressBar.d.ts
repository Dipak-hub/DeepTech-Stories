import React from 'react';
import { SharedValue } from 'react-native-reanimated';
interface Props {
    progress: SharedValue<number>;
    isActive: boolean;
    isViewed: boolean;
    trackStyle?: any;
    fillStyle?: any;
}
export declare const ProgressBar: React.FC<Props>;
export {};
