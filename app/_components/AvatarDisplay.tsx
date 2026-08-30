'use client';

import { useAvatarStore } from '@/lib/avatar/avatarStore';
import { getAvatarLayers } from '@/lib/avatar/avatarUtils';
import AvatarPreview from './AvatarPreview';

interface AvatarDisplayProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

export default function AvatarDisplay({ 
  size = 100, 
  className = '',
  animate = true 
}: AvatarDisplayProps) {
  const traits = useAvatarStore((state) => state.traits);
  const layers = getAvatarLayers(traits);

  return (
    <AvatarPreview
      layers={layers}
      size={size}
      className={className}
      animate={animate}
    />
  );
}

