import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useViewedStories } from '../hooks/useViewedStories';
import { StoryTrayProps } from '../types';
import { AvatarRing } from './AvatarRing';
import { StoryViewer } from './StoryViewer';

export function StoryTray<U, S>({
  users,
  viewedStoryIds = [],
  unviewedRingColors = ['#f09433', '#e6683c', '#dc2743', '#cc2366', '#bc1888'],
  viewedRingColor = '#E0E0E0',
  avatarSize = 68,
  trayBackgroundColor = '#fff',
  defaultStoryDuration = 5000,
  showsReplyInput = true,
  showsOptionsIcon = true,
  showsLikeIcon = true,
  showsShareIcon = true,
  renderAvatar,
  getUserId,
  getUserAvatarUrl,
  getUserName,
  getUserStories,
  getStoryId,
  getStoryMediaUrl,
  getStoryMediaType,
  getStoryDuration,
  
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

  onStoryOpen,
  onStoryView,
  onStoryClose,
  onAllStoriesViewed,
}: StoryTrayProps<U, S>) {
  const { viewedIds, markViewed, isUserFullyViewed } = useViewedStories(viewedStoryIds);
  const [activeUser, setActiveUser] = useState<U | null>(null);
  const [visible, setVisible] = useState(false);

  const openStory = useCallback((user: U) => {
    setActiveUser(user);
    setVisible(true);
  }, []);

  const closeStory = useCallback(() => {
    setVisible(false);
    if (activeUser) onStoryClose?.(getUserId(activeUser));
  }, [activeUser, onStoryClose, getUserId]);

  return (
    <View style={{ backgroundColor: trayBackgroundColor }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {users.map((user) => {
          const uid = getUserId(user);
          const stories = getUserStories(user);
          const isViewed = isUserFullyViewed(stories.map(getStoryId));

          if (renderAvatar) {
            return (
              <View key={uid}>
                {renderAvatar({ user, isViewed, onPress: openStory })}
              </View>
            );
          }

          return (
            <AvatarRing<U, S>
              key={uid}
              user={user}
              isViewed={isViewed}
              size={avatarSize}
              unviewedColors={unviewedRingColors}
              viewedColor={viewedRingColor}
              onPress={openStory}
              getUserAvatarUrl={getUserAvatarUrl}
              getUserName={getUserName}
            />
          );
        })}
      </ScrollView>

      {activeUser && (
        <StoryViewer<U, S>
          users={users}
          initialUserId={getUserId(activeUser)}
          visible={visible}
          onClose={closeStory}
          viewedStoryIds={viewedIds}
          onMarkViewed={markViewed}
          
          getUserId={getUserId}
          getUserAvatarUrl={getUserAvatarUrl}
          getUserName={getUserName}
          getUserStories={getUserStories}
          getStoryId={getStoryId}
          getStoryMediaUrl={getStoryMediaUrl}
          getStoryMediaType={getStoryMediaType}
          getStoryDuration={getStoryDuration}
          defaultStoryDuration={defaultStoryDuration}

          showsReplyInput={showsReplyInput}
          showsOptionsIcon={showsOptionsIcon}
          showsLikeIcon={showsLikeIcon}
          showsShareIcon={showsShareIcon}

          onReplySubmit={onReplySubmit}
          onLikePress={onLikePress}
          onSharePress={onSharePress}
          onOptionsPress={onOptionsPress}

          headerStyle={headerStyle}
          usernameStyle={usernameStyle}
          timestampStyle={timestampStyle}
          footerStyle={footerStyle}
          replyInputStyle={replyInputStyle}
          progressBarTrackStyle={progressBarTrackStyle}
          progressBarFillStyle={progressBarFillStyle}

          onStoryOpen={onStoryOpen}
          onStoryView={onStoryView}
          onStoryClose={onStoryClose}
          onAllStoriesViewed={onAllStoriesViewed}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
});
