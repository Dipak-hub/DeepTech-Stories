import React from 'react';
import { ViewProps } from 'react-native';
interface UnifiedLinearGradientProps extends ViewProps {
    colors: string[];
    start?: {
        x: number;
        y: number;
    };
    end?: {
        x: number;
        y: number;
    };
    locations?: number[];
    children?: React.ReactNode;
}
/**
 * A wrapper for LinearGradient that works in Expo, CLI (via react-native-linear-gradient),
 * and potentially future New Arch style props.
 */
export declare const UnifiedLinearGradient: ({ colors, start, end, locations, style, children, ...props }: UnifiedLinearGradientProps) => React.JSX.Element;
export {};
