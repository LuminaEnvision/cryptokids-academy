#!/usr/bin/env node
/**
 * Sync Lil Nouns PNG traits from local monorepo (+ optional GitHub) into public/lilnouns.
 *
 * Usage:
 *   node scripts/sync-lilnouns-assets.mjs
 *   node scripts/sync-lilnouns-assets.mjs --github
 *   node scripts/sync-lilnouns-assets.mjs /path/to/lilnouns-monorepo
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const wantGithub = args.includes('--github');
const monoArg = args.find((a) => !a.startsWith('-'));
const MONOREPO = monoArg
  ? path.resolve(monoArg)
  : path.join(PROJECT, 'lilnouns-monorepo');

const DEST = path.join(PROJECT, 'public', 'lilnouns');
const CATEGORIES = [
  ['0-backgrounds', 'backgrounds'],
  ['1-bodies', 'bodies'],
  ['2-accessories', 'accessories'],
  ['3-heads', 'heads'],
  ['4-glasses', 'glasses'],
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyNewPngs(srcDir, destDir) {
  ensureDir(destDir);
  if (!fs.existsSync(srcDir)) return 0;
  let added = 0;
  for (const name of fs.readdirSync(srcDir)) {
    if (!name.endsWith('.png')) continue;
    const from = path.join(srcDir, name);
    const to = path.join(destDir, name);
    if (fs.existsSync(to)) continue;
    fs.copyFileSync(from, to);
    console.log('ADD', path.relative(PROJECT, to));
    added += 1;
  }
  return added;
}

function syncLocal() {
  const images = path.join(MONOREPO, 'packages', 'nouns-assets', 'images');
  if (!fs.existsSync(images)) {
    console.warn('Monorepo images not found at', images);
    return 0;
  }
  let total = 0;
  for (const ver of ['v0', 'v1', 'v2']) {
    for (const [srcName, destName] of CATEGORIES) {
      total += copyNewPngs(
        path.join(images, ver, srcName),
        path.join(DEST, destName)
      );
    }
  }
  ensureDir(path.join(DEST, 'custom'));
  return total;
}

async function syncGithub() {
  const base =
    'https://api.github.com/repos/lilnounsDAO/lilnouns-monorepo/contents/packages/nouns-assets/images';
  const paths = [
    'v1/2-accessories',
    'v1/3-heads',
    'v1/4-glasses',
    'v2/2-accessories',
    'v2/3-heads',
  ];
  const folderMap = {
    '0-backgrounds': 'backgrounds',
    '1-bodies': 'bodies',
    '2-accessories': 'accessories',
    '3-heads': 'heads',
    '4-glasses': 'glasses',
  };
  let added = 0;
  for (const p of paths) {
    const url = `${base}/${p}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'KiddoWallet-AssetSync' },
    });
    if (!res.ok) {
      console.warn('GitHub skip', p, res.status);
      continue;
    }
    const items = await res.json();
    const leaf = p.split('/').pop();
    const destName = folderMap[leaf];
    const destDir = path.join(DEST, destName);
    ensureDir(destDir);
    for (const item of items) {
      if (item.type !== 'file' || !item.name?.endsWith('.png')) continue;
      const to = path.join(destDir, item.name);
      if (fs.existsSync(to)) continue;
      const fileRes = await fetch(item.download_url, {
        headers: { 'User-Agent': 'KiddoWallet-AssetSync' },
      });
      if (!fileRes.ok) continue;
      const buf = Buffer.from(await fileRes.arrayBuffer());
      fs.writeFileSync(to, buf);
      console.log('DOWNLOAD', item.name);
      added += 1;
    }
  }
  return added;
}

function verifyTraitOptions() {
  // Soft check: print missing files for curated heads in avatarStore source
  const storePath = path.join(PROJECT, 'lib', 'avatar', 'avatarStore.ts');
  const src = fs.readFileSync(storePath, 'utf8');
  const headBlock = src.match(/heads:\s*\[([\s\S]*?)\],\s*glasses:/);
  if (!headBlock) return;
  const ids = [...headBlock[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
  const missing = ids.filter(
    (id) => !fs.existsSync(path.join(DEST, 'heads', `head-${id}.png`))
  );
  if (missing.length) {
    console.warn('\n⚠️  TRAIT_OPTIONS.heads missing on disk:', missing.join(', '));
  } else {
    console.log('\n✓ All TRAIT_OPTIONS.heads exist on disk');
  }

  for (const [folder, label] of [
    ['backgrounds', 'backgrounds'],
    ['bodies', 'bodies'],
    ['heads', 'heads'],
    ['glasses', 'glasses'],
    ['accessories', 'accessories'],
    ['custom', 'custom'],
  ]) {
    const n = fs.existsSync(path.join(DEST, folder))
      ? fs.readdirSync(path.join(DEST, folder)).filter((f) => f.endsWith('.png')).length
      : 0;
    console.log(`  ${label}: ${n} png`);
  }
}

const localAdded = syncLocal();
console.log('Local added:', localAdded);

if (wantGithub) {
  syncGithub()
    .then((n) => {
      console.log('GitHub added:', n);
      verifyTraitOptions();
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
} else {
  verifyTraitOptions();
  console.log('\nTip: pass --github to also pull newest traits from lilnounsDAO/lilnouns-monorepo');
}
