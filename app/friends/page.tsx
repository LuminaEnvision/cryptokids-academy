'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { UserPlus, QrCode, Group, Trash, Xmark } from 'iconoir-react';
import { getCurrentWallet } from '@/lib/wallet/walletManager';
import { getStoredKidWallet } from '@/lib/wallet/createKidWallet';
import { getENSFromAddress } from '@/lib/wallet/ensKid';
import { getFriends, addFriend, removeFriend, Friend } from '@/lib/friends/friends';
import Header from '../_components/Header';
import BigButton from '../_components/BigButton';
import KidState from '../_components/kids/KidState';
import Mascot from '../_components/kids/Mascot';

function resolveKidWallet() {
  return getCurrentWallet() || getStoredKidWallet();
}

export default function FriendsPage() {
  const router = useRouter();
  const [wallet, setWallet] = useState<ReturnType<typeof resolveKidWallet>>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showMyQR, setShowMyQR] = useState(false);
  const [friendAddress, setFriendAddress] = useState('');
  const [friendName, setFriendName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
    const stored = resolveKidWallet();
    if (!stored) {
      router.push('/kids/login');
      return;
    }
    setWallet(stored);
    setFriends(getFriends());
  }, [router]);

  const handleAddFriend = async () => {
    setError('');
    if (!friendAddress.trim() || !friendName.trim()) {
      setError('Please add a name and address!');
      return;
    }
    if (!friendAddress.trim().startsWith('0x') || friendAddress.trim().length < 10) {
      setError('That address looks incomplete. Ask your friend for their wallet address.');
      return;
    }

    try {
      addFriend({
        address: friendAddress.trim(),
        name: friendName.trim(),
        icon: 'user',
        addedAt: Date.now(),
      });

      try {
        await fetch('/api/friend-bonus', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: friendAddress.trim() }),
        });
      } catch {
        /* bonus is optional */
      }

      setFriends(getFriends());
      setFriendAddress('');
      setFriendName('');
      setShowAddFriend(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Couldn’t add friend');
    }
  };

  const handleRemoveFriend = (address: string) => {
    if (confirm('Remove this friend?')) {
      removeFriend(address);
      setFriends(getFriends());
    }
  };

  if (!mounted || !wallet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kiddo-soft p-6">
        <KidState kind="loading" size={120} />
      </div>
    );
  }

  const ensName = getENSFromAddress(wallet.address);

  return (
    <div className="min-h-screen pb-8 bg-kiddo-soft">
      <Header title="My Friends" showBack backHref="/kids/dashboard" />

      <div className="p-5 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border-[3px] border-kiddo-coral rounded-kid-lg shadow-kid-coral p-4 text-center"
          >
            <div className="flex justify-center text-kiddo-coral mb-2">
              <UserPlus width={36} height={36} />
            </div>
            <h3 className="font-display text-sm text-kiddo-ink mb-3">Add Friend</h3>
            <BigButton
              onClick={() => {
                setError('');
                setShowAddFriend(true);
              }}
              variant="primary"
              className="w-full text-sm py-2"
            >
              Add
            </BigButton>
          </motion.div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.05 }}
            className="bg-white border-[3px] border-kiddo-sky rounded-kid-lg shadow-kid-sky p-4 text-center"
          >
            <div className="flex justify-center text-kiddo-sky mb-2">
              <QrCode width={36} height={36} />
            </div>
            <h3 className="font-display text-sm text-kiddo-ink mb-3">My QR</h3>
            <BigButton
              onClick={() => setShowMyQR(true)}
              variant="secondary"
              className="w-full text-sm py-2"
            >
              Show
            </BigButton>
          </motion.div>
        </div>

        <div className="space-y-3">
          {friends.length === 0 ? (
            <KidState
              kind="empty"
              pose="wave"
              title="No friends yet"
              message="Add a friend with their name and address, or show your QR so they can add you!"
            />
          ) : (
            friends.map((friend, index) => (
              <motion.div
                key={friend.address}
                initial={{ x: -24, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border-[3px] border-kiddo-green rounded-kid-lg shadow-kid-green p-4 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-kid bg-kiddo-green-soft text-kiddo-green flex items-center justify-center shrink-0">
                    <Group width={28} height={28} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg text-kiddo-ink truncate">{friend.name}</h3>
                    <p className="font-kid text-xs text-kiddo-muted font-mono truncate">
                      {friend.address.slice(0, 8)}…{friend.address.slice(-4)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFriend(friend.address)}
                  className="p-2 rounded-kid text-kiddo-coral bg-kiddo-coral-soft shrink-0"
                  aria-label={`Remove ${friend.name}`}
                >
                  <Trash width={22} height={22} />
                </button>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {showAddFriend && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
            onClick={() => setShowAddFriend(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-kid-xl border-[3px] border-kiddo-coral shadow-kid-coral p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-display text-2xl text-kiddo-ink">Add Friend</h2>
                <button
                  type="button"
                  onClick={() => setShowAddFriend(false)}
                  className="p-2 rounded-kid bg-kiddo-coral-soft text-kiddo-coral"
                >
                  <Xmark width={22} height={22} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block font-kid text-sm font-bold text-kiddo-muted mb-2">
                    Friend&apos;s name
                  </label>
                  <input
                    type="text"
                    value={friendName}
                    onChange={(e) => setFriendName(e.target.value)}
                    placeholder="Sam"
                    className="w-full px-4 py-3 rounded-kid border-[3px] border-gray-200 focus:border-kiddo-coral focus:outline-none font-kid text-lg"
                  />
                </div>
                <div>
                  <label className="block font-kid text-sm font-bold text-kiddo-muted mb-2">
                    Friend&apos;s address
                  </label>
                  <input
                    type="text"
                    value={friendAddress}
                    onChange={(e) => setFriendAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full px-4 py-3 rounded-kid border-[3px] border-gray-200 focus:border-kiddo-coral focus:outline-none font-mono text-sm"
                  />
                  <p className="font-kid text-xs text-kiddo-muted mt-2">
                    Ask them to tap <span className="font-semibold">My QR</span> and share their address.
                  </p>
                </div>
                {error && <p className="font-kid text-sm text-kiddo-coral">{error}</p>}
              </div>

              <div className="flex gap-3 mt-6">
                <BigButton
                  onClick={() => setShowAddFriend(false)}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancel
                </BigButton>
                <BigButton onClick={handleAddFriend} variant="primary" className="flex-1">
                  Add Friend
                </BigButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMyQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
            onClick={() => setShowMyQR(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-kid-xl border-[3px] border-kiddo-sky shadow-kid-sky p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-display text-2xl text-kiddo-ink">Your QR Code</h2>
                <button
                  type="button"
                  onClick={() => setShowMyQR(false)}
                  className="p-2 rounded-kid bg-kiddo-sky-soft text-kiddo-sky"
                >
                  <Xmark width={22} height={22} />
                </button>
              </div>
              <p className="font-kid text-sm text-kiddo-muted mb-4 text-center">
                Show this so a friend can add you!
              </p>
              <div className="flex justify-center mb-3">
                <Mascot pose="wave" size={72} />
              </div>
              <div className="bg-kiddo-sky-soft rounded-kid p-5 mb-4 flex justify-center border-2 border-kiddo-sky/30">
                <QRCodeSVG value={wallet.address} size={200} level="H" includeMargin />
              </div>
              <div className="bg-gray-50 rounded-kid p-3 mb-4 text-center">
                <div className="font-kid text-xs text-kiddo-muted mb-1">Your address</div>
                <div className="font-mono text-sm text-kiddo-ink break-all">
                  {ensName || wallet.address}
                </div>
              </div>
              <BigButton onClick={() => setShowMyQR(false)} variant="primary" className="w-full">
                Done
              </BigButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
