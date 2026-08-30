# Lil Nouns Assets

PNG traits used by the kid avatar builder and mascot.

## Sync from GitHub / local monorepo

Official source: [lilnounsDAO/lilnouns-monorepo](https://github.com/lilnounsDAO/lilnouns-monorepo) → `packages/nouns-assets/images/{v0,v1,v2}`.

```bash
# Copy any new PNGs from the bundled ./lilnouns-monorepo
node scripts/sync-lilnouns-assets.mjs

# Also pull newest v1/v2 traits from GitHub
node scripts/sync-lilnouns-assets.mjs --github
```

Legacy helper: `./scripts/copy-lilnouns-assets.sh /path/to/lilnouns-monorepo`

## Folder layout

```
public/lilnouns/
  backgrounds/   bg-*.png
  bodies/        body-*.png
  heads/         head-*.png
  glasses/       glasses-*.png
  accessories/   accessory-*.png
  custom/        MagicKids overlays (sparkle, wand, …)
```

`TRAIT_OPTIONS` in `lib/avatar/avatarStore.ts` must only list filenames that exist here — missing files show up as blank layers.

## Custom MagicKids traits

| File | Purpose |
|------|---------|
| `magic-wand.png` | Wand overlay |
| `fairy-wings.png` | Wings |
| `sparkle.png` | Sparkle |
| `robot-antenna.png` | Antenna |
| `dragon-horns.png` | Horns |

## Notes

- Prefer 320×320 (or larger) transparent PNGs
- Pixel art should use nearest-neighbor scaling in the UI (`image-rendering: pixelated`)
