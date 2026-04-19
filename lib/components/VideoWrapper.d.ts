import React from 'react';
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
export declare const VideoWrapper: (props: VideoWrapperProps) => React.JSX.Element;
export {};
