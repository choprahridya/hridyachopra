'use client';

import { useEffect, useState, useRef } from 'react';

const PALETTES = [
  { id: 'default',  label: 'Blue',     bg: '#EEF3FC', dot: '#004AAD' },
  { id: 'rose',     label: 'Rose',     bg: '#F8F0EE', dot: '#A03030' },
  { id: 'sage',     label: 'Sage',     bg: '#EDF3EE', dot: '#1A6B2A' },
  { id: 'sand',     label: 'Sand',     bg: '#F5F0E8', dot: '#8B5E2A' },
  { id: 'lavender', label: 'Lavender', bg: '#F0EDF8', dot: '#5020A0' },
];

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
}
function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r,g,b].map(v => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2,'0')).join('');
}
function tint(hex: string, amount: number) {
  const [r,g,b] = hexToRgb(hex);
  return rgbToHex(r+(255-r)*amount, g+(255-g)*amount, b+(255-b)*amount);
}
function shade(hex: string, amount: number) {
  const [r,g,b] = hexToRgb(hex);
  return rgbToHex(r*(1-amount), g*(1-amount), b*(1-amount));
}

const INLINE_PROPS = ['--color-bg','--color-bg-card','--color-bg-overlay','--color-text-primary',
  '--color-text-secondary','--color-text-muted','--color-accent','--color-accent-light',
  '--color-border','--color-border-dark'];

function clearInlineVars() {
  INLINE_PROPS.forEach(p => document.documentElement.style.removeProperty(p));
}

function applyCustomColor(accent: string) {
  const html = document.documentElement;
  clearInlineVars();
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
}

function applyPreset(id: string) {
  const html = document.documentElement;
  clearInlineVars();
  html.classList.remove('dark');
  id === 'default' ? html.removeAttribute('data-theme') : html.setAttribute('data-theme', id);
}

export function ThemeToggle() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('default');
  const [customColor, setCustomColor] = useState('#6B96CC');
  const ref = useRef<HTMLDivElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    applyPreset('default');
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
    applyPreset(id);
    setOpen(false);
  };

  const handleReset = () => {
    setCurrent('default');
    applyPreset('default');
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

      {open && (
        <div className="flex items-center gap-2 px-3 py-2 bg-bg-card border border-border rounded-full shadow-md">

          {/* Preset swatches */}
          {PALETTES.map(palette => (
            <button
              key={palette.id}
              onClick={() => handleSelect(palette.id)}
              title={palette.label}
              className="w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110 flex-shrink-0"
              style={{
                background: palette.bg,
                outline: current === palette.id ? `2px solid ${palette.dot}` : '2px solid transparent',
                outlineOffset: '2px',
              }}
            >
              <span className="w-2.5 h-2.5 rounded-full block" style={{ background: palette.dot }} />
            </button>
          ))}

          {/* Divider */}
          <span className="w-px h-4 bg-border flex-shrink-0" />

          {/* Custom colour */}
          <div className="relative flex-shrink-0">
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
            />
          </div>

          {/* Reset */}
          <button
            onClick={handleReset}
            title="Reset to default"
            disabled={current === 'default'}
            className="text-[14px] text-text-muted hover:text-text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
          >
            ↺
          </button>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 flex items-center justify-center rounded-full border border-border bg-bg-card text-text-secondary hover:text-text-primary shadow-sm hover:shadow-md transition-all duration-200"
        aria-label="Change theme"
        style={active ? { background: active.bg } : undefined}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 1.5C4.41 1.5 1.5 4.41 1.5 8C1.5 11.59 4.41 14.5 8 14.5C8.83 14.5 9.5 13.83 9.5 13C9.5 12.61 9.35 12.26 9.1 12C8.87 11.75 8.72 11.41 8.72 11C8.72 10.17 9.39 9.5 10.22 9.5H11.5C13.16 9.5 14.5 8.16 14.5 6.5C14.5 3.74 11.54 1.5 8 1.5Z" stroke="currentColor" strokeWidth="1" fill="none"/>
          <circle cx="5.5" cy="6" r="1" fill="currentColor"/>
          <circle cx="8" cy="4" r="1" fill="currentColor"/>
          <circle cx="10.5" cy="6" r="1" fill="currentColor"/>
        </svg>
      </button>
    </div>
  );
}
