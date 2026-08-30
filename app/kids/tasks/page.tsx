'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clock, Camera, Xmark } from 'iconoir-react';
import { getCurrentWallet } from '@/lib/wallet/walletManager';
import { getStoredKidWallet } from '@/lib/wallet/createKidWallet';
import {
  getChoresByChildAddress,
  completeChoreWithProof,
  reassignChoresToAddress,
  Chore,
} from '@/lib/chores/choreTypes';
import { compressImageFile, saveChorePhoto, getChorePhoto } from '@/lib/chores/chorePhotos';
import Header from '../../_components/Header';
import BigButton from '../../_components/BigButton';
import KidState from '../../_components/kids/KidState';
import KidCard from '../../_components/kids/KidCard';
import KidIcon from '../../_components/kids/KidIcon';
import Mascot from '../../_components/kids/Mascot';

function resolveKidWallet() {
  return getCurrentWallet() || getStoredKidWallet();
}

export default function KidsTasksPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [chores, setChores] = useState<Chore[]>([]);
  const [mounted, setMounted] = useState(false);

  // Proof capture flow
  const [proofChore, setProofChore] = useState<Chore | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [waitingPhotos, setWaitingPhotos] = useState<Record<string, string>>({});

  const loadChores = useCallback(async (kidAddress: string) => {
    reassignChoresToAddress(kidAddress);
    const allChores = getChoresByChildAddress(kidAddress);
    const visibleChores = allChores.filter(
      (c) => c.status === 'pending' || c.status === 'completed'
    );
    const sorted = visibleChores.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    setChores(sorted);

    const photos: Record<string, string> = {};
    await Promise.all(
      sorted
        .filter((c) => c.status === 'completed' && c.hasProofPhoto)
        .map(async (c) => {
          const data = await getChorePhoto(c.id);
          if (data) photos[c.id] = data;
        })
    );
    setWaitingPhotos(photos);
  }, []);

  useEffect(() => {
    setMounted(true);
    const wallet = resolveKidWallet();
    if (!wallet) {
      router.push('/kids/login');
      return;
    }

    setAddress(wallet.address);
    loadChores(wallet.address);

    const refresh = () => {
      const w = resolveKidWallet();
      if (w) loadChores(w.address);
    };

    window.addEventListener('focus', refresh);
    window.addEventListener('storage', refresh);
    const interval = setInterval(refresh, 5000);

    return () => {
      window.removeEventListener('focus', refresh);
      window.removeEventListener('storage', refresh);
      clearInterval(interval);
    };
  }, [router, loadChores]);

  const openProofFlow = (chore: Chore) => {
    setProofChore(chore);
    setPreviewUrl(null);
    setPhotoError('');
  };

  const closeProofFlow = () => {
    setProofChore(null);
    setPreviewUrl(null);
    setPhotoError('');
    setSubmitting(false);
  };

  const onFilePicked = async (file: File | null) => {
    if (!file) return;
    setPhotoError('');
    try {
      const dataUrl = await compressImageFile(file);
      setPreviewUrl(dataUrl);
    } catch {
      setPhotoError('Couldn’t use that photo. Try again!');
    }
  };

  const submitWithPhoto = async () => {
    if (!proofChore || !address || !previewUrl) return;
    setSubmitting(true);
    setPhotoError('');
    try {
      await saveChorePhoto(proofChore.id, previewUrl);
      completeChoreWithProof(proofChore.id, true);
      closeProofFlow();
      await loadChores(address);
    } catch {
      setPhotoError('Couldn’t save the photo. Try again!');
      setSubmitting(false);
    }
  };

  const submitWithoutPhoto = () => {
    if (!proofChore || !address) return;
    completeChoreWithProof(proofChore.id, false);
    closeProofFlow();
    loadChores(address);
  };

  if (!mounted || !address) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kiddo-soft p-6">
        <KidState kind="loading" size={120} />
      </div>
    );
  }

  const pendingChores = chores.filter((c) => c.status === 'pending');
  const completedChores = chores.filter((c) => c.status === 'completed');

  return (
    <div className="min-h-screen pb-8 bg-kiddo-soft">
      <Header title="My Tasks" showBack />

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => onFilePicked(e.target.files?.[0] || null)}
      />

      <div className="p-5 space-y-5">
        {chores.length === 0 ? (
          <KidState
            kind="empty"
            pose="thinking"
            title="No tasks yet"
            message="Ask a grown-up to add a Magic Task for you. It will show up here!"
          />
        ) : (
          <>
            {pendingChores.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-display text-xl text-kiddo-ink">To do</h3>
                {pendingChores.map((chore, index) => (
                  <motion.div
                    key={chore.id}
                    initial={{ x: -24, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.06 }}
                    className="bg-white border-[3px] border-kiddo-sky rounded-kid-lg shadow-kid-sky p-5"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <KidIcon name="tasks" size={32} color="sky" well />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display text-xl text-kiddo-ink mb-1">
                          {chore.title}
                        </h4>
                        {chore.description && (
                          <p className="font-kid text-sm text-kiddo-muted">
                            {chore.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="bg-kiddo-gold-soft border-2 border-kiddo-gold/40 rounded-kid p-3 mb-4 text-center">
                      <div className="font-kid text-xs font-bold text-kiddo-muted mb-0.5">
                        Reward
                      </div>
                      <div className="font-display text-xl text-kiddo-ink">
                        {chore.rewardAmount} MAGIC
                      </div>
                    </div>
                    <BigButton
                      onClick={() => openProofFlow(chore)}
                      variant="primary"
                      icon={<Camera width={24} height={24} />}
                      className="w-full"
                    >
                      Done — take a photo
                    </BigButton>
                  </motion.div>
                ))}
              </div>
            )}

            {completedChores.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-display text-xl text-kiddo-ink">Waiting for parent</h3>
                {completedChores.map((chore, index) => (
                  <motion.div
                    key={chore.id}
                    initial={{ x: -24, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.06 }}
                    className="bg-white border-[3px] border-kiddo-gold rounded-kid-lg shadow-kid-gold p-5"
                  >
                    <div className="flex items-center gap-4">
                      {waitingPhotos[chore.id] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={waitingPhotos[chore.id]}
                          alt="Your proof"
                          className="w-16 h-16 rounded-kid object-cover border-2 border-kiddo-gold shrink-0"
                        />
                      ) : (
                        <Mascot pose="wave" size={64} />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display text-lg text-kiddo-ink">{chore.title}</h4>
                        <p className="font-kid text-sm text-kiddo-muted">
                          {chore.hasProofPhoto
                            ? 'Photo sent — waiting for a grown-up…'
                            : 'Waiting for a grown-up to approve…'}
                        </p>
                      </div>
                      <Clock width={28} height={28} className="text-kiddo-gold shrink-0" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {pendingChores.length === 0 && completedChores.length > 0 && (
              <KidCard
                accent="green"
                title="Nice work!"
                description="You finished your tasks. Hang tight for your reward."
                icon={<KidIcon name="star" size={28} color="green" />}
              />
            )}
          </>
        )}
      </div>

      {/* Proof photo sheet */}
      <AnimatePresence>
        {proofChore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4"
            onClick={closeProofFlow}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-md rounded-kid-xl border-[3px] border-kiddo-sky shadow-kid-sky p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-display text-xl text-kiddo-ink">Show your work!</h3>
                  <p className="font-kid text-sm text-kiddo-muted mt-1">
                    Take a photo of <span className="font-semibold">{proofChore.title}</span> so a
                    grown-up can check it.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeProofFlow}
                  className="p-2 rounded-kid bg-kiddo-sky-soft text-kiddo-sky"
                  aria-label="Close"
                >
                  <Xmark width={22} height={22} />
                </button>
              </div>

              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full max-h-64 object-cover rounded-kid border-[3px] border-kiddo-sky mb-4"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full mb-4 py-10 rounded-kid border-[3px] border-dashed border-kiddo-sky bg-kiddo-sky-soft flex flex-col items-center gap-2 text-kiddo-sky"
                >
                  <Camera width={40} height={40} />
                  <span className="font-display font-semibold">Open camera</span>
                </button>
              )}

              {photoError && (
                <p className="font-kid text-sm text-kiddo-coral mb-3">{photoError}</p>
              )}

              <div className="space-y-2">
                {previewUrl ? (
                  <>
                    <BigButton
                      onClick={submitWithPhoto}
                      variant="success"
                      icon={<Check width={22} height={22} />}
                      className="w-full"
                      disabled={submitting}
                    >
                      {submitting ? 'Sending…' : 'Send to parent'}
                    </BigButton>
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl(null);
                        fileRef.current?.click();
                      }}
                      className="w-full font-display font-semibold py-3 rounded-kid border-[3px] border-kiddo-sky text-kiddo-sky"
                    >
                      Retake photo
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={submitWithoutPhoto}
                    className="w-full font-kid text-sm text-kiddo-muted py-2"
                  >
                    Skip photo this time
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
