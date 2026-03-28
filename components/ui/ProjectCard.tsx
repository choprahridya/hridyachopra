import Link from 'next/link';
import { Heading, Button } from './';

interface ProjectCardProps {
  id: string;
  title: string;
  color: string;
  className?: string;
}

export function ProjectCard({ id, title, color, className = '' }: ProjectCardProps) {
  return (
    <Link
      href={`/work/${id}`}
      className={`relative rounded-lg overflow-hidden h-96 group block ${className}`}
    >
      <div
        className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
        style={{ backgroundColor: color, opacity: 0.3 }}
      />
      <div className="relative z-10 h-full flex items-end p-12">
        <div>
          <Heading level={2} className="mb-4">
            {title}
          </Heading>
          <Button href={`/work/${id}`} arrow variant="primary">
            View project
          </Button>
        </div>
      </div>
    </Link>
  );
}
