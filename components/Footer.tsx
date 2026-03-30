import Link from 'next/link';

const footerLinks = [
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/cv.pdf', label: 'CV', external: true },
];

const socialLinks = [
  { href: 'https://linkedin.com', label: 'LinkedIn' },
  { href: 'https://dribbble.com', label: 'Dribbble' },
  { href: 'https://instagram.com', label: 'Instagram' },
];

export function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-site mx-auto px-[--page-padding] py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <span className="font-script text-lg text-text-secondary">hridyachopra</span>

        <ul className="flex flex-wrap gap-6 md:gap-8">
          {footerLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="text-[12px] uppercase tracking-[0.08em] text-text-muted hover:text-text-primary transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
          {socialLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] uppercase tracking-[0.08em] text-text-muted hover:text-text-primary transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <span className="text-[12px] text-text-muted tracking-[0.04em]">© 2025</span>
      </div>
    </footer>
  );
}
