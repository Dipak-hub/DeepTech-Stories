import React from 'react';
import { StoryAccessors } from '../types';
interface Props<U, S> extends Pick<StoryAccessors<U, S>, 'getUserAvatarUrl' | 'getUserName'> {
    user: U;
    isViewed: boolean;
    size?: number;
    unviewedColors?: string[];
    viewedColor?: string;
    onPress: (user: U) => void;
}
export declare function AvatarRing<U, S>({ user, isViewed, size, unviewedColors, viewedColor, getUserAvatarUrl, getUserName, onPress, }: Props<U, S>): React.JSX.Element;
export {};
