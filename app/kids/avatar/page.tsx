'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAvatarStore, TRAIT_OPTIONS } from '@/lib/avatar/avatarStore';
import { getAvatarLayers } from '@/lib/avatar/avatarUtils';
import { Sparks, WarningCircle, Star, CheckCircle } from 'iconoir-react';
import AvatarPreview from '../../_components/AvatarPreview';
import Header from '../../_components/Header';
import BigButton from '../../_components/BigButton';
import TraitIcon from '../../_components/TraitIcon';

type TraitCategory = 'background' | 'body' | 'head' | 'glasses' | 'accessory' | 'magic';

export default function AvatarPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Safely get store values
  const traits = useAvatarStore((state) => state.traits);
  const setTrait = useAvatarStore((state) => state.setTrait);
  const randomize = useAvatarStore((state) => state.randomize);
  const randomizeMagic = useAvatarStore((state) => state.randomizeMagic);

  const [selectedCategory, setSelectedCategory] = useState<TraitCategory>('background');
  const [showSparkles, setShowSparkles] = useState(false);
  const [saved, setSaved] = useState(false);

  // Wait for hydration to prevent SSR mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Default traits if store fails
  const safeTraits = traits || {
    background: 'cool',
    body: 'blue-sky',
    head: 'cat',
    glasses: 'none',
    accessory: 'none',
    magic: [],
  };

  const layers = getAvatarLayers(safeTraits);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-purple-500"
        >
          <Sparks width={64} height={64} />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 p-6">
        <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-red-200">
          <div className="mb-4 flex justify-center text-red-500">
            <WarningCircle width={48} height={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <BigButton onClick={() => window.location.reload()} variant="primary">
            Reload Page
          </BigButton>
        </div>
      </div>
    );
  }

  const handleTraitSelect = (value: string) => {
    if (!setTrait) return;

    if (selectedCategory === 'magic') {
      // Toggle magic trait
      const currentMagic = safeTraits.magic || [];
      const newMagic = currentMagic.includes(value)
        ? currentMagic.filter(t => t !== value)
        : [...currentMagic, value];
      setTrait('magic', newMagic);
    } else {
      setTrait(selectedCategory, value);
    }
    setShowSparkles(true);
    setTimeout(() => setShowSparkles(false), 1000);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      router.push('/kids/dashboard');
    }, 1500);
  };

  const categories: { key: TraitCategory; label: string }[] = [
    { key: 'background', label: 'Background' },
    { key: 'body', label: 'Body' },
    { key: 'head', label: 'Head' },
    { key: 'glasses', label: 'Glasses' },
    { key: 'accessory', label: 'Accessory' },
    { key: 'magic', label: 'Magic' },
  ];

  const getOptionsForCategory = (category: TraitCategory): string[] => {
    switch (category) {
      case 'background':
        return TRAIT_OPTIONS.backgrounds;
      case 'body':
        return TRAIT_OPTIONS.bodies;
      case 'head':
        return TRAIT_OPTIONS.heads;
      case 'glasses':
        return TRAIT_OPTIONS.glasses;
      case 'accessory':
        return TRAIT_OPTIONS.accessories;
      case 'magic':
        return TRAIT_OPTIONS.magic;
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-white pb-6">
      <Header title="Build Your Avatar" showBack />

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 safe-area-inset-top">
        {/* Avatar Preview - Large and Prominent */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex justify-center"
        >
          <div className="relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-8 shadow-2xl border-4 border-indigo-100">
            <div className="bg-white rounded-2xl p-4 inline-block">
              <AvatarPreview layers={layers} size={280} animate />
            </div>

            {/* Sparkles Animation */}
            <AnimatePresence>
              {showSparkles && (
                <>
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0, x: 140, y: 140 }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.2, 0],
                        x: 140 + (Math.random() - 0.5) * 140,
                        y: 140 + (Math.random() - 0.5) * 140,
                        rotate: [0, 180, 360],
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.2, delay: i * 0.08 }}
                      className="absolute pointer-events-none text-purple-400"
                      style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
                    >
                      <Star width={24} height={24} fill="currentColor" />
                    </motion.div>
                  ))}
                </>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Category Selector - Modern Card Design */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 shadow-xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Choose Part</h3>
          <div className="grid grid-cols-3 gap-4">
            {categories.map((category) => (
              <motion.button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`p-6 rounded-2xl font-bold transition-all flex flex-col items-center justify-center gap-3 ${selectedCategory === category.key
                    ? 'bg-white text-indigo-600 shadow-2xl border-4 border-indigo-400 scale-105'
                    : 'bg-white/70 text-gray-700 hover:bg-white hover:shadow-lg border-2 border-transparent hover:border-indigo-200'
                  }`}
              >
                <div className={`${selectedCategory === category.key ? 'text-indigo-600' : 'text-gray-600'}`}>
                  <TraitIcon category={category.key} trait="" size={36} />
                </div>
                <div className={`text-sm font-semibold ${selectedCategory === category.key ? 'text-indigo-700' : 'text-gray-700'}`}>
                  {category.label}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Trait Options - Scrollable Grid */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-indigo-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
            {selectedCategory === 'magic' ? 'Add Magic Traits (tap to toggle)' : 'Select Option'}
          </h3>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 max-h-96 overflow-y-auto pr-2">
            {selectedCategory === 'magic' && (
              <motion.button
                onClick={() => handleTraitSelect('none')}
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className={`p-5 rounded-2xl font-semibold flex flex-col items-center justify-center gap-3 transition-all ${safeTraits.magic.length === 0
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-xl border-4 border-indigo-300'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:shadow-md border-2 border-gray-200'
                  }`}
              >
                <div className={safeTraits.magic.length === 0 ? 'text-white' : 'text-gray-500'}>
                  <TraitIcon category={selectedCategory} trait="none" size={32} />
                </div>
                <div className={`text-xs font-bold ${safeTraits.magic.length === 0 ? 'text-white' : 'text-gray-700'}`}>
                  None
                </div>
              </motion.button>
            )}
            {getOptionsForCategory(selectedCategory).map((option) => {
              // Convert to string for inclusion check to avoid type errors
              const safeMagic = safeTraits.magic || [];
              const isSelected = selectedCategory === 'magic'
                ? safeMagic.includes(option)
                : safeTraits[selectedCategory] === option;

              return (
                <motion.button
                  key={option}
                  onClick={() => handleTraitSelect(option)}
                  whileHover={{ scale: 1.08, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-5 rounded-2xl font-semibold transition-all flex flex-col items-center justify-center gap-3 ${isSelected
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-xl border-4 border-indigo-300 scale-105'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:shadow-md border-2 border-gray-200'
                    }`}
                >
                  <div className={isSelected ? 'text-white' : 'text-gray-500'}>
                    <TraitIcon category={selectedCategory} trait={option} size={32} />
                  </div>
                  <div className={`text-xs font-bold capitalize text-center leading-tight ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                    {option.replace(/-/g, ' ').split(' ').slice(0, 2).join(' ')}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons - Modern Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.button
            onClick={() => randomize?.()}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            disabled={!randomize}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Randomize All
          </motion.button>

          <motion.button
            onClick={() => randomizeMagic?.()}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            disabled={!randomizeMagic}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Add Magic
          </motion.button>

          <motion.button
            onClick={handleSave}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            disabled={saved}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {saved ? 'Saved!' : 'Save Avatar'}
          </motion.button>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {saved && (
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 20 }}
              className="bg-gradient-to-br from-emerald-400 to-teal-400 rounded-3xl p-8 text-center shadow-2xl border-4 border-emerald-300"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 0.6, repeat: 1 }}
                className="mb-4 flex justify-center text-white"
              >
                <CheckCircle width={64} height={64} strokeWidth={2} />
              </motion.div>
              <div className="text-2xl font-bold text-white mb-2">Avatar Saved!</div>
              <p className="text-emerald-50 text-lg">Your new avatar will appear everywhere!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
