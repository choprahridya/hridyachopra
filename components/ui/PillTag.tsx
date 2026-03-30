interface PillTagProps {
  children: React.ReactNode;
  className?: string;
}

export function PillTag({ children, className = '' }: PillTagProps) {
  return (
    <span className={`pill ${className}`}>
      {children}
    </span>
  );
}
