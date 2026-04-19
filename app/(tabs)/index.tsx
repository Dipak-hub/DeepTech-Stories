import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StoryTray, DefaultStoryUser } from 'deeptech-react-native-stories';

const STORIES: DefaultStoryUser[] = [
  {
    id: 'u1',
    username: 'dipak_k',
    avatarUri: 'https://i.pravatar.cc/150?img=12',
    stories: [
      {
        id: 's1a',
        uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        duration: 6000,
        title: 'Mountain Vibes 🏔️',
        caption: 'Nothing beats the sunrise from 4000m',
      },
      {
        id: 's1b',
        uri: 'https://res.cloudinary.com/demo/video/upload/dog.mp4',
        duration: 15000,
        caption: 'Awesome video! 🎬',
        mediaType: 'video',
      },
    ],
  },
  {
    id: 'u2',
    username: 'anika.dev',
    avatarUri: 'https://i.pravatar.cc/150?img=5',
    stories: [
      {
        id: 's2a',
        uri: 'https://res.cloudinary.com/demo/video/upload/cld-sample-video.mp4',
        duration: 5000,
        title: 'Golden hour ✨',
        mediaType: 'video',
      },
      {
        id: 's2b',
        uri: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800',
        duration: 4000,
      },
    ],
  },
  {
    id: 'u3',
    username: 'rohan.tsx',
    avatarUri: 'https://i.pravatar.cc/150?img=33',
    stories: [
      {
        id: 's3a',
        uri: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800',
        caption: 'Weekend hike 🌿',
      },
      {
        id: 's3b',
        uri: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800',
        caption: 'Made it to the top 🎉',
      },
    ],
  },
  {
    id: 'u4',
    username: 'megha.ui',
    avatarUri: 'https://i.pravatar.cc/150?img=47',
    stories: [
      {
        id: 's4a',
        uri: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
        duration: 7000,
        title: 'Travel diary 🗺️',
      },
    ],
  },
  {
    id: 'u5',
    username: 'kiran.rn',
    avatarUri: 'https://i.pravatar.cc/150?img=60',
    stories: [
      {
        id: 's5a',
        uri: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800',
        duration: 5000,
        caption: 'Early morning 🌅',
      },
    ],
  },
];

export default function HomeScreen() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={styles.screen}>
          <Text style={styles.heading}>Stories</Text>
          <View style={styles.divider} />
          <StoryTray
            users={STORIES}
            viewedStoryIds={[]}
            showsLikeIcon={true}
            showsShareIcon={true}
            showsReplyInput={true}
            getUserId={(u) => u.id}
            getUserAvatarUrl={(u) => u.avatarUri}
            getUserName={(u) => u.username}
            getUserStories={(u) => u.stories}
            getStoryId={(s) => s.id}
            getStoryMediaUrl={(s) => s.uri}
            getStoryMediaType={(s) => s.mediaType}
            getStoryDuration={(s) => s.duration}
            defaultStoryDuration={5000} // Custom fallback duration
            animationType="slide"

            unviewedRingColors={['#f09433', '#e6683c', '#dc2743', '#cc2366', '#bc1888']}
            viewedRingColor="#E0E0E0"
            avatarSize={68}
            onStoryView={(uid, sid) => console.log('viewed:', uid, sid)}
            onAllStoriesViewed={(uid) => console.log('all done:', uid)}

            onLikePress={(u, s) => console.log('Liked:', u.username, s.id)}
            onSharePress={(u, s) => console.log('Shared:', u.username, s.id)}
            onOptionsPress={(u, s) => console.log('Options:', u.username, s.id)}
            onReplySubmit={(u, s, text) => console.log('Reply sent to', u.username, ':', text)}

            // Example of granular style overrides
            usernameStyle={{ color: '#FFE0B2', fontSize: 16 }}
            progressBarFillStyle={{ backgroundColor: '#FF9800' }}
          />
          <View style={styles.divider} />
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 56,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    paddingHorizontal: 16,
    marginBottom: 4,
    color: '#111',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E0E0E0',
  },
});
