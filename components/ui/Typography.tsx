interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  level?: 1 | 2 | 3;
}

export function Heading({ children, className = '', level = 1 }: HeadingProps) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3';
  const sizeMap = {
    1: 'text-[length:var(--text-h1)] leading-[var(--lh-tight)]',
    2: 'text-[length:var(--text-h2)] leading-[var(--lh-tight)]',
    3: 'text-[length:var(--text-h3)] leading-[var(--lh-normal)]',
  };
  return (
    <Tag className={`font-serif font-normal ${sizeMap[level]} ${className}`}>
      {children}
    </Tag>
  );
}

interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Eyebrow({ children, className = '', style }: EyebrowProps) {
  return (
    <p
      className={`text-[length:var(--text-small)] uppercase tracking-[var(--ls-wide)] text-text-muted font-sans ${className}`}
      style={style}
    >
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
  const sizeMap = {
    sm:   'text-[length:var(--text-small)]',
    base: 'text-[length:var(--text-body)]',
    lg:   'text-[18px]',
  };
  return (
    <p className={`font-sans leading-[var(--lh-loose)] ${sizeMap[size]} ${className}`}>
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
    <span className={`text-[length:var(--text-small)] text-text-muted font-sans ${className}`}>
      {children}
    </span>
  );
}
