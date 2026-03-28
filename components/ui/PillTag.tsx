interface PillTagProps {
  children: React.ReactNode;
  variant?: 'default' | 'filled';
  className?: string;
}

export function PillTag({ children, variant = 'default', className = '' }: PillTagProps) {
  const baseStyles = 'inline-block px-3 py-1 rounded-pill text-xs uppercase tracking-wider transition-all duration-200';

  const variantStyles = {
    default: 'border border-current text-text-secondary hover:text-text-primary hover:border-text-primary',
    filled: 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20'
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
