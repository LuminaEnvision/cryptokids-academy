# 🎨 Lil Nouns Avatar Builder - Setup Guide

## ✅ What's Been Implemented

1. **Zustand Store** - Avatar state management with persistence
2. **Avatar Builder UI** - Full builder at `/kids/avatar`
3. **Avatar Display Component** - Shows avatar throughout app
4. **Layer Stacking** - Proper rendering order
5. **Integration** - Avatars in dashboard, profile, parent view
6. **Animations** - Floating, blinking, sparkles
7. **Reward Animations** - Avatar with border on rewards

## 📦 How to Add Lil Nouns Assets

### Step 1: Clone Your Forked Monorepo

You've already forked the monorepo at: https://github.com/LuminaEnvision/lilnouns-monorepo

Clone it:

```bash
git clone https://github.com/LuminaEnvision/lilnouns-monorepo.git
cd lilnouns-monorepo
```

### Step 2: Locate the Assets

The assets are in the `packages/nouns-assets` directory. Navigate there:

```bash
cd packages/nouns-assets
```

### Step 3: Copy Assets to Project

**Option A: Use the Helper Script (Recommended)**

We've created a helper script that will automatically find and copy the assets:

```bash
# From your Kiddo Wallet project directory
./scripts/copy-lilnouns-assets.sh /path/to/lilnouns-monorepo

# Example:
./scripts/copy-lilnouns-assets.sh ~/lilnouns-monorepo
```

**Option B: Manual Copy**

If you prefer to copy manually, first explore the structure:

```bash
# From the monorepo root
cd packages/nouns-assets
find . -name "*.png" -type f | head -20  # See where PNG files are
ls -la  # Check directory structure
```

Then copy based on where the images are located:

```bash
# If images are in packages/nouns-assets/images/
cp -r images/backgrounds/* "/Users/luminaenvision/Kiddo Wallet/public/lilnouns/backgrounds/"
cp -r images/bodies/* "/Users/luminaenvision/Kiddo Wallet/public/lilnouns/bodies/"
cp -r images/heads/* "/Users/luminaenvision/Kiddo Wallet/public/lilnouns/heads/"
cp -r images/glasses/* "/Users/luminaenvision/Kiddo Wallet/public/lilnouns/glasses/"
cp -r images/accessories/* "/Users/luminaenvision/Kiddo Wallet/public/lilnouns/accessories/"

# Or if images are in packages/nouns-assets/src/images/
cp -r src/images/backgrounds/* "/Users/luminaenvision/Kiddo Wallet/public/lilnouns/backgrounds/"
# ... etc
```

### Step 4: Add Custom MagicKids Traits

Create these custom trait images and add to `public/lilnouns/custom/`:

- `magic-wand.png` - Magic wand accessory
- `fairy-wings.png` - Fairy wings
- `sparkle.png` - Sparkle effect overlay
- `robot-antenna.png` - Robot antenna
- `dragon-horns.png` - Dragon horns

**Recommended specs:**
- Format: PNG with transparency
- Size: 320x320px or larger
- Style: Match Lil Nouns aesthetic

### Step 5: Update Trait Options

Once you have the assets, update `lib/avatar/avatarStore.ts`:

```typescript
export const TRAIT_OPTIONS = {
  backgrounds: ['cool', 'warm', 'purple', 'blue', 'green', 'red'], // Add actual filenames
  bodies: ['cool', 'warm', 'purple', 'blue', 'green', 'red'], // Add actual filenames
  heads: ['cool', 'warm', 'purple', 'blue', 'green', 'red'], // Add actual filenames
  glasses: ['none', 'cool', 'warm', 'purple', 'blue', 'green', 'red'], // Add actual filenames
  accessories: ['none', 'cool', 'warm', 'purple', 'blue', 'green', 'red'], // Add actual filenames
  magic: ['magic-wand', 'fairy-wings', 'sparkle', 'robot-antenna', 'dragon-horns'],
};
```

Replace the placeholder names with actual filenames from the assets (without `.png` extension).

## 🎮 Features

### Avatar Builder (`/kids/avatar`)
- Large avatar preview (250px)
- Category selector (Background, Body, Head, Glasses, Accessory, Magic)
- Trait options grid
- Randomize button
- "Make My Avatar Magic!" button (randomizes only magic traits)
- Save button with success animation

### Avatar Display
- Used throughout the app:
  - Kid dashboard (top)
  - Kid profile page
  - Parent dashboard (child info)
  - Reward animations (with border)

### Animations
- **Floating**: Gentle up/down motion
- **Blinking**: Subtle opacity animation
- **Sparkles**: Appear when traits change
- **Reward Border**: Animated gradient border on rewards

## 🔧 Technical Details

### State Management
- Uses Zustand with localStorage persistence
- Store key: `magicKidsAvatar`
- Automatically saves on trait changes

### Layer Order
1. Background (bottom)
2. Body
3. Head
4. Glasses
5. Accessory
6. Magic traits (multiple, top)

### Fallback
- If images are missing, shows emoji avatar
- Graceful error handling

## 📝 Notes

- Assets are loaded dynamically
- Images should be optimized (PNG format)
- Transparent backgrounds work best
- The app will work with placeholder emojis until assets are added

## 🚀 Next Steps

1. Fork the lilnouns-assets repo
2. Copy assets to `public/lilnouns/`
3. Create custom MagicKids traits
4. Update `TRAIT_OPTIONS` with actual filenames
5. Test the avatar builder!

---

**The avatar system is fully functional!** Just add the assets and update the trait options. 🎨✨

