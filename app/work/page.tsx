'use client';

import { useState } from 'react';
import { Disc, type Project } from '@/components/Disc';
import { Heading, Eyebrow, PillTag, Button, MetaText } from '@/components/ui';

// Placeholder projects data
const projects: Project[] = [
  { id: '1', title: 'Brand Identity', thumbnail: '', color: '#c0392b' },
  { id: '2', title: 'App Redesign', thumbnail: '', color: '#8e44ad' },
  { id: '3', title: 'Design System', thumbnail: '', color: '#d35400' },
  { id: '4', title: 'Visual Identity', thumbnail: '', color: '#27ae60' },
  { id: '5', title: 'E-commerce UX', thumbnail: '', color: '#2980b9' },
  { id: '6', title: 'Wayfinding', thumbnail: '', color: '#16a085' },
];

export default function WorkPage() {
  const [activeProject, setActiveProject] = useState(projects[0]);

  return (
    <main className="min-h-screen pt-20">
      {/* Split layout */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left panel - Dark with disc (44% width) */}
        <div className="lg:w-[44%] bg-bg-primary flex items-center justify-end px-8 py-16 lg:py-0">
          <div className="lg:translate-x-[20%]">
            <Disc projects={projects} onActiveProjectChange={setActiveProject} />
          </div>
        </div>

        {/* Right panel - Light with project info (56% width) */}
        <div className="lg:w-[56%] bg-bg-light text-text-dark flex items-center px-8 lg:px-16 py-16 lg:py-0">
          <div className="max-w-xl">
            <Eyebrow className="mb-4 text-text-dark opacity-40">
              SELECTED WORK ✳
            </Eyebrow>

            <MetaText className="mb-6 text-text-dark opacity-40">
              01 — {projects.length.toString().padStart(2, '0')}
            </MetaText>

            <Heading level={2} className="mb-6 text-text-dark">
              {activeProject.title}
            </Heading>

            <div className="flex gap-2 mb-6 flex-wrap">
              <PillTag>Brand</PillTag>
              <PillTag>Identity</PillTag>
              <PillTag>2024</PillTag>
            </div>

            <MetaText className="mb-8 text-text-dark opacity-60">
              Client · 2024 · 8 weeks
            </MetaText>

            <Button href={`/work/${activeProject.id}`} arrow variant="primary">
              View case study
            </Button>

            {/* Dot nav indicators */}
            <div className="flex gap-2 mt-12">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className={`h-2 rounded-full transition-all ${
                    project.id === activeProject.id
                      ? 'w-8 bg-text-dark'
                      : 'w-2 bg-text-dark opacity-20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
