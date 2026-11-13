import { Reveal } from "@/components/motion/Reveal";
import { memberCount, units } from "@/content/notebook";
import { SectionHeader } from "./SectionHeader";

export const Team = () => (
  <section id="team" className="scroll-mt-16 border-t border-line py-24 md:py-32">
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      <SectionHeader
        title="The team"
        intro={`${memberCount} members in ${units.length} ${units.length === 1 ? "unit" : "units"}. We split up the work at our first meeting.`}
      />

      <div className="grid gap-4 md:grid-cols-3">
        {units.map((unit, i) => (
          <Reveal key={`${unit.name}-${i}`} delay={i * 0.08} className="h-full">
            <article className="flex h-full flex-col rounded-2xl border border-line bg-surface p-6 md:p-8">
              <h3 className="text-2xl font-semibold">{unit.name}</h3>
              <p className="mt-2 leading-relaxed text-muted">{unit.focus}</p>
              <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-line pt-5">
                {unit.members.map((member, mi) => (
                  <li key={`${member}-${mi}`}>{member}</li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
