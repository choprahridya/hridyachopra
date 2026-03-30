'use client';

import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const resolved = saved ?? 'light';
    setTheme(resolved);
    document.documentElement.classList.toggle('dark', resolved === 'dark');
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        /* Moon — click to go dark */
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.5 1C4.46 1 2 3.46 2 6.5C2 9.54 4.46 12 7.5 12C9.38 12 11.05 11.07 12.07 9.64C11.56 9.87 11 10 10.41 10C8.21 10 6.41 8.21 6.41 6C6.41 4.67 7.08 3.49 8.11 2.77C7.92 2.74 7.71 2.72 7.5 2.72V1Z" stroke="currentColor" strokeWidth="1" fill="none"/>
        </svg>
      ) : (
        /* Sun — click to go light */
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="7.5" cy="7.5" r="3" stroke="currentColor" strokeWidth="1"/>
          <line x1="7.5" y1="1" x2="7.5" y2="2.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
          <line x1="7.5" y1="12.5" x2="7.5" y2="14" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
          <line x1="14" y1="7.5" x2="12.5" y2="7.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
          <line x1="2.5" y1="7.5" x2="1" y2="7.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
          <line x1="12.1" y1="2.9" x2="11.04" y2="3.96" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
          <line x1="3.96" y1="11.04" x2="2.9" y2="12.1" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
          <line x1="12.1" y1="12.1" x2="11.04" y2="11.04" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
          <line x1="3.96" y1="3.96" x2="2.9" y2="2.9" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
        </svg>
      )}
    </button>
  );
}
