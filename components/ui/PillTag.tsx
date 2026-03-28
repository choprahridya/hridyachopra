interface PillTagProps {
  children: React.ReactNode;
  variant?: 'default' | 'filled';
  className?: string;
}

export function PillTag({ children, variant = 'default', className = '' }: PillTagProps) {
  const baseStyles = 'inline-block px-4 py-1.5 rounded-pill text-xs uppercase tracking-wider font-medium transition-all duration-300 hover:scale-105';

  const variantStyles = {
    default: 'border border-current text-text-secondary hover:text-accent-primary hover:border-accent-primary hover:shadow-sm hover:shadow-accent-primary/10',
    filled: 'bg-gradient-accent text-white border border-accent-primary/30 shadow-sm shadow-accent-primary/20 hover:shadow-md hover:shadow-accent-primary/30'
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
