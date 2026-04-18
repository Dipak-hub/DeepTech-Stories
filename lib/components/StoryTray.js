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
exports.StoryTray = StoryTray;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const useViewedStories_1 = require("../hooks/useViewedStories");
const AvatarRing_1 = require("./AvatarRing");
const StoryViewer_1 = require("./StoryViewer");
function StoryTray({ users, viewedStoryIds = [], unviewedRingColors = ['#f09433', '#e6683c', '#dc2743', '#cc2366', '#bc1888'], viewedRingColor = '#E0E0E0', avatarSize = 68, trayBackgroundColor = '#fff', defaultStoryDuration = 5000, showsReplyInput = true, showsOptionsIcon = true, showsLikeIcon = true, showsShareIcon = true, renderAvatar, getUserId, getUserAvatarUrl, getUserName, getUserStories, getStoryId, getStoryMediaUrl, getStoryMediaType, getStoryDuration, onReplySubmit, onLikePress, onSharePress, onOptionsPress, headerStyle, usernameStyle, timestampStyle, footerStyle, replyInputStyle, progressBarTrackStyle, progressBarFillStyle, onStoryOpen, onStoryView, onStoryClose, onAllStoriesViewed, }) {
    const { viewedIds, markViewed, isUserFullyViewed } = (0, useViewedStories_1.useViewedStories)(viewedStoryIds);
    const [activeUser, setActiveUser] = (0, react_1.useState)(null);
    const [visible, setVisible] = (0, react_1.useState)(false);
    const openStory = (0, react_1.useCallback)((user) => {
        setActiveUser(user);
        setVisible(true);
    }, []);
    const closeStory = (0, react_1.useCallback)(() => {
        setVisible(false);
        if (activeUser)
            onStoryClose?.(getUserId(activeUser));
    }, [activeUser, onStoryClose, getUserId]);
    return (<react_native_1.View style={{ backgroundColor: trayBackgroundColor }}>
      <react_native_1.ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {users.map((user) => {
            const uid = getUserId(user);
            const stories = getUserStories(user);
            const isViewed = isUserFullyViewed(stories.map(getStoryId));
            if (renderAvatar) {
                return (<react_native_1.View key={uid}>
                {renderAvatar({ user, isViewed, onPress: openStory })}
              </react_native_1.View>);
            }
            return (<AvatarRing_1.AvatarRing key={uid} user={user} isViewed={isViewed} size={avatarSize} unviewedColors={unviewedRingColors} viewedColor={viewedRingColor} onPress={openStory} getUserAvatarUrl={getUserAvatarUrl} getUserName={getUserName}/>);
        })}
      </react_native_1.ScrollView>

      {activeUser && (<StoryViewer_1.StoryViewer users={users} initialUserId={getUserId(activeUser)} visible={visible} onClose={closeStory} viewedStoryIds={viewedIds} onMarkViewed={markViewed} getUserId={getUserId} getUserAvatarUrl={getUserAvatarUrl} getUserName={getUserName} getUserStories={getUserStories} getStoryId={getStoryId} getStoryMediaUrl={getStoryMediaUrl} getStoryMediaType={getStoryMediaType} getStoryDuration={getStoryDuration} defaultStoryDuration={defaultStoryDuration} showsReplyInput={showsReplyInput} showsOptionsIcon={showsOptionsIcon} showsLikeIcon={showsLikeIcon} showsShareIcon={showsShareIcon} onReplySubmit={onReplySubmit} onLikePress={onLikePress} onSharePress={onSharePress} onOptionsPress={onOptionsPress} headerStyle={headerStyle} usernameStyle={usernameStyle} timestampStyle={timestampStyle} footerStyle={footerStyle} replyInputStyle={replyInputStyle} progressBarTrackStyle={progressBarTrackStyle} progressBarFillStyle={progressBarFillStyle} onStoryOpen={onStoryOpen} onStoryView={onStoryView} onStoryClose={onStoryClose} onAllStoriesViewed={onAllStoriesViewed}/>)}
    </react_native_1.View>);
}
const styles = react_native_1.StyleSheet.create({
    scroll: {
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
});
