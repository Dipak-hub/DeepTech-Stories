"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryViewer = StoryViewer;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const react_native_reanimated_1 = __importStar(require("react-native-reanimated"));
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const vector_icons_1 = require("@expo/vector-icons");
const expo_linear_gradient_1 = require("expo-linear-gradient");
const Haptics = __importStar(require("expo-haptics"));
const useStoryProgress_1 = require("../hooks/useStoryProgress");
const ProgressBar_1 = require("./ProgressBar");
const { width: W, height: H } = react_native_1.Dimensions.get('window');
const DEFAULT_DUR = 5000;
function CubeUser({ user, storyIndex, i, scrollX, getUserStories, getStoryMediaUrl, onLoad, }) {
    const animatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => {
        const offset = scrollX.value - i * W;
        const opacity = Math.abs(offset) >= W ? 0 : 1;
        const rotateY = (0, react_native_reanimated_1.interpolate)(offset, [-W, 0, W], [90, 0, -90], react_native_reanimated_1.Extrapolation.CLAMP);
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
    if (!story)
        return null;
    return (<react_native_reanimated_1.default.View style={[react_native_1.StyleSheet.absoluteFill, animatedStyle]} pointerEvents="none">
      <react_native_1.Image source={{ uri: getStoryMediaUrl(story) }} style={react_native_1.StyleSheet.absoluteFill} resizeMode="cover" onLoad={() => {
            // Add slight delay to ensure render is fully complete before starting progress
            setTimeout(onLoad, 50);
        }}/>
      <expo_linear_gradient_1.LinearGradient colors={['rgba(0,0,0,0.6)', 'transparent']} style={styles.scrimTop} pointerEvents="none"/>
      <expo_linear_gradient_1.LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.scrimBottom} pointerEvents="none"/>
    </react_native_reanimated_1.default.View>);
}
function StoryViewer({ users, initialUserId, visible, onClose, viewedStoryIds = [], onMarkViewed, onStoryOpen, onStoryView, onStoryClose, onAllStoriesViewed, getUserId, getUserAvatarUrl, getUserName, getUserStories, getStoryId, getStoryMediaUrl, getStoryDuration, defaultStoryDuration = 5000, showsReplyInput = true, showsOptionsIcon = true, showsLikeIcon = true, showsShareIcon = true, onReplySubmit, onLikePress, onSharePress, onOptionsPress, headerStyle, usernameStyle, timestampStyle, footerStyle, replyInputStyle, progressBarTrackStyle, progressBarFillStyle, renderHeader, renderFooter, renderCaption, }) {
    const insets = (0, react_native_safe_area_context_1.useSafeAreaInsets)();
    const [userIndex, setUserIndex] = (0, react_1.useState)(0);
    const [storyIndices, setStoryIndices] = (0, react_1.useState)({});
    const [paused, setPaused] = (0, react_1.useState)(false);
    const [replyText, setReplyText] = (0, react_1.useState)('');
    const [isMediaLoaded, setIsMediaLoaded] = (0, react_1.useState)(false);
    const scrollX = (0, react_native_reanimated_1.useSharedValue)(0);
    const p0 = (0, react_native_reanimated_1.useSharedValue)(0);
    const p1 = (0, react_native_reanimated_1.useSharedValue)(0);
    const p2 = (0, react_native_reanimated_1.useSharedValue)(0);
    const p3 = (0, react_native_reanimated_1.useSharedValue)(0);
    const p4 = (0, react_native_reanimated_1.useSharedValue)(0);
    const p5 = (0, react_native_reanimated_1.useSharedValue)(0);
    const p6 = (0, react_native_reanimated_1.useSharedValue)(0);
    const p7 = (0, react_native_reanimated_1.useSharedValue)(0);
    const p8 = (0, react_native_reanimated_1.useSharedValue)(0);
    const p9 = (0, react_native_reanimated_1.useSharedValue)(0);
    const allProgress = (0, react_1.useRef)([p0, p1, p2, p3, p4, p5, p6, p7, p8, p9]);
    const activeUser = users[userIndex];
    const activeUserId = activeUser ? getUserId(activeUser) : '';
    const activeUserStories = activeUser ? getUserStories(activeUser) : [];
    const activeStoryIndex = activeUserId ? (storyIndices[activeUserId] || 0) : 0;
    const activeStory = activeUserStories[activeStoryIndex];
    const duration = activeStory ? (getStoryDuration?.(activeStory) ?? defaultStoryDuration) : defaultStoryDuration;
    const updateStoryIndex = (0, react_1.useCallback)((uid, newIdx) => {
        setStoryIndices(prev => ({ ...prev, [uid]: newIdx }));
    }, []);
    const goNext = (0, react_1.useCallback)(() => {
        if (!activeUser || !activeUserId)
            return;
        if (activeStoryIndex < activeUserStories.length - 1) {
            allProgress.current[activeStoryIndex].value = 1;
            updateStoryIndex(activeUserId, activeStoryIndex + 1);
        }
        else {
            if (userIndex < users.length - 1) {
                const nextUserIdx = userIndex + 1;
                scrollX.value = (0, react_native_reanimated_1.withTiming)(nextUserIdx * W, { duration: 300 });
                setUserIndex(nextUserIdx);
            }
            else {
                onAllStoriesViewed?.(activeUserId);
                onClose();
            }
        }
    }, [activeUser, activeUserId, activeUserStories.length, activeStoryIndex, userIndex, users.length, scrollX, onClose, onAllStoriesViewed, updateStoryIndex]);
    const goPrev = (0, react_1.useCallback)(() => {
        if (!activeUser || !activeUserId)
            return;
        if (activeStoryIndex > 0) {
            allProgress.current[activeStoryIndex].value = 0;
            allProgress.current[activeStoryIndex - 1].value = 0;
            updateStoryIndex(activeUserId, activeStoryIndex - 1);
        }
        else {
            if (userIndex > 0) {
                const prevUserIdx = userIndex - 1;
                scrollX.value = (0, react_native_reanimated_1.withTiming)(prevUserIdx * W, { duration: 300 });
                setUserIndex(prevUserIdx);
            }
        }
    }, [activeUser, activeUserId, activeStoryIndex, userIndex, scrollX, updateStoryIndex]);
    const { progress, start } = (0, useStoryProgress_1.useStoryProgress)({
        duration,
        paused: paused || !isMediaLoaded,
        onComplete: goNext,
    });
    (0, react_1.useEffect)(() => {
        if (activeUser && activeStoryIndex < allProgress.current.length) {
            allProgress.current[activeStoryIndex] = progress;
        }
    }, [activeUser, activeStoryIndex, progress]);
    (0, react_1.useEffect)(() => {
        if (visible && users.length > 0) {
            let initIdx = users.findIndex(u => getUserId(u) === initialUserId);
            if (initIdx === -1)
                initIdx = 0;
            setUserIndex(initIdx);
            scrollX.value = initIdx * W;
            setReplyText('');
            setIsMediaLoaded(false);
            onStoryOpen?.(getUserId(users[initIdx]));
        }
    }, [visible, initialUserId, users, getUserId]);
    (0, react_1.useEffect)(() => {
        if (!visible || !activeStory || !activeUser)
            return;
        setIsMediaLoaded(false);
        const sid = getStoryId(activeStory);
        const uid = getUserId(activeUser);
        onMarkViewed?.(sid);
        onStoryView?.(uid, sid);
        activeUserStories.forEach((s, i) => {
            const isV = viewedStoryIds.includes(getStoryId(s));
            if (i < activeStoryIndex)
                allProgress.current[i].value = 1;
            else if (i > activeStoryIndex)
                allProgress.current[i].value = isV ? 1 : 0;
            else
                allProgress.current[i].value = 0;
        });
        start();
    }, [userIndex, activeStoryIndex, visible, activeStory, activeUser, activeUserStories, getStoryId, getUserId, viewedStoryIds]);
    const isPanning = (0, react_native_reanimated_1.useSharedValue)(false);
    const pan = react_native_gesture_handler_1.Gesture.Pan()
        .activeOffsetX([-10, 10])
        .onStart(() => {
        isPanning.value = true;
        (0, react_native_reanimated_1.runOnJS)(setPaused)(true);
    })
        .onUpdate((e) => {
        scrollX.value = userIndex * W - e.translationX;
    })
        .onEnd((e) => {
        isPanning.value = false;
        (0, react_native_reanimated_1.runOnJS)(setPaused)(false);
        const targetScrollX = userIndex * W - e.translationX - e.velocityX * 0.2;
        let nextIdx = Math.round(targetScrollX / W);
        nextIdx = Math.max(0, Math.min(users.length - 1, nextIdx));
        scrollX.value = (0, react_native_reanimated_1.withTiming)(nextIdx * W, { duration: 300 });
        if (nextIdx !== userIndex) {
            (0, react_native_reanimated_1.runOnJS)(setIsMediaLoaded)(false);
            (0, react_native_reanimated_1.runOnJS)(setUserIndex)(nextIdx);
        }
    });
    const swipeDown = react_native_gesture_handler_1.Gesture.Pan()
        .activeOffsetY(10)
        .onEnd((e) => {
        if (e.translationY > 80 && Math.abs(e.translationX) < 50) {
            (0, react_native_reanimated_1.runOnJS)(onClose)();
        }
    });
    const longPress = react_native_gesture_handler_1.Gesture.LongPress()
        .minDuration(180)
        .onStart(() => (0, react_native_reanimated_1.runOnJS)(setPaused)(true))
        .onEnd(() => (0, react_native_reanimated_1.runOnJS)(setPaused)(false));
    const tap = react_native_gesture_handler_1.Gesture.Tap()
        .maxDuration(200)
        .onEnd((e) => {
        if (isPanning.value)
            return;
        if (e.y > H - 120)
            return;
        if (e.x < W / 3)
            (0, react_native_reanimated_1.runOnJS)(goPrev)();
        else
            (0, react_native_reanimated_1.runOnJS)(goNext)();
    });
    const gesture = react_native_gesture_handler_1.Gesture.Simultaneous(react_native_gesture_handler_1.Gesture.Race(pan, swipeDown), react_native_gesture_handler_1.Gesture.Race(longPress, tap));
    const handleLike = (0, react_1.useCallback)(() => {
        if (!activeUser || !activeStory)
            return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onLikePress?.(activeUser, activeStory);
    }, [activeUser, activeStory, onLikePress]);
    const handleShare = (0, react_1.useCallback)(() => {
        if (!activeUser || !activeStory)
            return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onSharePress?.(activeUser, activeStory);
    }, [activeUser, activeStory, onSharePress]);
    const handleOptions = (0, react_1.useCallback)(() => {
        if (!activeUser || !activeStory)
            return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onOptionsPress?.(activeUser, activeStory);
    }, [activeUser, activeStory, onOptionsPress]);
    const handleReplySubmit = (0, react_1.useCallback)(() => {
        if (!activeUser || !activeStory || !replyText.trim())
            return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onReplySubmit?.(activeUser, activeStory, replyText);
        setReplyText('');
        setPaused(false);
    }, [activeUser, activeStory, replyText, onReplySubmit]);
    if (!activeStory || !activeUser)
        return null;
    return (<react_native_1.Modal visible={visible} transparent={false} animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <react_native_1.StatusBar hidden/>
      <react_native_1.View style={styles.root}>
        <react_native_gesture_handler_1.GestureDetector gesture={gesture}>
          <react_native_1.View style={react_native_1.StyleSheet.absoluteFill}>
            {users.map((u, i) => (<CubeUser key={getUserId(u)} user={u} storyIndex={storyIndices[getUserId(u)] || 0} i={i} scrollX={scrollX} getUserStories={getUserStories} getStoryMediaUrl={getStoryMediaUrl} onLoad={() => {
                if (i === userIndex) {
                    setIsMediaLoaded(true);
                }
            }}/>))}
            <react_native_1.View style={react_native_1.StyleSheet.absoluteFill}/>
          </react_native_1.View>
        </react_native_gesture_handler_1.GestureDetector>

        {!isMediaLoaded && (<react_native_1.View style={styles.loaderWrap} pointerEvents="none">
            <react_native_1.ActivityIndicator size="large" color="#fff"/>
          </react_native_1.View>)}

        <react_native_1.View style={[styles.bars, { top: insets.top + 8 }]} pointerEvents="none">
          {activeUserStories.map((s, i) => (<ProgressBar_1.ProgressBar key={getStoryId(s)} progress={allProgress.current[i]} isActive={i === activeStoryIndex} isViewed={i < activeStoryIndex} trackStyle={progressBarTrackStyle} fillStyle={progressBarFillStyle}/>))}
        </react_native_1.View>

        {renderHeader ? (<react_native_1.View style={[styles.customHeaderWrap, { top: insets.top + 22 }]} pointerEvents="box-none">
            {renderHeader({ user: activeUser, story: activeStory, onClose })}
          </react_native_1.View>) : (<react_native_1.View style={[styles.header, headerStyle, { top: insets.top + 22 }]} pointerEvents="box-none">
            <react_native_1.Image source={{ uri: getUserAvatarUrl(activeUser) }} style={styles.headerAvatar}/>
            <react_native_1.View style={{ flex: 1, marginLeft: 10 }}>
              <react_native_1.View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <react_native_1.Text style={[styles.username, usernameStyle]}>{getUserName(activeUser)}</react_native_1.Text>
                <react_native_1.Text style={[styles.timestamp, timestampStyle]}>• 2h</react_native_1.Text>
              </react_native_1.View>
            </react_native_1.View>
            <react_native_1.View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {showsOptionsIcon && (<react_native_1.Pressable onPress={handleOptions} style={{ padding: 8, marginRight: 4 }}>
                  <vector_icons_1.Ionicons name="ellipsis-vertical" size={20} color="#fff"/>
                </react_native_1.Pressable>)}
              <react_native_1.Pressable onPress={onClose} hitSlop={14} style={{ padding: 4 }}>
                <vector_icons_1.Ionicons name="close" size={28} color="#fff"/>
              </react_native_1.Pressable>
            </react_native_1.View>
          </react_native_1.View>)}

        {renderCaption ? (renderCaption({ user: activeUser, story: activeStory })) : (activeStory.caption ? (<react_native_reanimated_1.default.View entering={react_native_reanimated_1.FadeIn.delay(200).duration(300)} exiting={react_native_reanimated_1.FadeOut.duration(150)} style={styles.captionWrap} pointerEvents="none">
              <react_native_1.Text style={styles.captionText}>{activeStory.caption}</react_native_1.Text>
            </react_native_reanimated_1.default.View>) : null)}

        <react_native_1.KeyboardAvoidingView behavior={react_native_1.Platform.OS === 'ios' ? 'padding' : undefined} style={styles.footerContainer} pointerEvents="box-none">
          {renderFooter ? (renderFooter({ user: activeUser, story: activeStory, onReply: setReplyText })) : (<>
              <react_native_1.View style={styles.viewersWrap}>
                <vector_icons_1.Feather name="eye" size={12} color="rgba(255,255,255,0.8)"/>
                <react_native_1.Text style={styles.viewersText}>{userIndex * 13 + activeStoryIndex * 7 + 42}</react_native_1.Text>
              </react_native_1.View>
              
              <react_native_1.View style={[styles.footer, footerStyle, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                {showsReplyInput && (<react_native_1.View style={[styles.inputWrap, replyInputStyle]}>
                    <react_native_1.TextInput style={styles.input} placeholder="Send message..." placeholderTextColor="rgba(255,255,255,0.7)" value={replyText} onChangeText={setReplyText} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)} onSubmitEditing={handleReplySubmit} returnKeyType="send"/>
                  </react_native_1.View>)}
                {showsLikeIcon && (<react_native_1.Pressable onPress={handleLike} style={styles.iconBtn}>
                    <vector_icons_1.Ionicons name="heart-outline" size={28} color="#fff"/>
                  </react_native_1.Pressable>)}
                {showsShareIcon && (<react_native_1.Pressable onPress={handleShare} style={styles.iconBtn}>
                    <vector_icons_1.Feather name="send" size={24} color="#fff"/>
                  </react_native_1.Pressable>)}
              </react_native_1.View>
            </>)}
        </react_native_1.KeyboardAvoidingView>
      </react_native_1.View>
    </react_native_1.Modal>);
}
const styles = react_native_1.StyleSheet.create({
    root: { flex: 1, backgroundColor: '#000' },
    loaderWrap: {
        ...react_native_1.StyleSheet.absoluteFillObject,
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
