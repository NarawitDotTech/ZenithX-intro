import { PhotoFrame } from "@/components/PhotoFrame";
import { Reveal } from "@/components/motion/Reveal";
import { competitionLine } from "@/content/notebook";
import { SectionHeader } from "./SectionHeader";

export const DriveTeam = () => (
  <section id="drive-team" className="scroll-mt-16 border-t border-line py-24 md:py-36">
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      <SectionHeader
        index="05"
        eyebrow="Competition line"
        title="Who drives? We played for it."
        intro="Drive-team spots were decided with a double-elimination bracket on the blackboard — winner line, loser line, final rankings."
      />

      <div className="grid gap-10 md:grid-cols-[1.5fr_1fr] md:items-center md:gap-16">
        <Reveal>
          <PhotoFrame
            photo={competitionLine.photo}
            sizes="(min-width: 768px) 60vw, 100vw"
            caption="The competition-line bracket, as drawn on the board"
          />
        </Reveal>

        <ol className="space-y-3">
          {competitionLine.rankings.map((rank, i) => (
            <li key={`${rank.place}-${rank.name}`}>
              <Reveal delay={i * 0.1}>
                <div
                  data-cursor="hover"
                  className={`flex items-center gap-5 rounded-2xl border p-5 transition-colors ${
                    rank.place === 1 ? "border-accent bg-accent-soft" : "border-line bg-surface hover:border-line-strong"
                  }`}
                >
                  <span
                    className={`font-mono text-4xl font-bold tabular-nums ${rank.place === 1 ? "text-accent" : "text-muted"}`}
                  >
                    {rank.place}
                  </span>
                  <div>
                    <p className="text-xl font-semibold">{rank.name}</p>
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{rank.role}</p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </div>
  </section>
);
