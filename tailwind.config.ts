import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: 'var(--bg-void)',
        deep: 'var(--bg-deep)',
        surface: 'var(--bg-surface)',
        elevated: 'var(--bg-elevated)',
        border: 'var(--border)',
        'border-glow': 'var(--border-glow)',
        'text-primary': 'var(--text-primary)',
        'text-muted': 'var(--text-muted)',
        'text-dim': 'var(--text-dim)',
        'accent-blue': 'var(--accent-blue)',
        'accent-coral': 'var(--accent-coral)',
        'accent-green': 'var(--accent-green)',
        'accent-red': 'var(--accent-red)',
        'accent-amber': 'var(--accent-amber)',
        'accent-purple': 'var(--accent-purple)',
        'accent-cyan': 'var(--accent-cyan)',
        'star-gold': 'var(--star-gold)',
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['Syne', '"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px var(--border-glow), 0 8px 32px var(--glow-blue)',
        'glow-coral': '0 0 0 1px var(--accent-coral), 0 8px 32px var(--glow-coral)',
      },
    },
  },
  plugins: [],
}

export default config
