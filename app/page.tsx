import { Heading, BodyText, PillTag, Button } from '@/components/ui';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-8">
      <div className="max-w-4xl">
        <Heading level={1} className="mb-6">
          hridyachopra
        </Heading>

        <BodyText className="mb-8 text-text-secondary max-w-2xl">
          UI/UX & brand designer crafting considered digital experiences
        </BodyText>

        <div className="flex gap-3 mb-12 flex-wrap">
          <PillTag>UI/UX</PillTag>
          <PillTag>Brand</PillTag>
          <PillTag>Strategy</PillTag>
          <PillTag>2025</PillTag>
        </div>

        <div className="flex gap-4">
          <Button href="/work" arrow>View Work</Button>
          <Button href="/about" variant="ghost">About</Button>
        </div>
      </div>
    </main>
  );
}
