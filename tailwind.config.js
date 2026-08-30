/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Legacy magic palette (parent / older screens)
        'magic-pink': '#FF7EB6',
        'magic-blue': '#4DABF7',
        'magic-gold': '#FFD43B',
        'magic-mint': '#69DB7C',
        'magic-purple': '#9775FA',
        'magic-pink-light': '#FFE6F2',
        'magic-blue-light': '#E7F5FF',
        'magic-gold-light': '#FFF9DB',
        // Kiddo kids palette
        kiddo: {
          coral: '#FF5A5F',
          'coral-soft': '#FFE8E9',
          green: '#58CC02',
          'green-soft': '#E8F9D4',
          gold: '#FFC800',
          'gold-soft': '#FFF4CC',
          sky: '#1CB0F6',
          'sky-soft': '#DDF3FE',
          ink: '#3C3C3C',
          muted: '#777777',
          cream: '#FFF9F0',
          soft: '#EAF7FF',
        },
      },
      fontFamily: {
        rounded: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        display: ['var(--font-fredoka)', 'system-ui', 'sans-serif'],
        kid: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        kid: '1.25rem',
        'kid-lg': '1.5rem',
        'kid-xl': '1.75rem',
      },
      boxShadow: {
        'kid-coral': '0 8px 0 rgba(255, 90, 95, 0.35)',
        'kid-green': '0 8px 0 rgba(88, 204, 2, 0.35)',
        'kid-gold': '0 8px 0 rgba(255, 200, 0, 0.45)',
        'kid-sky': '0 8px 0 rgba(28, 176, 246, 0.35)',
        'kid-soft': '0 10px 24px rgba(28, 176, 246, 0.18)',
        'kid-press': '0 2px 0 rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
};
