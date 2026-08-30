'use client';

/**
 * Kids-route shell: playful background + kid fonts.
 * Parent routes stay on the calmer root layout chrome.
 */
export default function KidsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-kiddo-soft font-kid text-kiddo-ink">
      {children}
    </div>
  );
}
