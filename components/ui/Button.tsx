import Link from 'next/link';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary';
  className?: string;
  external?: boolean;
}

export function Button({
  children,
  href,
  onClick,
  type = 'button',
  variant = 'primary',
  className = '',
  external = false,
}: ButtonProps) {
  const primaryStyles = `
    inline-flex items-center gap-2 px-7 py-3
    border border-text-primary rounded-pill
    text-[13px] font-medium text-text-primary
    tracking-[0.04em] bg-transparent
    transition-colors duration-[--transition-normal]
    hover:bg-text-primary hover:text-bg
  `;

  const secondaryStyles = `
    inline-flex items-center gap-2
    text-[13px] text-text-secondary
    transition-colors duration-[--transition-normal]
    hover:text-text-primary border-b border-transparent
    hover:border-text-secondary pb-px
  `;

  const styles = `${variant === 'primary' ? primaryStyles : secondaryStyles} ${className}`;

  if (href) {
    return (
      <Link
        href={href}
        className={styles}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={styles}>
      {children}
    </button>
  );
}
