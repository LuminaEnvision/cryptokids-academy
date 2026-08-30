'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparks } from 'iconoir-react';

interface AvatarPreviewProps {
  layers: string[];
  size?: number;
  className?: string;
  animate?: boolean;
}

export default function AvatarPreview({
  layers,
  size = 200,
  className = '',
  animate = false
}: AvatarPreviewProps) {
  const [loadedLayers, setLoadedLayers] = useState<string[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Filter out empty layers and validate
    const validLayers = layers.filter(layer => layer && layer !== '');
    setLoadedLayers(validLayers);
    setError(false);
  }, [layers]);

  // Always show something, even if no layers
  if (loadedLayers.length === 0) {
    // Fallback to placeholder
    return (
      <motion.div
        animate={animate ? { y: [0, -5, 0] } : {}}
        transition={{ duration: 2, repeat: animate ? Infinity : 0 }}
        className={`flex items-center justify-center bg-gradient-to-br from-magic-pink to-magic-purple rounded-full ${className} text-white`}
        style={{ width: size, height: size }}
      >
        <Sparks width={size ? size / 2 : 32} height={size ? size / 2 : 32} />
      </motion.div>
    );
  }

  return (
    <motion.div
      animate={animate ? { y: [0, -5, 0] } : {}}
      transition={{ duration: 2, repeat: animate ? Infinity : 0 }}
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="relative w-full h-full" style={{ imageRendering: 'pixelated' }}>
        {loadedLayers.map((layer, index) => (
          <div
            key={`${layer}-${index}`}
            className="absolute inset-0"
            style={{ zIndex: index }}
          >
            <img
              src={layer}
              alt=""
              width={size}
              height={size}
              className="object-contain"
              style={{
                imageRendering: 'pixelated',
                width: '100%',
                height: '100%',
              }}
              onError={(e) => {
                // Hide failed images
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                console.warn('Image not found (this is okay):', layer);
                if (index === 0) {
                  setError(true);
                }
              }}
            />
          </div>
        ))}
      </div>

      {/* Blinking animation overlay */}
      {animate && (
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          className="absolute inset-0 pointer-events-none"
        />
      )}
    </motion.div>
  );
}

