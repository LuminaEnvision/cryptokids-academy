#!/bin/bash

# Script to copy Lil Nouns assets from forked monorepo to Kiddo Wallet project
# Usage: ./scripts/copy-lilnouns-assets.sh /path/to/lilnouns-monorepo

if [ -z "$1" ]; then
    echo "Usage: $0 /path/to/lilnouns-monorepo"
    echo "Example: $0 ~/lilnouns-monorepo"
    exit 1
fi

MONOREPO_PATH="$1"
ASSETS_PATH="$MONOREPO_PATH/packages/nouns-assets"
PROJECT_PATH="$(cd "$(dirname "$0")/.." && pwd)"

echo "📦 Copying Lil Nouns assets..."
echo "Source: $ASSETS_PATH"
echo "Destination: $PROJECT_PATH/public/lilnouns/"

# Check if monorepo path exists
if [ ! -d "$MONOREPO_PATH" ]; then
    echo "❌ Error: Monorepo path not found: $MONOREPO_PATH"
    exit 1
fi

# Check if assets path exists
if [ ! -d "$ASSETS_PATH" ]; then
    echo "❌ Error: Assets path not found: $ASSETS_PATH"
    echo "💡 Try: cd $MONOREPO_PATH && find . -name '*.png' -type f | head -5"
    exit 1
fi

# Find images directory (could be in different locations)
IMAGES_DIR=""
VERSION="v0"  # Default to v0, can be changed

if [ -d "$ASSETS_PATH/images/$VERSION" ]; then
    IMAGES_DIR="$ASSETS_PATH/images/$VERSION"
elif [ -d "$ASSETS_PATH/images" ]; then
    IMAGES_DIR="$ASSETS_PATH/images"
    # Check if it has version subdirectories
    if [ -d "$IMAGES_DIR/v0" ]; then
        echo "📦 Found versioned assets, using v0"
        IMAGES_DIR="$IMAGES_DIR/v0"
    fi
elif [ -d "$ASSETS_PATH/src/images" ]; then
    IMAGES_DIR="$ASSETS_PATH/src/images"
elif [ -d "$ASSETS_PATH/assets/images" ]; then
    IMAGES_DIR="$ASSETS_PATH/assets/images"
else
    echo "⚠️  Warning: Could not find images directory"
    echo "📁 Searching for PNG files..."
    find "$ASSETS_PATH" -name "*.png" -type f | head -10
    echo ""
    echo "Please specify the images directory path:"
    read -p "Images directory path: " IMAGES_DIR
fi

if [ ! -d "$IMAGES_DIR" ]; then
    echo "❌ Error: Images directory not found: $IMAGES_DIR"
    exit 1
fi

echo "✅ Found images at: $IMAGES_DIR"
echo ""

# Create destination directories
mkdir -p "$PROJECT_PATH/public/lilnouns/backgrounds"
mkdir -p "$PROJECT_PATH/public/lilnouns/bodies"
mkdir -p "$PROJECT_PATH/public/lilnouns/heads"
mkdir -p "$PROJECT_PATH/public/lilnouns/glasses"
mkdir -p "$PROJECT_PATH/public/lilnouns/accessories"
mkdir -p "$PROJECT_PATH/public/lilnouns/custom"

# Copy assets
echo "📋 Copying assets..."

# Handle numbered folders (0-backgrounds, 1-bodies, 2-accessories, 3-heads, 4-glasses)
copy_category() {
    local folder_pattern=$1
    local dest_name=$2
    
    # Find folder matching pattern
    local found_folder=""
    for dir in "$IMAGES_DIR"/*; do
        if [ -d "$dir" ] && [[ "$(basename "$dir")" == *"$folder_pattern"* ]]; then
            found_folder="$dir"
            break
        fi
    done
    
    if [ -n "$found_folder" ]; then
        cp -r "$found_folder"/* "$PROJECT_PATH/public/lilnouns/$dest_name/" 2>/dev/null
        echo "✅ Copied $dest_name from $(basename "$found_folder")"
    else
        echo "⚠️  Could not find folder matching *$folder_pattern*"
    fi
}

copy_category "background" "backgrounds"
copy_category "bodies" "bodies"
copy_category "accessories" "accessories"
copy_category "heads" "heads"
copy_category "glasses" "glasses"

echo ""
echo "🎉 Assets copied successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Check the copied files: ls public/lilnouns/*/"
echo "2. Update TRAIT_OPTIONS in lib/avatar/avatarStore.ts with actual filenames"
echo "3. Create custom MagicKids traits in public/lilnouns/custom/"

