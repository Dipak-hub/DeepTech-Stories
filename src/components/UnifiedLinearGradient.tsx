import React from 'react';
import { View, ViewProps } from 'react-native';

let ExpoLinearGradient: any = null;
try {
  ExpoLinearGradient = require('expo-linear-gradient').LinearGradient;
} catch (e) {}

let RNLinearGradient: any = null;
try {
  RNLinearGradient = require('react-native-linear-gradient');
} catch (e) {}

interface UnifiedLinearGradientProps extends ViewProps {
  colors: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  locations?: number[];
  children?: React.ReactNode;
}

/**
 * A wrapper for LinearGradient that works in Expo, CLI (via react-native-linear-gradient),
 * and potentially future New Arch style props.
 */
export const UnifiedLinearGradient = ({
  colors,
  start,
  end,
  locations,
  style,
  children,
  ...props
}: UnifiedLinearGradientProps) => {
  // 1. Try Expo
  if (ExpoLinearGradient) {
    return (
      <ExpoLinearGradient
        colors={colors}
        start={start}
        end={end}
        locations={locations}
        style={style}
        {...props}
      >
        {children}
      </ExpoLinearGradient>
    );
  }

  // 2. Try React Native Linear Gradient (CLI)
  if (RNLinearGradient) {
    return (
      <RNLinearGradient
        colors={colors}
        start={start}
        end={end}
        locations={locations}
        style={style}
        {...props}
      >
        {children}
      </RNLinearGradient>
    );
  }

  // 3. Fallback: Standard View
  // If no gradient library is found, we use a solid background of the first color
  // or just a transparent view to prevent crashing.
  return (
    <View style={[{ backgroundColor: colors[0] || 'transparent' }, style]} {...props}>
      {children}
    </View>
  );
};
