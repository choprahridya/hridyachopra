interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function Heading({ children, className = '', level = 1 }: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  const sizeStyles = {
    1: 'text-[var(--text-hero)] leading-[0.95]',
    2: 'text-[var(--text-3xl)] leading-[1.1]',
    3: 'text-[var(--text-2xl)] leading-[1.2]',
    4: 'text-[var(--text-xl)] leading-[1.3]',
    5: 'text-[var(--text-lg)] leading-[1.4]',
    6: 'text-[var(--text-base)] leading-[1.5]'
  };

  return (
    <Tag className={`font-serif font-semibold ${sizeStyles[level]} ${className}`}>
      {children}
    </Tag>
  );
}

interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
}

export function Eyebrow({ children, className = '' }: EyebrowProps) {
  return (
    <p className={`text-[var(--text-xs)] uppercase tracking-[0.1em] text-text-tertiary ${className}`}>
      {children}
    </p>
  );
}

interface BodyTextProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'base' | 'lg';
}

export function BodyText({ children, className = '', size = 'base' }: BodyTextProps) {
  const sizeStyles = {
    sm: 'text-[var(--text-sm)]',
    base: 'text-[var(--text-base)]',
    lg: 'text-[var(--text-lg)]'
  };

  return (
    <p className={`font-sans leading-[1.8] ${sizeStyles[size]} ${className}`}>
      {children}
    </p>
  );
}

interface MetaTextProps {
  children: React.ReactNode;
  className?: string;
}

export function MetaText({ children, className = '' }: MetaTextProps) {
  return (
    <span className={`text-[var(--text-sm)] text-text-tertiary ${className}`}>
      {children}
    </span>
  );
}
