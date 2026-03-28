'use client';

import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('light', savedTheme === 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('light', newTheme === 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 rounded-full border border-current flex items-center justify-center transition-all duration-200 hover:bg-text-primary hover:text-bg-primary"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1" />
          <line x1="8" y1="1" x2="8" y2="2.5" stroke="currentColor" strokeWidth="1" />
          <line x1="8" y1="13.5" x2="8" y2="15" stroke="currentColor" strokeWidth="1" />
          <line x1="15" y1="8" x2="13.5" y2="8" stroke="currentColor" strokeWidth="1" />
          <line x1="2.5" y1="8" x2="1" y2="8" stroke="currentColor" strokeWidth="1" />
          <line x1="12.5" y1="3.5" x2="11.5" y2="4.5" stroke="currentColor" strokeWidth="1" />
          <line x1="4.5" y1="11.5" x2="3.5" y2="12.5" stroke="currentColor" strokeWidth="1" />
          <line x1="12.5" y1="12.5" x2="11.5" y2="11.5" stroke="currentColor" strokeWidth="1" />
          <line x1="4.5" y1="4.5" x2="3.5" y2="3.5" stroke="currentColor" strokeWidth="1" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 7.3 14.89 6.63 14.69 6C13.5 8.5 11 10 8 10C4.5 10 2 7.5 2 4C2 2.5 2.5 1.2 3.31 0.31C3.21 0.31 3.11 0.31 3 0.31C2.66 0.52 2.34 0.76 2.05 1.03C1.39 1.68 0.85 2.46 0.47 3.32C0.16 4.03 0 4.79 0 5.58C0 9.44 3.13 12.58 7 12.58C9.21 12.58 11.21 11.58 12.47 10C13.42 8.84 14 7.37 14 5.79C14 3.58 12.79 1.68 11 0.68C9.87 0.24 8.95 0 8 0V1Z" fill="currentColor"/>
        </svg>
      )}
    </button>
  );
}
