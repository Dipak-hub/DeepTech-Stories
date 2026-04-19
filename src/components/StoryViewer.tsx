import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  FadeIn,
  FadeOut,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { useStoryProgress } from '../hooks/useStoryProgress';
import { StoryViewerProps, StoryMediaType, StoryAnimationType } from '../types';
import { ProgressBar } from './ProgressBar';
import { VideoWrapper, VideoLoadData } from './VideoWrapper';

const { width: W, height: H } = Dimensions.get('window');
const DEFAULT_DUR = 5000;

function StoryVideo({ url, paused, onLoad }: { url: string; paused: boolean; onLoad: (data?: VideoLoadData) => void }) {
  return (
    <VideoWrapper
      url={url}
      paused={paused}
      onLoad={onLoad}
      style={StyleSheet.absoluteFill}
    />
  );
}

function AnimatedUserStory<U, S>({
  user,
  storyIndex,
  i,
  scrollX,
  getUserStories,
  getStoryMediaUrl,
  getStoryMediaType,
  onLoad,
  animationType,
  paused,
}: {
  user: U;
  storyIndex: number;
  i: number;
  scrollX: SharedValue<number>;
  getUserStories: (user: U) => S[];
  getStoryMediaUrl: (story: S) => string;
  getStoryMediaType?: (story: S) => StoryMediaType | undefined;
  onLoad: () => void;
  animationType: StoryAnimationType;
  paused: boolean;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const offset = scrollX.value - i * W;
    const opacity = Math.abs(offset) >= W ? 0 : 1;

    if (animationType === 'slide') {
      return {
        opacity,
        transform: [{ translateX: -offset }],
      };
    }

    const rotateY = interpolate(offset, [-W, 0, W], [90, 0, -90], Extrapolation.CLAMP);
    const isNext = offset < 0;
    const pivotX = isNext ? -W / 2 : W / 2;

    return {
      opacity,
      transform: [
        { perspective: 1000 },
        { translateX: -offset },
        { translateX: pivotX },
        { rotateY: `${rotateY}deg` },
        { translateX: -pivotX },
      ],
    };
  });

  const stories = getUserStories(user);
  const story = stories[storyIndex];
  if (!story) return null;

  const isVideo = getStoryMediaType?.(story) === 'video';

  return (
    <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]} pointerEvents="none">
      {isVideo ? (
        <StoryVideo url={getStoryMediaUrl(story)} paused={paused} onLoad={onLoad} />
      ) : (
        <Image 
          source={{ uri: getStoryMediaUrl(story) }} 
          style={StyleSheet.absoluteFill} 
          resizeMode="cover" 
          onLoad={() => {
            setTimeout(onLoad, 50);
          }}
        />
      )}
      <LinearGradient colors={['rgba(0,0,0,0.6)', 'transparent']} style={styles.scrimTop} pointerEvents="none" />
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.scrimBottom} pointerEvents="none" />
    </Animated.View>
  );
}

