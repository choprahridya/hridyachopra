interface SkillRowProps {
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
}

export function SkillRow({ name, level }: SkillRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border text-[13px]">
      <span className="text-text-secondary">{name}</span>
      <div className="flex gap-1" aria-label={`${level} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full"
            style={{
              background: i < level ? 'var(--color-accent)' : 'var(--color-border-dark)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
