interface PillTagProps {
  children: React.ReactNode;
  variant?: 'default' | 'filled';
  className?: string;
}

export function PillTag({ children, variant = 'default', className = '' }: PillTagProps) {
  const baseStyles = 'inline-block px-5 py-2 rounded-pill text-xs uppercase tracking-wider font-bold transition-all duration-300 hover:scale-105';

  const variantStyles = {
    default: 'border-2 border-border text-text-secondary hover:text-accent hover:border-accent hover:shadow-sm',
    filled: 'bg-accent text-white border-2 border-accent shadow-md hover:shadow-[0_0_20px_var(--color-accent)]'
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
