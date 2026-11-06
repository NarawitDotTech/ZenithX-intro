import { SplitHeading } from "@/components/motion/SplitHeading";

type SectionHeaderProps = {
  index: string;
  eyebrow: string;
  title: string;
  intro?: string;
};

export const SectionHeader = ({ index, eyebrow, title, intro }: SectionHeaderProps) => (
  <header className="mb-14 max-w-3xl md:mb-20">
    <p className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
      <span className="text-accent">{index}</span>
      <span className="h-px w-8 bg-line-strong" aria-hidden />
      {eyebrow}
    </p>
    <SplitHeading
      text={title}
      as="h2"
      className="text-4xl font-semibold leading-[1.05] tracking-tight text-balance md:text-6xl"
    />
    {intro ? <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{intro}</p> : null}
  </header>
);
