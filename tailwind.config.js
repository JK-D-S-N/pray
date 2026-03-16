/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      colors: {
        bg:       'var(--bg)',
        surface:  'var(--surface)',
        elevated: 'var(--elevated)',
        rim:      'var(--rim)',
        'rim-hi': 'var(--rim-hi)',
        't1':     'var(--text-1)',
        't2':     'var(--text-2)',
        't3':     'var(--text-3)',
        gold:     'var(--amber)',
        'gold-dim': 'var(--amber-dim)',
      },
    },
  },
  plugins: [],
}
