'use client';

import { useEffect, useState, useRef } from 'react';

const PALETTES = [
  { id: 'default',  label: 'Blue',     bg: '#EEF3FC', dot: '#004AAD' },
  { id: 'rose',     label: 'Rose',     bg: '#F8F0EE', dot: '#A03030' },
  { id: 'sage',     label: 'Sage',     bg: '#EDF3EE', dot: '#1A6B2A' },
  { id: 'sand',     label: 'Sand',     bg: '#F5F0E8', dot: '#8B5E2A' },
  { id: 'lavender', label: 'Lavender', bg: '#F0EDF8', dot: '#5020A0' },
  { id: 'dark',     label: 'Dark',     bg: '#000000', dot: '#BFD3EE' },
];

function applyTheme(id: string) {
  const html = document.documentElement;
  if (id === 'dark') {
    html.classList.add('dark');
    html.removeAttribute('data-theme');
  } else {
    html.classList.remove('dark');
    if (id === 'default') {
      html.removeAttribute('data-theme');
    } else {
      html.setAttribute('data-theme', id);
    }
  }
  localStorage.setItem('portfolio-theme', id);
}

export function ThemeToggle() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('default');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('portfolio-theme') || 'default';
    setCurrent(saved);
    applyTheme(saved);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (id: string) => {
    setCurrent(id);
    applyTheme(id);
    setOpen(false);
  };

  const active = PALETTES.find(p => p.id === current) ?? PALETTES[0];

  return (
    <div ref={ref} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">

      {/* Colour bar — slides up when open */}
      {open && (
        <div className="flex items-center gap-2 px-3 py-2 bg-bg-card border border-border rounded-full shadow-md">
          {PALETTES.map(p => (
            <button
              key={p.id}
              title={p.label}
              onClick={() => handleSelect(p.id)}
              className="w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110"
              style={{
                background: p.bg,
                outline: current === p.id ? `2px solid ${p.dot}` : '2px solid transparent',
                outlineOffset: '2px',
              }}
            >
              <span className="w-2.5 h-2.5 rounded-full block" style={{ background: p.dot }} />
            </button>
          ))}
        </div>
      )}

      {/* Moon / sun button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 flex items-center justify-center rounded-full border border-border bg-bg-card text-text-secondary hover:text-text-primary shadow-sm hover:shadow-md transition-all duration-200"
        aria-label="Change theme"
        style={{ outline: open ? `2px solid ${active.dot}` : 'none', outlineOffset: '2px' }}
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path d="M7.5 1C4.46 1 2 3.46 2 6.5C2 9.54 4.46 12 7.5 12C9.38 12 11.05 11.07 12.07 9.64C11.56 9.87 11 10 10.41 10C8.21 10 6.41 8.21 6.41 6C6.41 4.67 7.08 3.49 8.11 2.77C7.92 2.74 7.71 2.72 7.5 2.72V1Z" stroke="currentColor" strokeWidth="1" fill="none"/>
        </svg>
      </button>
    </div>
  );
}
