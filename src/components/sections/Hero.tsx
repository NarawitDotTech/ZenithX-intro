import { HeroGrid } from "@/components/motion/HeroGrid";
import { HeroLogo } from "@/components/motion/HeroLogo";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { memberCount, phases, team, units } from "@/content/notebook";

const stats = [
  { value: String(memberCount), label: "Team members" },
  { value: String(units.length), label: "Units" },
  { value: String(phases.length), label: "Build phases" },
  { value: "1+", label: "Award target" },
];

export const Hero = () => (
  <section id="top" className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden pt-28 pb-12">
    <HeroGrid />
    <div className="relative mx-auto w-full max-w-7xl px-4 md:px-8">
      <HeroLogo className="mb-8 w-24 md:pointer-events-none md:absolute md:-top-40 md:right-8 md:mb-0 md:w-[min(28vw,400px)]" />
      <Reveal>
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-muted">
          FIRST Tech Challenge · {team.season} · Engineering notebook
        </p>
      </Reveal>

      <SplitHeading
        text={team.name.toUpperCase()}
        as="h1"
        trigger="load"
        className="text-[clamp(4rem,17vw,15rem)] md:text-[clamp(4rem,12.5vw,13rem)] font-bold leading-[0.85] tracking-[-0.04em]"
      />

      <div className="mt-8 grid gap-10 md:mt-10 md:grid-cols-[1fr_auto] md:items-end">
        <Reveal delay={0.4}>
          <p className="max-w-xl text-lg leading-relaxed text-muted md:text-xl">
            Team <span className="font-mono text-text">#{team.number}</span>. Thirteen students, three
            units, one robot — and the notebook of how we&apos;re building it.
          </p>
        </Reveal>
        <Reveal delay={0.55}>
          <div className="flex flex-wrap gap-3">
            <Magnetic>
              <a
                href="#log"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 font-medium text-[var(--accent-ink)] transition-[filter] hover:brightness-110"
              >
                Read the season log
                <span aria-hidden>↓</span>
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#robot"
                className="inline-flex h-12 items-center rounded-full border border-line-strong px-6 font-medium transition-colors hover:border-accent hover:text-accent"
              >
                See the robot
              </a>
            </Magnetic>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.7}>
        <dl className="mt-16 grid grid-cols-2 border-t border-line md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="border-b border-line py-5 pr-4 md:border-b-0">
              <dt className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{stat.label}</dt>
              <dd className="mt-1 text-3xl font-semibold tabular-nums md:text-4xl">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </div>
  </section>
);
