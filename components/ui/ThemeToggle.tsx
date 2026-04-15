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

function applyCustomColor(accent: string, dark: boolean) {
  const html = document.documentElement;
  clearInlineVars();
  html.removeAttribute('data-theme');
  if (dark) {
    html.classList.add('dark');
    html.style.setProperty('--color-bg',             shade(accent, 0.93));
    html.style.setProperty('--color-bg-card',         shade(accent, 0.88));
    html.style.setProperty('--color-bg-overlay',      shade(accent, 0.84));
    html.style.setProperty('--color-text-primary',    tint(accent, 0.88));
    html.style.setProperty('--color-text-secondary',  tint(accent, 0.55));
    html.style.setProperty('--color-text-muted',      tint(accent, 0.25));
    html.style.setProperty('--color-accent',          tint(accent, 0.45));
    html.style.setProperty('--color-accent-light',    shade(accent, 0.82));
    html.style.setProperty('--color-border',          shade(accent, 0.78));
    html.style.setProperty('--color-border-dark',     shade(accent, 0.70));
  } else {
    html.classList.remove('dark');
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
}

function applyPreset(id: string, dark: boolean) {
  const html = document.documentElement;
  clearInlineVars();
  if (dark) html.classList.add('dark'); else html.classList.remove('dark');
  id === 'default' ? html.removeAttribute('data-theme') : html.setAttribute('data-theme', id);
}

export function ThemeToggle() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('default');
  const [isDark, setIsDark] = useState(false);
  const [customColor, setCustomColor] = useState('#6B96CC');
  const ref = useRef<HTMLDivElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    applyPreset('default', false);
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
    applyPreset(id, isDark);
    setOpen(false);
  };

  const handleToggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    if (current === 'custom') {
      applyCustomColor(customColor, next);
    } else {
      applyPreset(current, next);
    }
  };

  const handleReset = () => {
    setCurrent('default');
    setIsDark(false);
    applyPreset('default', false);
    setOpen(false);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setCustomColor(color);
    setCurrent('custom');
    applyCustomColor(color, isDark);
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

          {/* Divider */}
          <span className="w-px h-4 bg-border flex-shrink-0" />

          {/* Dark mode toggle */}
          <button
            onClick={handleToggleDark}
            title={isDark ? 'Switch to light' : 'Switch to dark'}
            className="w-6 h-6 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors flex-shrink-0"
          >
            {isDark ? (
              /* Sun */
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <circle cx="7.5" cy="7.5" r="3" stroke="currentColor" strokeWidth="1.2"/>
                <line x1="7.5" y1="1" x2="7.5" y2="2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="7.5" y1="12.5" x2="7.5" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="1" y1="7.5" x2="2.5" y2="7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="12.5" y1="7.5" x2="14" y2="7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="3" y1="3" x2="4.06" y2="4.06" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="10.94" y1="10.94" x2="12" y2="12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="12" y1="3" x2="10.94" y2="4.06" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="4.06" y1="10.94" x2="3" y2="12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            ) : (
              /* Moon */
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M12 9.5A6 6 0 0 1 4.5 2a6 6 0 1 0 7.5 7.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            title="Reset to default"
            disabled={current === 'default' && !isDark}
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
