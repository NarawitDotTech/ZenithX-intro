import { Reveal } from "@/components/motion/Reveal";

type SectionHeaderProps = {
  title: string;
  intro?: string;
};

export const SectionHeader = ({ title, intro }: SectionHeaderProps) => (
  <Reveal as="header" className="mb-12 max-w-3xl md:mb-16">
    <h2 className="text-4xl font-semibold leading-[1.05] tracking-tight text-balance md:text-5xl">{title}</h2>
    {intro ? <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{intro}</p> : null}
  </Reveal>
);
