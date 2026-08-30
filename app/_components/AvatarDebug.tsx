'use client';

import { useAvatarStore } from '@/lib/avatar/avatarStore';
import { getAvatarLayers } from '@/lib/avatar/avatarUtils';

export default function AvatarDebug() {
  const traits = useAvatarStore((state) => state.traits);
  const layers = getAvatarLayers(traits);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-xs">
      <div className="font-bold mb-2">Avatar Debug</div>
      <div className="space-y-1">
        <div>Background: {traits.background}</div>
        <div>Body: {traits.body}</div>
        <div>Head: {traits.head}</div>
        <div>Glasses: {traits.glasses}</div>
        <div>Accessory: {traits.accessory}</div>
        <div>Magic: {traits.magic.join(', ') || 'none'}</div>
        <div className="mt-2 pt-2 border-t border-white/20">
          <div className="font-bold">Layers ({layers.length}):</div>
          {layers.map((layer, i) => (
            <div key={i} className="text-xs truncate">
              {i + 1}. {layer}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

