# React Native Insta Story Viewer

A highly customizable, production-ready, Instagram-like 3D cube story viewer for React Native and Expo.

It handles complex 3D cube transitions, gestures, network loading states, and is fully typed with Generics so you can drop in your own data structures without mapping!

---

## 📸 Demo

<div align="center">
  <img src="https://drive.google.com/uc?export=view&id=10CYhIMnRuh9ZJIFlowcf9JrUXqQrR_QZ" alt="Story Viewer GIF Demo" width="300" />
</div>

<div align="center">
  <img src="https://drive.google.com/uc?export=view&id=1WqvTlQmDuW49mANXisAEU75_YcDuzl8r" alt="Story Viewer Demo" width="300" />
</div>

---

## 🚀 Installation

### 1. Install the package

```bash
npm install deeptech-react-native-stories
```

---

### 🟣 Expo (Managed & Bare Workflow)

Install all peer dependencies using the Expo CLI to ensure version compatibility:

```bash
npx expo install \
  react-native-reanimated \
  react-native-gesture-handler \
  react-native-safe-area-context \
  expo-linear-gradient \
  expo-haptics \
  expo-video \
  @expo/vector-icons
```

Then add the Reanimated Babel plugin to your `babel.config.js`:

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
```

> **Note:** `expo-video`, `expo-linear-gradient`, `expo-haptics`, and `@expo/vector-icons` are Expo-specific packages used internally by the library when running in an Expo environment.

---

### 🟢 React Native CLI (Bare / Pure RN)

Install peer dependencies using npm. The library uses React Native-native equivalents automatically (no Expo packages required):

```bash
npm install \
  react-native-reanimated@3.16.7 \
  react-native-gesture-handler@2.22.1 \
  react-native-safe-area-context \
  react-native-linear-gradient \
  react-native-haptic-feedback \
  react-native-video \
  react-native-vector-icons
```

> **Important version constraints for React Native 0.76.x:**
> - `react-native-reanimated@3.16.7` (Reanimated 4.x requires RN 0.77+)
> - `react-native-gesture-handler@2.22.1` (2.20.x lacks Fabric APIs; 2.31.x targets RN 0.77+)

Then configure `babel.config.js`:

```js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['react-native-reanimated/plugin'],
};
```

Then link native dependencies (for RN 0.60+ auto-linking handles most, but `react-native-vector-icons` may need manual setup):

```bash
# Android: add to android/app/build.gradle
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

---

## 🛠️ Usage

Wrap your root component with `SafeAreaProvider` and `GestureHandlerRootView` — both Expo and CLI require this:

```tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StoryTray } from 'deeptech-react-native-stories';

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StoryTray
          users={myData}
          getUserId={(u) => u.accountId}
          getUserAvatarUrl={(u) => u.profilePic}
          getUserName={(u) => u.handle}
          getUserStories={(u) => u.feed}
          getStoryId={(s) => s.id}
          getStoryMediaUrl={(s) => s.image}
          getStoryDuration={(s) => s.ms}
        />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
```

The component uses **TypeScript Generics and Accessors** (just like `FlatList`). You pass your raw data array and tell the component how to extract the data it needs using accessor functions — no data mapping required!

### Basic Example (with raw API data)

```tsx
import React from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StoryTray } from 'deeptech-react-native-stories';

// Your raw API data — no transformation needed!
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
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 50 }}>
          <StoryTray
            users={myData}

            // Tell the component how to read your data:
            getUserId={(u) => u.accountId}
            getUserAvatarUrl={(u) => u.profilePic}
            getUserName={(u) => u.handle}
            getUserStories={(u) => u.feed}

            getStoryId={(s) => s.id}
            getStoryMediaUrl={(s) => s.image}
            getStoryDuration={(s) => s.ms}

            // Add callbacks:
            onLikePress={(user, story) => console.log('Liked!', user.handle)}
            onReplySubmit={(user, story, text) => console.log('Reply:', text)}
          />
        </View>
      </GestureHandlerRootView>
    </SafeAreaProvider>
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
| `getStoryMediaUrl` | `(story: S) => string` | Returns the image/video URL for the story. |

### Optional Accessors
| Prop | Type | Description |
|------|------|-------------|
| `getStoryDuration` | `(story: S) => number` | Story duration in ms. Falls back to `defaultStoryDuration`. |
| `getStoryMediaType` | `(story: S) => 'image' \| 'video'` | Tells the viewer if it should render an image or play a video. |

### UI Configuration Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `animationType` | `'cube' \| 'slide'` | `'cube'` | The transition animation style between different users. |
| `defaultStoryDuration` | `number` | `5000` | Default duration if story has none. |
| `maxVideoDuration` | `number` | `30000` | Maximum cap (in ms) for video stories before progressing. |
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
