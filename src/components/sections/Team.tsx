import { Reveal } from "@/components/motion/Reveal";
import { memberCount, units } from "@/content/notebook";
import { SectionHeader } from "./SectionHeader";

export const Team = () => (
  <section id="team" className="scroll-mt-16 border-t border-line py-24 md:py-36">
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      <SectionHeader
        index="03"
        eyebrow={`The crew · ${memberCount} members`}
        title="Three units. One team."
        intro="Roles were set at our first meeting so everyone knows what they own — and who to call when it breaks."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {units.map((unit, i) => (
          <Reveal key={unit.name} delay={i * 0.08} className="h-full">
            <article
              data-cursor="hover"
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface p-6 transition-colors duration-300 hover:border-accent/60 md:p-8"
            >
              <span
                aria-hidden
                className="absolute -top-px right-6 left-6 h-px origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-x-100"
              />
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-xs text-accent">U{i + 1}</span>
                <span className="font-mono text-xs text-muted">{unit.members.length} members</span>
              </div>
              <h3 className="mt-8 text-2xl font-semibold">{unit.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{unit.focus}</p>
              <ul className="mt-8 flex flex-wrap gap-2 pt-2">
                {unit.members.map((member) => (
                  <li
                    key={member}
                    className="rounded-full border border-line-strong px-3 py-1.5 text-sm transition-colors group-hover:border-line-strong hover:!border-accent hover:text-accent"
                  >
                    {member}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
