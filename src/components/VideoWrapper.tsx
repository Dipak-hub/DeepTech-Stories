import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

// Try to import Expo Video
let ExpoVideoView: any = null;
let useExpoVideoPlayer: any = null;

try {
  const ExpoVideo = require('expo-video');
  ExpoVideoView = ExpoVideo.VideoView;
  useExpoVideoPlayer = ExpoVideo.useVideoPlayer;
} catch (e) {
  // expo-video not available
}

// Try to import React Native Video
let RNVideo: any = null;
try {
  RNVideo = require('react-native-video').default;
} catch (e) {
  // react-native-video not available
}

export interface VideoLoadData {
  durationMillis: number;
}

interface VideoWrapperProps {
  url: string;
  paused: boolean;
  onLoad: (data: VideoLoadData) => void;
  style?: any;
}

/**
 * A wrapper component that abstracts the difference between expo-video and react-native-video.
 * It ensures a consistent API for both environments.
 */
export const VideoWrapper = (props: VideoWrapperProps) => {
  if (useExpoVideoPlayer && ExpoVideoView) {
    return <ExpoVideoImpl {...props} />;
  }

  if (RNVideo) {
    return <RNVideoImpl {...props} />;
  }

  // Fallback if no video library is found
  return <View style={[props.style || StyleSheet.absoluteFill, { backgroundColor: '#000' }]} />;
};

const ExpoVideoImpl = ({ url, paused, onLoad, style }: VideoWrapperProps) => {
  const player = useExpoVideoPlayer(url, (p: any) => {
    p.loop = true;
    p.play();
  });

  useEffect(() => {
    if (paused) {
      player.pause();
    } else {
      player.play();
    }
  }, [paused, player]);

  return (
    <ExpoVideoView
      player={player}
      style={style || StyleSheet.absoluteFill}
      contentFit="cover"
      onFirstFrameRender={() => {
        // Expo video player.duration is in seconds
        onLoad({ durationMillis: (player.duration || 0) * 1000 });
      }}
    />
  );
};

const RNVideoImpl = ({ url, paused, onLoad, style }: VideoWrapperProps) => {
  return (
    <RNVideo
      source={{ uri: url }}
      paused={paused}
      repeat={true}
      resizeMode="cover"
      style={style || StyleSheet.absoluteFill}
      onLoad={(data: any) => {
        // react-native-video data.duration is in seconds
        onLoad({ durationMillis: (data.duration || 0) * 1000 });
      }}
    />
  );
};
