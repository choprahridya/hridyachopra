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
  const baseStyles = 'inline-flex items-center gap-2 px-8 py-4 rounded-pill text-sm font-bold uppercase tracking-wider transition-all duration-300 relative overflow-hidden group hover:shadow-xl hover:scale-[1.02]';

  const variantStyles = {
    primary: 'bg-accent text-white hover:shadow-[0_0_30px_var(--color-accent)] border-2 border-accent',
    secondary: 'border-2 border-accent text-accent hover:bg-accent hover:text-white hover:shadow-[0_0_30px_var(--color-accent)]',
    ghost: 'text-text-secondary hover:text-accent border-2 border-transparent hover:border-accent'
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
