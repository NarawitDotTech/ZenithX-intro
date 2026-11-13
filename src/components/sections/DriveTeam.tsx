import { PhotoFrame } from "@/components/PhotoFrame";
import { Reveal } from "@/components/motion/Reveal";
import { competitionLine } from "@/content/notebook";
import { SectionHeader } from "./SectionHeader";

export const DriveTeam = () => (
  <section id="drive-team" className="scroll-mt-16 border-t border-line py-24 md:py-32">
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      <SectionHeader
        title="Drive team"
        intro="We picked our drivers with a double-elimination bracket on the board. These are the final rankings."
      />

      <div className="grid gap-10 md:grid-cols-[1.5fr_1fr] md:items-center md:gap-16">
        <Reveal>
          <PhotoFrame
            photo={competitionLine.photo}
            sizes="(min-width: 768px) 60vw, 100vw"
            caption={competitionLine.photo.alt}
          />
        </Reveal>

        <ol className="space-y-3">
          {competitionLine.rankings.map((rank, i) => (
            <li key={`${rank.place}-${rank.name}`}>
              <Reveal delay={i * 0.1}>
                <div
                  className={`flex items-center gap-5 rounded-2xl border p-5 ${
                    rank.place === 1 ? "border-accent bg-accent-soft" : "border-line bg-surface"
                  }`}
                >
                  <span
                    className={`w-6 font-mono text-3xl font-bold tabular-nums ${rank.place === 1 ? "text-accent" : "text-muted"}`}
                  >
                    {rank.place}
                  </span>
                  <div>
                    <p className="text-xl font-semibold">{rank.name}</p>
                    <p className="text-sm text-muted">{rank.role}</p>
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
