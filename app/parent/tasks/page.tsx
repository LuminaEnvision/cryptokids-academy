'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { isParentAuthenticated } from '@/lib/parent/pinAuth';
import { getCurrentWallet } from '@/lib/wallet/walletManager';
import { getStoredKidWallet } from '@/lib/wallet/createKidWallet';
import { getChoresByChildAddress, createChore, updateChoreStatus, Chore } from '@/lib/chores/choreTypes';
import { getChorePhoto } from '@/lib/chores/chorePhotos';
import Header from '../../_components/Header';
import BigButton from '../../_components/BigButton';

function resolveKidWallet() {
  return getCurrentWallet() || getStoredKidWallet();
}

export default function ParentTasksPage() {
  const router = useRouter();
  const [wallet, setWallet] = useState<ReturnType<typeof resolveKidWallet>>(null);
  const [chores, setChores] = useState<Chore[]>([]);
  const [proofPhotos, setProofPhotos] = useState<Record<string, string>>({});
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newChoreTitle, setNewChoreTitle] = useState('');
  const [newChoreDescription, setNewChoreDescription] = useState('');
  const [newChoreReward, setNewChoreReward] = useState('5');
  const [approvingId, setApprovingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isParentAuthenticated()) {
      router.push('/parent/login');
      return;
    }

    const stored = resolveKidWallet();
    if (!stored) {
      router.push('/');
      return;
    }

    setWallet(stored);
    loadChores(stored.address);

    const onFocus = () => {
      const w = resolveKidWallet();
      if (w) loadChores(w.address);
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [router]);

  const loadChores = async (address: string) => {
    const allChores = getChoresByChildAddress(address);
    const sorted = allChores.sort((a, b) => b.createdAt - a.createdAt);
    setChores(sorted);

    const photos: Record<string, string> = {};
    await Promise.all(
      sorted
        .filter((c) => c.hasProofPhoto)
        .map(async (c) => {
          const data = await getChorePhoto(c.id);
          if (data) photos[c.id] = data;
        })
    );
    setProofPhotos(photos);
  };

  const handleCreateChore = () => {
    if (!wallet || !newChoreTitle || !newChoreReward) return;

    createChore({
      title: newChoreTitle,
      description: newChoreDescription || undefined,
      rewardAmount: newChoreReward,
      childAddress: wallet.address,
    });

    setNewChoreTitle('');
    setNewChoreDescription('');
    setNewChoreReward('5');
    setShowCreateModal(false);
    loadChores(wallet.address);
  };

  const handleApprove = async (chore: Chore) => {
    if (!wallet) return;

    setApprovingId(chore.id);
    try {
      // Send reward tokens via API (uses faucet wallet)
      const response = await fetch('/api/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childAddress: wallet.address,
          rewardAmount: chore.rewardAmount,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reward');
      }
      
      // Update chore status
      updateChoreStatus(chore.id, 'approved');
      loadChores(wallet.address);
      
      alert(`✅ Reward sent! ${chore.rewardAmount} MAGIC tokens sent to your child's wallet!`);
    } catch (error: any) {
      alert('Failed to send reward: ' + (error.message || 'Unknown error'));
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = (choreId: string) => {
    if (confirm('Reject this task? The child will need to complete it again.')) {
      updateChoreStatus(choreId, 'rejected');
      loadChores(wallet!.address);
    }
  };

  if (!wallet) {
    return null;
  }

  const pendingChores = chores.filter(c => c.status === 'completed');
  const activeChores = chores.filter(c => c.status === 'pending');
  const approvedChores = chores.filter(c => c.status === 'approved').slice(0, 5);

  return (
    <div className="min-h-screen pb-6 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <Header title="Manage Tasks" showBack variant="parent" />
      
      <div className="p-6 space-y-6">
        {/* Create Task Button */}
        <BigButton
          onClick={() => setShowCreateModal(true)}
          variant="primary"
          icon="➕"
          className="w-full"
        >
          Create New Task
        </BigButton>

        {/* Pending Approvals */}
        {pendingChores.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Pending Approvals</h3>
            <div className="space-y-4">
              {pendingChores.map((chore) => (
                <motion.div
                  key={chore.id}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-5"
                >
                  <h4 className="text-lg font-bold text-gray-800 mb-2">{chore.title}</h4>
                  {chore.description && (
                    <p className="text-gray-600 text-sm mb-3">{chore.description}</p>
                  )}

                  {proofPhotos[chore.id] ? (
                    <button
                      type="button"
                      onClick={() => setLightboxUrl(proofPhotos[chore.id])}
                      className="block w-full mb-4 text-left"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={proofPhotos[chore.id]}
                        alt={`Proof for ${chore.title}`}
                        className="w-full max-h-56 object-cover rounded-xl border-2 border-yellow-300"
                      />
                      <p className="text-xs text-gray-500 mt-1">Tap photo to enlarge</p>
                    </button>
                  ) : (
                    <div className="mb-4 rounded-xl bg-white/70 border border-dashed border-yellow-300 px-3 py-4 text-sm text-gray-500 text-center">
                      {chore.hasProofPhoto
                        ? 'Photo still loading…'
                        : 'No photo attached — kid skipped the camera'}
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-bold text-purple-600">
                      Reward: {chore.rewardAmount} MAGIC
                    </div>
                    <div className="text-sm text-gray-500">
                      Completed: {new Date(chore.completedAt!).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <BigButton
                      onClick={() => handleApprove(chore)}
                      variant="success"
                      icon="✅"
                      className="flex-1"
                      disabled={approvingId === chore.id}
                    >
                      {approvingId === chore.id ? 'Sending...' : 'Approve & Send Reward'}
                    </BigButton>
                    <BigButton
                      onClick={() => handleReject(chore.id)}
                      variant="secondary"
                      icon="❌"
                      className="flex-1"
                    >
                      Reject
                    </BigButton>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Active Tasks */}
        {activeChores.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Active Tasks</h3>
            <div className="space-y-3">
              {activeChores.map((chore) => (
                <div key={chore.id} className="bg-white rounded-xl p-4 shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">{chore.title}</h4>
                      <p className="text-sm text-gray-600">Reward: {chore.rewardAmount} MAGIC</p>
                    </div>
                    <div className="text-2xl">⏳</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Approved */}
        {approvedChores.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Recently Approved</h3>
            <div className="space-y-2">
              {approvedChores.map((chore) => (
                <div key={chore.id} className="bg-green-50 rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-800">{chore.title}</span>
                    <span className="text-green-600">✅ Approved</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create Task Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
              onClick={() => setShowCreateModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl p-6 w-full max-w-md"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Create New Task</h2>
                
                {/* Task Templates */}
                <div className="mb-4">
                  <div className="text-sm font-bold text-gray-700 mb-2">Quick Templates</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { title: 'Clean Room', reward: '5' },
                      { title: 'Do Homework', reward: '10' },
                      { title: 'Take Out Trash', reward: '3' },
                      { title: 'Feed Pet', reward: '5' },
                    ].map((template) => (
                      <button
                        key={template.title}
                        onClick={() => {
                          setNewChoreTitle(template.title);
                          setNewChoreReward(template.reward);
                        }}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                      >
                        {template.title} ({template.reward} MAGIC)
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Task Title
                    </label>
                    <input
                      type="text"
                      value={newChoreTitle}
                      onChange={(e) => setNewChoreTitle(e.target.value)}
                      placeholder="e.g., Clean Your Room"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Description (optional)
                    </label>
                    <textarea
                      value={newChoreDescription}
                      onChange={(e) => setNewChoreDescription(e.target.value)}
                      placeholder="Add details about the task..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Reward (MAGIC tokens)
                    </label>
                    <input
                      type="number"
                      value={newChoreReward}
                      onChange={(e) => setNewChoreReward(e.target.value)}
                      min="1"
                      step="1"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <BigButton
                    onClick={() => setShowCreateModal(false)}
                    variant="secondary"
                    className="flex-1"
                  >
                    Cancel
                  </BigButton>
                  <BigButton
                    onClick={handleCreateChore}
                    variant="primary"
                    className="flex-1"
                    disabled={!newChoreTitle || !newChoreReward}
                  >
                    Create Task
                  </BigButton>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Proof photo lightbox */}
        <AnimatePresence>
          {lightboxUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4"
              onClick={() => setLightboxUrl(null)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightboxUrl}
                alt="Task proof"
                className="max-w-full max-h-[85vh] rounded-2xl object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

