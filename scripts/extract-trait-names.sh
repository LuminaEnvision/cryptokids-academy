#!/bin/bash

# Extract trait names from copied assets
# This helps update TRAIT_OPTIONS in avatarStore.ts

PROJECT_PATH="$(cd "$(dirname "$0")/.." && pwd)"

echo "📋 Extracting trait names from assets..."
echo ""

echo "=== Backgrounds ==="
ls "$PROJECT_PATH/public/lilnouns/backgrounds"/*.png 2>/dev/null | xargs -n1 basename | sed 's/\.png$//' | sed 's/^bg-//' | sort | tr '\n' ' ' | sed 's/ $/\n/'

echo ""
echo "=== Bodies (first 30) ==="
ls "$PROJECT_PATH/public/lilnouns/bodies"/*.png 2>/dev/null | head -30 | xargs -n1 basename | sed 's/\.png$//' | sed 's/^body-//' | sort | tr '\n' ' ' | sed 's/ $/\n/'

echo ""
echo "=== Heads (first 30) ==="
ls "$PROJECT_PATH/public/lilnouns/heads"/*.png 2>/dev/null | head -30 | xargs -n1 basename | sed 's/\.png$//' | sed 's/^head-//' | sort | tr '\n' ' ' | sed 's/ $/\n/'

echo ""
echo "=== Glasses (first 20) ==="
ls "$PROJECT_PATH/public/lilnouns/glasses"/*.png 2>/dev/null | head -20 | xargs -n1 basename | sed 's/\.png$//' | sed 's/^glasses-//' | sort | tr '\n' ' ' | sed 's/ $/\n/'

echo ""
echo "=== Accessories (first 30) ==="
ls "$PROJECT_PATH/public/lilnouns/accessories"/*.png 2>/dev/null | head -30 | xargs -n1 basename | sed 's/\.png$//' | sed 's/^accessory-//' | sort | tr '\n' ' ' | sed 's/ $/\n/'

echo ""
echo "💡 Use these names to update TRAIT_OPTIONS in lib/avatar/avatarStore.ts"
echo "💡 Note: You may want to select a curated subset for kids (not all 200+ options)"

