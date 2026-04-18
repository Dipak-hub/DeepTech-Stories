import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, SharedValue } from 'react-native-reanimated';

interface Props {
  progress: SharedValue<number>;
  isActive: boolean;
  isViewed: boolean;
  trackStyle?: any;
  fillStyle?: any;
}

export const ProgressBar: React.FC<Props> = ({ progress, isActive, isViewed, trackStyle, fillStyle }) => {
  const animatedFillStyle = useAnimatedStyle(() => ({
    width: isViewed
      ? '100%'
      : isActive
      ? `${progress.value * 100}%`
      : '0%',
  }));

  return (
    <View style={[styles.track, trackStyle]}>
      <Animated.View style={[styles.fill, fillStyle, animatedFillStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
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
