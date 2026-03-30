import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:              'var(--color-bg)',
        'bg-card':       'var(--color-bg-card)',
        'bg-overlay':    'var(--color-bg-overlay)',
        'text-primary':  'var(--color-text-primary)',
        'text-secondary':'var(--color-text-secondary)',
        'text-muted':    'var(--color-text-muted)',
        accent:          'var(--color-accent)',
        'accent-light':  'var(--color-accent-light)',
        border:          'var(--color-border)',
        'border-dark':   'var(--color-border-dark)',
      },
      fontFamily: {
        script: ['var(--font-script)'],
        serif:  ['var(--font-serif)'],
        sans:   ['var(--font-sans)'],
      },
      borderRadius: {
        sm:   'var(--radius-sm)',
        md:   'var(--radius-md)',
        lg:   'var(--radius-lg)',
        pill: 'var(--radius-pill)',
      },
      maxWidth: {
        site: 'var(--max-width)',
        text: 'var(--max-width-text)',
      },
    },
  },
  plugins: [],
};

export default config;
