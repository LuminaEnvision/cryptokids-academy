# Helper Scripts

## copy-lilnouns-assets.sh

Automatically copies Lil Nouns assets from your forked monorepo to the Kiddo Wallet project.

### Usage

```bash
./scripts/copy-lilnouns-assets.sh /path/to/lilnouns-monorepo
```

### Example

```bash
# If you cloned the monorepo to ~/lilnouns-monorepo
./scripts/copy-lilnouns-assets.sh ~/lilnouns-monorepo
```

### What it does

1. Checks if the monorepo path exists
2. Looks for assets in common locations:
   - `packages/nouns-assets/images/`
   - `packages/nouns-assets/src/images/`
   - `packages/nouns-assets/assets/images/`
3. Copies all trait folders to `public/lilnouns/`
4. Creates destination directories if needed

### Troubleshooting

If the script can't find the images directory, it will:
- Show you where PNG files are located
- Ask you to specify the path manually

