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

// Convert hex → [r,g,b] 0-255
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
}

// Convert [r,g,b] → hex
function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r,g,b].map(v => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2,'0')).join('');
}

// Mix a colour with white/black by amount (0=original, 1=white/black)
function tint(hex: string, amount: number) {
  const [r,g,b] = hexToRgb(hex);
  return rgbToHex(r+(255-r)*amount, g+(255-g)*amount, b+(255-b)*amount);
}
function shade(hex: string, amount: number) {
  const [r,g,b] = hexToRgb(hex);
  return rgbToHex(r*(1-amount), g*(1-amount), b*(1-amount));
}

// Derive a full palette from any accent colour and apply it inline
function applyCustomColor(accent: string) {
  const html = document.documentElement;
  html.classList.remove('dark');
  html.removeAttribute('data-theme');
  html.style.setProperty('--color-bg',             tint(accent, 0.88));
  html.style.setProperty('--color-bg-card',         '#ffffff');
  html.style.setProperty('--color-bg-overlay',      tint(accent, 0.80));
  html.style.setProperty('--color-text-primary',    shade(accent, 0.75));
  html.style.setProperty('--color-text-secondary',  shade(accent, 0.40));
  html.style.setProperty('--color-text-muted',      tint(accent, 0.30));
  html.style.setProperty('--color-accent',          accent);
  html.style.setProperty('--color-accent-light',    tint(accent, 0.75));
  html.style.setProperty('--color-border',          tint(accent, 0.65));
  html.style.setProperty('--color-border-dark',     tint(accent, 0.45));
  localStorage.setItem('portfolio-theme', 'custom');
  localStorage.setItem('portfolio-custom-color', accent);
}

function clearInlineVars() {
  const props = ['--color-bg','--color-bg-card','--color-bg-overlay','--color-text-primary',
    '--color-text-secondary','--color-text-muted','--color-accent','--color-accent-light',
    '--color-border','--color-border-dark'];
  props.forEach(p => document.documentElement.style.removeProperty(p));
}

function applyTheme(id: string, customColor?: string) {
  const html = document.documentElement;
  clearInlineVars();
  if (id === 'dark') {
    html.classList.add('dark');
    html.removeAttribute('data-theme');
  } else if (id === 'custom' && customColor) {
    applyCustomColor(customColor);
  } else {
    html.classList.remove('dark');
    id === 'default' ? html.removeAttribute('data-theme') : html.setAttribute('data-theme', id);
  }
  localStorage.setItem('portfolio-theme', id);
}

export function ThemeToggle() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('default');
  const [customColor, setCustomColor] = useState('#6B96CC');
  const ref = useRef<HTMLDivElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('portfolio-theme') || 'default';
    const savedColor = localStorage.getItem('portfolio-custom-color') || '#6B96CC';
    setCustomColor(savedColor);
    setCurrent(saved);
    if (saved === 'custom') {
      applyCustomColor(savedColor);
    } else {
      applyTheme(saved);
    }
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

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setCustomColor(color);
    setCurrent('custom');
    applyCustomColor(color);
  };

  const active = PALETTES.find(p => p.id === current);

  return (
    <div ref={ref} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">

      {/* Colour bar */}
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

          {/* Custom colour circle */}
          <div className="relative">
            <button
              title="Custom colour"
              onClick={() => colorInputRef.current?.click()}
              className="w-6 h-6 rounded-full transition-transform hover:scale-110 overflow-hidden"
              style={{
                background: 'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)',
                outline: current === 'custom' ? `2px solid ${customColor}` : '2px solid transparent',
                outlineOffset: '2px',
              }}
            />
            <input
              ref={colorInputRef}
              type="color"
              value={customColor}
              onChange={handleCustomChange}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
      )}

      {/* Moon button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 flex items-center justify-center rounded-full border border-border bg-bg-card text-text-secondary hover:text-text-primary shadow-sm hover:shadow-md transition-all duration-200"
        aria-label="Change theme"
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path d="M7.5 1C4.46 1 2 3.46 2 6.5C2 9.54 4.46 12 7.5 12C9.38 12 11.05 11.07 12.07 9.64C11.56 9.87 11 10 10.41 10C8.21 10 6.41 8.21 6.41 6C6.41 4.67 7.08 3.49 8.11 2.77C7.92 2.74 7.71 2.72 7.5 2.72V1Z" stroke="currentColor" strokeWidth="1" fill="none"/>
        </svg>
      </button>
    </div>
  );
}
