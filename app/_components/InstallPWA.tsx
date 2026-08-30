'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Soft install prompt for KiddoPay PWA (Chrome/Edge beforeinstallprompt).
 * iOS users get a short tip instead.
 */
export default function InstallPWA() {
  const [deferred, setDeferred] = useState<Event | null>(null);
  const [showIosTip, setShowIosTip] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem('kiddopay-pwa-dismissed') === '1') {
        setDismissed(true);
      }
    } catch {
      /* ignore */
    }

    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      // @ts-expect-error iOS Safari
      window.navigator.standalone === true;
    if (standalone) return;

    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e);
    };
    window.addEventListener('beforeinstallprompt', onBip);

    const ua = window.navigator.userAgent;
    const isIos = /iPad|iPhone|iPod/.test(ua);
    const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
    if (isIos && isSafari) setShowIosTip(true);

    return () => window.removeEventListener('beforeinstallprompt', onBip);
  }, []);

  const dismiss = () => {
    setDismissed(true);
    setDeferred(null);
    setShowIosTip(false);
    try {
      localStorage.setItem('kiddopay-pwa-dismissed', '1');
    } catch {
      /* ignore */
    }
  };

  const install = async () => {
    const prompt = deferred as unknown as {
      prompt: () => Promise<void>;
      userChoice: Promise<{ outcome: string }>;
    } | null;
    if (!prompt) return;
    await prompt.prompt();
    await prompt.userChoice;
    dismiss();
  };

  const visible = !dismissed && (deferred || showIosTip);
  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        className="fixed left-3 right-3 z-50 bottom-24 md:left-auto md:right-6 md:w-80"
      >
        <div className="bg-white border-[3px] border-kiddo-sky rounded-kid-lg shadow-kid-sky p-4 font-kid">
          <div className="flex items-start gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/icon-192.png"
              alt=""
              width={48}
              height={48}
              className="rounded-kid shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-display text-base text-kiddo-ink">Add KiddoPay to Home</p>
              <p className="text-sm text-kiddo-muted mt-0.5">
                {deferred
                  ? 'Install the app for faster, full-screen fun.'
                  : 'Tap Share → Add to Home Screen'}
              </p>
              <div className="flex gap-2 mt-3">
                {deferred && (
                  <button
                    type="button"
                    onClick={install}
                    className="flex-1 bg-kiddo-sky text-white font-display font-semibold text-sm py-2 rounded-kid"
                  >
                    Install
                  </button>
                )}
                <button
                  type="button"
                  onClick={dismiss}
                  className="px-3 py-2 text-sm font-semibold text-kiddo-muted"
                >
                  Not now
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
