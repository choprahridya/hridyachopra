interface DividerMotifProps {
  className?: string;
}

export function DividerMotif({ className = '' }: DividerMotifProps) {
  return (
    <div aria-hidden="true" className={`divider-motif my-24 ${className}`}>
      * * *
    </div>
  );
}
