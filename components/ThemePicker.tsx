'use client';

import { useState, useEffect, useRef } from 'react';

const THEMES = [
  { id: 'default',  label: 'Blue',     bg: '#EEF3FC', dot: '#004AAD' },
  { id: 'rose',     label: 'Rose',     bg: '#F8F0EE', dot: '#A03030' },
  { id: 'sage',     label: 'Sage',     bg: '#EDF3EE', dot: '#1A6B2A' },
  { id: 'sand',     label: 'Sand',     bg: '#F5F0E8', dot: '#8B5E2A' },
  { id: 'lavender', label: 'Lavender', bg: '#F0EDF8', dot: '#5020A0' },
];

function applyTheme(id: string) {
  if (id === 'default') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', id);
  }
  localStorage.setItem('portfolio-theme', id);
}

export function ThemePicker() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('default');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('portfolio-theme') || 'default';
    setCurrent(saved);
    applyTheme(saved);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = (id: string) => {
    setCurrent(id);
    applyTheme(id);
    setOpen(false);
  };

  const active = THEMES.find(t => t.id === current) ?? THEMES[0];

  return (
    <div ref={ref} className="relative flex items-center">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Change colour theme"
        className="w-6 h-6 rounded-full border border-border-dark flex items-center justify-center transition-transform hover:scale-110"
        style={{ background: active.bg }}
      >
        <span className="w-2.5 h-2.5 rounded-full block" style={{ background: active.dot }} />
      </button>

      {open && (
        <div className="absolute right-0 top-9 flex items-center gap-2 px-3 py-2.5 bg-bg-card border border-border rounded-xl shadow-lg z-50">
          {THEMES.map(theme => (
            <button
              key={theme.id}
              onClick={() => handleSelect(theme.id)}
              title={theme.label}
              className="w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110"
              style={{
                background: theme.bg,
                outline: current === theme.id ? `2px solid ${theme.dot}` : '2px solid transparent',
                outlineOffset: '2px',
              }}
            >
              <span className="w-2.5 h-2.5 rounded-full block" style={{ background: theme.dot }} />
            </button>
          ))}
          {current !== 'default' && (
            <button
              onClick={() => handleSelect('default')}
              title="Reset to default"
              className="ml-1 text-[11px] text-text-muted hover:text-text-primary transition-colors tracking-wide leading-none"
            >
              ↺
            </button>
          )}
        </div>
      )}
    </div>
  );
}
