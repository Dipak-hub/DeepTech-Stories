import { ReactNode } from 'react';
import { StyleProp, ViewStyle, TextStyle } from 'react-native';

export type StoryMediaType = 'image' | 'video';

export interface StoryViewerCallbacks {
  onStoryOpen?: (userId: string) => void;
  onStoryView?: (userId: string, storyId: string) => void;
  onStoryClose?: (userId: string) => void;
  onAllStoriesViewed?: (userId: string) => void;
}

export interface StoryAccessors<U, S> {
  getUserId: (user: U) => string;
  getUserAvatarUrl: (user: U) => string;
  getUserName: (user: U) => string;
  getUserStories: (user: U) => S[];
  getStoryId: (story: S) => string;
  getStoryMediaUrl: (story: S) => string;
  getStoryMediaType?: (story: S) => StoryMediaType | undefined;
  getStoryDuration?: (story: S) => number | undefined;
}

export interface StoryViewerProps<U, S> extends StoryViewerCallbacks, StoryAccessors<U, S> {
  users: U[];
  initialUserId?: string;
  visible: boolean;
  onClose: () => void;
  viewedStoryIds?: string[];
  onMarkViewed?: (storyId: string) => void;
  defaultStoryDuration?: number;

  showsReplyInput?: boolean;
  showsOptionsIcon?: boolean;
  showsLikeIcon?: boolean;
  showsShareIcon?: boolean;

  // Callbacks
  onReplySubmit?: (user: U, story: S, text: string) => void;
  onLikePress?: (user: U, story: S) => void;
  onSharePress?: (user: U, story: S) => void;
  onOptionsPress?: (user: U, story: S) => void;

  // Customization Props
  renderHeader?: (props: { user: U; story: S; onClose: () => void }) => ReactNode;
  renderFooter?: (props: { user: U; story: S; onReply?: (text: string) => void }) => ReactNode;
  renderCaption?: (props: { user: U; story: S }) => ReactNode;

  // Style Overrides
  headerStyle?: StyleProp<ViewStyle>;
  usernameStyle?: StyleProp<TextStyle>;
  timestampStyle?: StyleProp<TextStyle>;
  footerStyle?: StyleProp<ViewStyle>;
  replyInputStyle?: StyleProp<ViewStyle>;
  progressBarTrackStyle?: StyleProp<ViewStyle>;
  progressBarFillStyle?: StyleProp<ViewStyle>;
}

export interface StoryTrayProps<U, S> extends StoryViewerCallbacks, StoryAccessors<U, S> {
  users: U[];
  viewedStoryIds?: string[];
  unviewedRingColors?: string[];
  viewedRingColor?: string;
  avatarSize?: number;
  trayBackgroundColor?: string;
  renderAvatar?: (props: { user: U; isViewed: boolean; onPress: (user: U) => void }) => ReactNode;
  defaultStoryDuration?: number;

  showsReplyInput?: boolean;
  showsOptionsIcon?: boolean;
  showsLikeIcon?: boolean;
  showsShareIcon?: boolean;

  // Callbacks
  onReplySubmit?: (user: U, story: S, text: string) => void;
  onLikePress?: (user: U, story: S) => void;
  onSharePress?: (user: U, story: S) => void;
  onOptionsPress?: (user: U, story: S) => void;

  // Style Overrides
  headerStyle?: StyleProp<ViewStyle>;
  usernameStyle?: StyleProp<TextStyle>;
  timestampStyle?: StyleProp<TextStyle>;
  footerStyle?: StyleProp<ViewStyle>;
  replyInputStyle?: StyleProp<ViewStyle>;
  progressBarTrackStyle?: StyleProp<ViewStyle>;
  progressBarFillStyle?: StyleProp<ViewStyle>;
}

// Example / Default data structures
export interface DefaultStoryItem {
  id: string;
  uri: string;
  mediaType?: StoryMediaType;
  duration?: number;
  title?: string;
  caption?: string;
}

export interface DefaultStoryUser {
  id: string;
  username: string;
  avatarUri: string;
  stories: DefaultStoryItem[];
}
