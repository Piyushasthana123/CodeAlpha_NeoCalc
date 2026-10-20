/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        calc: {
          dark: {
            bg: '#0d1117',
            card: '#161b26',
            key: '#212738',
            keyHover: '#2a3147',
            funcKey: '#2c344b',
            funcKeyHover: '#37415e',
            text: '#f1f5f9',
            textDim: '#7e8ba3',
          },
          light: {
            bg: '#edf2f7',
            card: '#ffffff',
            key: '#f8fafc',
            keyHover: '#eef2f6',
            funcKey: '#e2e8f0',
            funcKeyHover: '#cbd5e1',
            text: '#0f172a',
            textDim: '#64748b',
          },
          orange: {
            DEFAULT: '#ff6200',
            glow: '#ff771a',
            dark: '#e04f00',
            light: '#ff8a3d',
          }
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'glow-orange': '0 0 25px rgba(255, 98, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.35)',
        'glow-orange-light': '0 4px 18px rgba(255, 98, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.4)',
        'neumorph-dark': '8px 8px 24px rgba(0, 0, 0, 0.45), -4px -4px 14px rgba(255, 255, 255, 0.03)',
        'neumorph-light': '10px 10px 28px rgba(166, 180, 200, 0.3), -8px -8px 20px rgba(255, 255, 255, 0.9)',
        'btn-dark': '0 4px 12px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        'btn-dark-active': 'inset 0 3px 6px rgba(0, 0, 0, 0.6)',
        'btn-light': '0 4px 10px rgba(180, 192, 210, 0.35), inset 0 1px 1px #ffffff',
        'btn-light-active': 'inset 0 2px 5px rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
}
