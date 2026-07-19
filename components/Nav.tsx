'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';


const navLinks = [
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
];

export function Nav() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'border-b border-border' : ''
        }`}
        style={{
          background: isScrolled ? 'color-mix(in srgb, var(--color-bg) 92%, transparent)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(8px)' : 'none',
        }}
      >
        <div className="max-w-site mx-auto px-[--page-padding] h-16 flex items-center justify-between">
          {/* Wordmark */}
          <Link
            href="/"
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              window.dispatchEvent(new CustomEvent('puzzleReset'));
            }}
          >
            <span className="font-sans text-sm text-text-muted">*</span>
            <span className="font-script text-xl text-text-primary">hridyachopra</span>
            <span className="font-sans text-sm text-text-muted">*</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              const showLine = isActive || hoveredLink === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => setHoveredLink(link.href)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className={`text-[13px] uppercase tracking-[0.1em] transition-colors ${
                    isActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {link.label}
                  <span
                    className="block h-px bg-text-primary mt-0.5"
                    style={{
                      width: showLine ? '100%' : '0%',
                      transition: 'width 0.3s cubic-bezier(0.25, 0, 0, 1)',
                    }}
                  />
                </Link>
              );
            })}
            <a
              href="/cv.pdf"
              download
              className="group text-[13px] uppercase tracking-[0.1em] text-text-secondary hover:text-text-primary transition-colors"
            >
              Resume
              <span
                className="block h-px bg-text-primary mt-0.5 w-0 group-hover:w-full"
                style={{ transition: 'width 0.3s cubic-bezier(0.25, 0, 0, 1)' }}
              />
            </a>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-10 h-10 flex flex-col items-center justify-center gap-1.5"
              aria-label="Toggle menu"
            >
              <span className={`block w-5 h-px bg-text-primary transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block w-5 h-px bg-text-primary transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-px bg-text-primary transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-bg md:hidden flex flex-col items-center justify-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-script text-3xl text-text-primary hover:text-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="/cv.pdf"
            download
            className="font-script text-3xl text-text-primary hover:text-accent transition-colors"
          >
            Resume
          </a>
        </div>
      )}
    </>
  );
}