export function StoryViewer<U, S>({
  users,
  initialUserId,
  visible,
  onClose,
  viewedStoryIds = [],
  onMarkViewed,
  onStoryOpen,
  onStoryView,
  onStoryClose,
  onAllStoriesViewed,
  
  getUserId,
  getUserAvatarUrl,
  getUserName,
  getUserStories,
  getStoryId,
  getStoryMediaUrl,
  getStoryMediaType,
  getStoryDuration,
  defaultStoryDuration = 5000,
  maxVideoDuration = 30000,
  animationType = 'cube',
  
  showsReplyInput = true,
  showsOptionsIcon = true,
  showsLikeIcon = true,
  showsShareIcon = true,
  
  onReplySubmit,
  onLikePress,
  onSharePress,
  onOptionsPress,
  
  headerStyle,
  usernameStyle,
  timestampStyle,
  footerStyle,
  replyInputStyle,
  progressBarTrackStyle,
  progressBarFillStyle,
  
  renderHeader,
  renderFooter,
  renderCaption,
}: StoryViewerProps<U, S>) {
  const insets = useSafeAreaInsets();
  const [userIndex, setUserIndex] = useState(0);
  const [storyIndices, setStoryIndices] = useState<Record<string, number>>({});
  const [paused, setPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);

  const scrollX = useSharedValue(0);

  const p0 = useSharedValue(0);
  const p1 = useSharedValue(0);
  const p2 = useSharedValue(0);
  const p3 = useSharedValue(0);
  const p4 = useSharedValue(0);
  const p5 = useSharedValue(0);
  const p6 = useSharedValue(0);
  const p7 = useSharedValue(0);
  const p8 = useSharedValue(0);
  const p9 = useSharedValue(0);
  const allProgress = useRef([p0, p1, p2, p3, p4, p5, p6, p7, p8, p9]);

  const activeUser = users[userIndex];
  const activeUserId = activeUser ? getUserId(activeUser) : '';
  const activeUserStories = activeUser ? getUserStories(activeUser) : [];
  const activeStoryIndex = activeUserId ? (storyIndices[activeUserId] || 0) : 0;
  const activeStory = activeUserStories[activeStoryIndex];
  
  let duration = activeStory ? (getStoryDuration?.(activeStory) ?? defaultStoryDuration) : defaultStoryDuration;
  if (activeStory && getStoryMediaType?.(activeStory) === 'video') {
    duration = Math.min(duration, maxVideoDuration);
  }

  const updateStoryIndex = useCallback((uid: string, newIdx: number) => {
    setStoryIndices(prev => ({ ...prev, [uid]: newIdx }));
  }, []);

  const goNext = useCallback(() => {
    if (!activeUser || !activeUserId) return;
    if (activeStoryIndex < activeUserStories.length - 1) {
      allProgress.current[activeStoryIndex].value = 1;
      updateStoryIndex(activeUserId, activeStoryIndex + 1);
    } else {
      if (userIndex < users.length - 1) {
        const nextUserIdx = userIndex + 1;
        scrollX.value = withTiming(nextUserIdx * W, { duration: 300 });
        setUserIndex(nextUserIdx);
      } else {
        onAllStoriesViewed?.(activeUserId);
        onClose();
      }
    }
  }, [activeUser, activeUserId, activeUserStories.length, activeStoryIndex, userIndex, users.length, scrollX, onClose, onAllStoriesViewed, updateStoryIndex]);

  const goPrev = useCallback(() => {
    if (!activeUser || !activeUserId) return;
    if (activeStoryIndex > 0) {
      allProgress.current[activeStoryIndex].value = 0;
      allProgress.current[activeStoryIndex - 1].value = 0;
      updateStoryIndex(activeUserId, activeStoryIndex - 1);
    } else {
      if (userIndex > 0) {
        const prevUserIdx = userIndex - 1;
        scrollX.value = withTiming(prevUserIdx * W, { duration: 300 });
        setUserIndex(prevUserIdx);
      }
    }
  }, [activeUser, activeUserId, activeStoryIndex, userIndex, scrollX, updateStoryIndex]);

  const { progress, start } = useStoryProgress({
    duration,
    paused: paused || !isMediaLoaded,
    onComplete: goNext,
  });

  useEffect(() => {
    if (activeUser && activeStoryIndex < allProgress.current.length) {
      allProgress.current[activeStoryIndex] = progress;
    }
  }, [activeUser, activeStoryIndex, progress]);

  useEffect(() => {
    if (visible && users.length > 0) {
      let initIdx = users.findIndex(u => getUserId(u) === initialUserId);
      if (initIdx === -1) initIdx = 0;
      
      setUserIndex(initIdx);
      scrollX.value = initIdx * W;
      setReplyText('');
      setIsMediaLoaded(false);
      onStoryOpen?.(getUserId(users[initIdx]));
    }
  }, [visible, initialUserId, users, getUserId]);

  useEffect(() => {
    if (!visible || !activeStory || !activeUser) return;
    setIsMediaLoaded(false);
    
    const sid = getStoryId(activeStory);
    const uid = getUserId(activeUser);
    onMarkViewed?.(sid);
    onStoryView?.(uid, sid);

    activeUserStories.forEach((s, i) => {
      const isV = viewedStoryIds.includes(getStoryId(s));
      if (i < activeStoryIndex) allProgress.current[i].value = 1;
      else if (i > activeStoryIndex) allProgress.current[i].value = isV ? 1 : 0;
      else allProgress.current[i].value = 0;
    });

    start();
  }, [userIndex, activeStoryIndex, visible, activeStory, activeUser, activeUserStories, getStoryId, getUserId, viewedStoryIds]);

  const isPanning = useSharedValue(false);

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onStart(() => {
      isPanning.value = true;
      runOnJS(setPaused)(true);
    })
    .onUpdate((e) => {
      scrollX.value = userIndex * W - e.translationX;
    })
    .onEnd((e) => {
      isPanning.value = false;
      runOnJS(setPaused)(false);
      
      const projectedX = e.translationX + e.velocityX * 0.2;
      let nextIdx = userIndex;
      
      if (projectedX < -W / 4) {
        // Swiping left (next user)
        nextIdx = userIndex + 1;
      } else if (projectedX > W / 4) {
        // Swiping right (previous user)
        nextIdx = userIndex - 1;
      }

      nextIdx = Math.max(0, Math.min(users.length - 1, nextIdx));

      // Use a custom spring config for a quick, native-feeling snap
      scrollX.value = withSpring(nextIdx * W, {
        damping: 20,
        stiffness: 250,
        mass: 0.8,
      });
      
      if (nextIdx !== userIndex) {
        runOnJS(setIsMediaLoaded)(false);
        runOnJS(setUserIndex)(nextIdx);
      }
    });

  const swipeDown = Gesture.Pan()
    .activeOffsetY(10)
    .onEnd((e) => {
      if (e.translationY > 80 && Math.abs(e.translationX) < 50) {
        runOnJS(onClose)();
      }
    });

  const longPress = Gesture.LongPress()
    .minDuration(180)
    .onStart(() => runOnJS(setPaused)(true))
    .onEnd(() => runOnJS(setPaused)(false));

  const tap = Gesture.Tap()
    .maxDuration(200)
    .onEnd((e) => {
      if (isPanning.value) return;
      if (e.y > H - 120) return; 
      if (e.x < W / 3) runOnJS(goPrev)();
      else runOnJS(goNext)();
    });

  const gesture = Gesture.Simultaneous(
    Gesture.Race(pan, swipeDown),
    Gesture.Race(longPress, tap)
  );

  const handleLike = useCallback(() => {
    if (!activeUser || !activeStory) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onLikePress?.(activeUser, activeStory);
  }, [activeUser, activeStory, onLikePress]);

  const handleShare = useCallback(() => {
    if (!activeUser || !activeStory) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSharePress?.(activeUser, activeStory);
  }, [activeUser, activeStory, onSharePress]);

  const handleOptions = useCallback(() => {
    if (!activeUser || !activeStory) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onOptionsPress?.(activeUser, activeStory);
  }, [activeUser, activeStory, onOptionsPress]);

  const handleReplySubmit = useCallback(() => {
    if (!activeUser || !activeStory || !replyText.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onReplySubmit?.(activeUser, activeStory, replyText);
    setReplyText('');
    setPaused(false);
  }, [activeUser, activeStory, replyText, onReplySubmit]);

  if (!activeStory || !activeUser) return null;

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar hidden />
      <View style={styles.root}>
        <GestureDetector gesture={gesture}>
          <View style={StyleSheet.absoluteFill}>
            {users.map((u, i) => (
              <AnimatedUserStory<U, S>
                key={getUserId(u)} 
                user={u} 
                storyIndex={storyIndices[getUserId(u)] || 0} 
                i={i} 
                scrollX={scrollX} 
                getUserStories={getUserStories}
                getStoryMediaUrl={getStoryMediaUrl}
                getStoryMediaType={getStoryMediaType}
                animationType={animationType}
                paused={paused || i !== userIndex}
                onLoad={() => {
                  if (i === userIndex) {
                    setIsMediaLoaded(true);
                  }
                }}
              />
            ))}
            <View style={StyleSheet.absoluteFill} />
          </View>
        </GestureDetector>

        {!isMediaLoaded && (
          <View style={styles.loaderWrap} pointerEvents="none">
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}

        <View style={[styles.bars, { top: insets.top + 8 }]} pointerEvents="none">
          {activeUserStories.map((s, i) => (
            <ProgressBar
              key={getStoryId(s)}
              progress={allProgress.current[i]}
              isActive={i === activeStoryIndex}
              isViewed={i < activeStoryIndex}
              trackStyle={progressBarTrackStyle}
              fillStyle={progressBarFillStyle}
            />
          ))}
        </View>

        {renderHeader ? (
          <View style={[styles.customHeaderWrap, { top: insets.top + 22 }]} pointerEvents="box-none">
            {renderHeader({ user: activeUser, story: activeStory, onClose })}
          </View>
        ) : (
          <View style={[styles.header, headerStyle, { top: insets.top + 22 }]} pointerEvents="box-none">
            <Image source={{ uri: getUserAvatarUrl(activeUser) }} style={styles.headerAvatar} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.username, usernameStyle]}>{getUserName(activeUser)}</Text>
                <Text style={[styles.timestamp, timestampStyle]}>• 2h</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {showsOptionsIcon && (
                <Pressable onPress={handleOptions} style={{ padding: 8, marginRight: 4 }}>
                  <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
                </Pressable>
              )}
              <Pressable onPress={onClose} hitSlop={14} style={{ padding: 4 }}>
                <Ionicons name="close" size={28} color="#fff" />
              </Pressable>
            </View>
          </View>
        )}

        {renderCaption ? (
          renderCaption({ user: activeUser, story: activeStory })
        ) : (
          (activeStory as any).caption ? (
            <Animated.View
              entering={FadeIn.delay(200).duration(300)}
              exiting={FadeOut.duration(150)}
              style={styles.captionWrap}
              pointerEvents="none"
            >
              <Text style={styles.captionText}>{(activeStory as any).caption}</Text>
            </Animated.View>
          ) : null
        )}

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
          style={styles.footerContainer}
          pointerEvents="box-none"
        >
          {renderFooter ? (
            renderFooter({ user: activeUser, story: activeStory, onReply: setReplyText })
          ) : (
            <>
              <View style={styles.viewersWrap}>
                <Feather name="eye" size={12} color="rgba(255,255,255,0.8)" />
                <Text style={styles.viewersText}>{userIndex * 13 + activeStoryIndex * 7 + 42}</Text>
              </View>
              
              <View style={[styles.footer, footerStyle, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                {showsReplyInput && (
                  <View style={[styles.inputWrap, replyInputStyle]}>
                    <TextInput
                      style={styles.input}
                      placeholder="Send message..."
                      placeholderTextColor="rgba(255,255,255,0.7)"
                      value={replyText}
                      onChangeText={setReplyText}
                      onFocus={() => setPaused(true)}
                      onBlur={() => setPaused(false)}
                      onSubmitEditing={handleReplySubmit}
                      returnKeyType="send"
                    />
                  </View>
                )}
                {showsLikeIcon && (
                  <Pressable onPress={handleLike} style={styles.iconBtn}>
                    <Ionicons name="heart-outline" size={28} color="#fff" />
                  </Pressable>
                )}
                {showsShareIcon && (
                  <Pressable onPress={handleShare} style={styles.iconBtn}>
                    <Feather name="send" size={24} color="#fff" />
                  </Pressable>
                )}
              </View>
            </>
          )}
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  loaderWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  bars: {
    position: 'absolute',
    left: 10, right: 10,
    flexDirection: 'row',
    zIndex: 10,
  },
  scrimTop: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 140,
  },
  scrimBottom: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 160,
  },
  customHeaderWrap: {
    position: 'absolute',
    left: 0, right: 0,
    zIndex: 10,
  },
  header: {
    position: 'absolute',
    left: 12, right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  headerAvatar: {
    width: 34, height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: '#555',
  },
  username: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 1 },
  },
  timestamp: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '500',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 1 },
  },
  captionWrap: {
    position: 'absolute',
    bottom: 120,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 12,
    zIndex: 10,
  },
  captionText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    zIndex: 20,
  },
  viewersWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    marginBottom: 12,
  },
  viewersText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  inputWrap: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    backgroundColor: 'rgba(0,0,0,0.15)',
    paddingHorizontal: 18,
    justifyContent: 'center',
    marginRight: 14,
  },
  input: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '400',
    flex: 1,
  },
  iconBtn: {
    padding: 6,
    marginLeft: 6,
  },
});