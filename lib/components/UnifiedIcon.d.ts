import React from 'react';
interface UnifiedIconProps {
    family: 'Feather' | 'Ionicons';
    name: string;
    size?: number;
    color?: string;
    style?: any;
}
/**
 * A wrapper for icons that switches between @expo/vector-icons and react-native-vector-icons.
 */
export declare const UnifiedIcon: ({ family, name, size, color, style }: UnifiedIconProps) => React.JSX.Element | null;
export {};
