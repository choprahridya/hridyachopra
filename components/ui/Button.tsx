import Link from 'next/link';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  arrow?: boolean;
}

export function Button({
  children,
  href,
  onClick,
  type = 'button',
  variant = 'primary',
  className = '',
  arrow = false
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center gap-2 px-6 py-3 rounded-pill text-sm tracking-wide font-medium transition-all duration-300 relative overflow-hidden group hover:shadow-lg hover:scale-105';

  const variantStyles = {
    primary: 'border border-text-primary text-text-primary hover:bg-text-primary hover:text-bg-primary hover:shadow-text-primary/20',
    secondary: 'border-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-bg-primary hover:shadow-accent-primary/30',
    ghost: 'text-text-secondary hover:text-text-primary'
  };

  const content = (
    <>
      <span className="relative z-10">{children}</span>
      {arrow && <span className="relative z-10 transition-transform group-hover:translate-x-1">↗</span>}
      {variant !== 'ghost' && (
        <span className="absolute inset-0 bg-current transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out opacity-10" />
      )}
    </>
  );

  const styles = `${baseStyles} ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={styles}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={styles}>
      {content}
    </button>
  );
}
