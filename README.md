# React Native Insta Story Viewer

A highly customizable, production-ready, Instagram-like 3D cube story viewer for React Native and Expo. 

It handles complex 3D cube transitions, gestures, network loading states, and is fully typed with Generics so you can drop in your own data structures without mapping!

---

## 📸 Demo

### [▶️ Click here to watch the Video Demo!](https://drive.google.com/file/d/10CYhIMnRuh9ZJIFlowcf9JrUXqQrR_QZ/view)

<div align="center">
  <img src="https://drive.google.com/uc?export=view&id=1WqvTlQmDuW49mANXisAEU75_YcDuzl8r" alt="Story Viewer Demo" width="300" />
</div>

---

## 🚀 Installation

This package relies on a few peer dependencies (Reanimated, Gesture Handler) that you likely already have installed.

**1. Install the package:**
```bash
npm install react-native-insta-story-viewer
```

**2. Install Peer Dependencies (if you don't have them):**
```bash
npx expo install react-native-reanimated react-native-gesture-handler react-native-safe-area-context expo-linear-gradient expo-haptics @expo/vector-icons
```
*(Make sure you configure `react-native-reanimated` in your `babel.config.js`!)*

---

## 🛠️ Usage

The component uses **TypeScript Generics and Accessors** (just like `FlatList`). You pass your raw data array and tell the component how to extract the data it needs using functions like `getUserId`.

### Basic Example

```tsx
import React from 'react';
import { View } from 'react-native';
import { StoryTray } from 'react-native-insta-story-viewer';

// Your raw API data!
const myData = [
  {
    accountId: 'u1',
    handle: 'john_doe',
    profilePic: 'https://i.pravatar.cc/150?img=12',
    feed: [
      { id: 's1', image: 'https://images.unsplash.com/photo-1506905925346?w=800', ms: 5000 },
      { id: 's2', image: 'https://images.unsplash.com/photo-1511884642898?w=800', ms: 4000 },
    ],
  }
];

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 50 }}>
      <StoryTray
        users={myData}
        
        // 1. Tell the component how to read your data:
        getUserId={(u) => u.accountId}
        getUserAvatarUrl={(u) => u.profilePic}
        getUserName={(u) => u.handle}
        getUserStories={(u) => u.feed}
        
        getStoryId={(s) => s.id}
        getStoryMediaUrl={(s) => s.image}
        getStoryDuration={(s) => s.ms}

        // 2. Add some callbacks!
        onLikePress={(user, story) => console.log('Liked!', user.handle)}
        onReplySubmit={(user, story, text) => console.log('Reply:', text)}
      />
    </View>
  );
}
```

---

## ⚙️ Props & Configuration

### Data Accessors (Required)
Because the component is Generic (`<U, S>`), you must provide these functions to extract data:

| Prop | Type | Description |
|------|------|-------------|
| `getUserId` | `(user: U) => string` | Returns the unique ID for the user. |
| `getUserAvatarUrl` | `(user: U) => string` | Returns the profile picture URL. |
| `getUserName` | `(user: U) => string` | Returns the display name. |
| `getUserStories` | `(user: U) => S[]` | Returns the array of stories for the user. |
| `getStoryId` | `(story: S) => string` | Returns the unique ID for the story. |
| `getStoryMediaUrl` | `(story: S) => string` | Returns the image URL for the story. |

### Optional Accessors
| Prop | Type | Description |
|------|------|-------------|
| `getStoryDuration` | `(story: S) => number` | Story duration in ms. Falls back to `defaultStoryDuration`. |

### UI Configuration Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultStoryDuration` | `number` | `5000` | Default duration if story has none. |
| `unviewedRingColors` | `string[]` | `['#f09433', ...]` | Instagram-style gradient colors for the Avatar Ring. |
| `viewedRingColor` | `string` | `'#E0E0E0'` | Ring color when all stories are viewed. |
| `showsReplyInput` | `boolean` | `true` | Show/Hide the bottom reply text input. |
| `showsOptionsIcon` | `boolean` | `true` | Show/Hide the top right `⋮` menu icon. |
| `showsLikeIcon` | `boolean` | `true` | Show/Hide the bottom heart icon. |
| `showsShareIcon` | `boolean` | `true` | Show/Hide the bottom paper plane icon. |

### Callbacks (with Auto-Haptics 📳)
| Prop | Type | Description |
|------|------|-------------|
| `onReplySubmit` | `(user, story, text) => void` | Fired when the user submits a message in the input field. |
| `onLikePress` | `(user, story) => void` | Fired when the heart icon is tapped. |
| `onSharePress` | `(user, story) => void` | Fired when the share icon is tapped. |
| `onOptionsPress` | `(user, story) => void` | Fired when the `⋮` icon is tapped. |
| `onAllStoriesViewed` | `(userId: string) => void` | Fired when the user watches the very last story in the queue. |

---

## 🎨 Advanced Customization

You can inject styles to heavily customize the built-in layout:

```tsx
<StoryTray
  // ...
  usernameStyle={{ color: '#FFE0B2', fontSize: 16 }}
  progressBarFillStyle={{ backgroundColor: '#FF9800' }}
  replyInputStyle={{ borderColor: 'red' }}
/>
```

### Complete Render Overrides
If you need complete control, bypass our UI entirely using Render Props:
*   `renderAvatar`: Replace the circular tray avatars entirely.
*   `renderHeader`: Replace the top user info bar inside the viewer.
*   `renderFooter`: Replace the bottom interaction bar inside the viewer.

---

## Contributing
Pull requests are welcome!

## License
MIT
