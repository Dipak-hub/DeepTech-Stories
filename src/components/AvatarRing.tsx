import React, { useCallback } from 'react';
import { View, Image, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { StoryAccessors } from '../types';

interface Props<U, S> extends Pick<StoryAccessors<U, S>, 'getUserAvatarUrl' | 'getUserName'> {
  user: U;
  isViewed: boolean;
  size?: number;
  unviewedColors?: string[];
  viewedColor?: string;
  onPress: (user: U) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function AvatarRing<U, S>({
  user,
  isViewed,
  size = 68,
  unviewedColors = ['#f09433', '#e6683c', '#dc2743', '#cc2366', '#bc1888'],
  viewedColor = '#E0E0E0',
  getUserAvatarUrl,
  getUserName,
  onPress,
}: Props<U, S>) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const onPressIn = useCallback(() => {
    scale.value = withSpring(0.92, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(0.8, { duration: 100 });
  }, [scale, opacity]);

  const onPressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 250 });
    opacity.value = withTiming(1, { duration: 150 });
  }, [scale, opacity]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const RING = 3;
  const GAP = 3;
  const outer = size + (RING + GAP) * 2;

  const avatarUrl = getUserAvatarUrl(user);
  const username = getUserName(user);

  return (
    <AnimatedPressable
      onPress={() => onPress(user)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[styles.wrap, animStyle]}
    >
      <View style={{ width: outer, height: outer, alignItems: 'center', justifyContent: 'center' }}>
        {isViewed ? (
          <View
            style={{
              position: 'absolute',
              width: outer,
              height: outer,
              borderRadius: outer / 2,
              borderWidth: 1.5,
              borderColor: viewedColor,
            }}
          />
        ) : (
          <LinearGradient
            colors={unviewedColors as any}
            start={{ x: 0.1, y: 0.9 }}
            end={{ x: 0.9, y: 0.1 }}
            style={{
              position: 'absolute',
              width: outer,
              height: outer,
              borderRadius: outer / 2,
            }}
          />
        )}

        <View
          style={{
            position: 'absolute',
            width: size + GAP * 2,
            height: size + GAP * 2,
            borderRadius: (size + GAP * 2) / 2,
            backgroundColor: '#fff',
          }}
        />

        <Image
          source={{ uri: avatarUrl }}
          style={[
            styles.avatar,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
          resizeMode="cover"
        />
      </View>

      <Text style={[styles.name, { maxWidth: outer + 12 }]} numberOfLines={1}>
        {username}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  avatar: {
    backgroundColor: '#eee',
    borderWidth: StyleSheet.hairlineWidth,
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
