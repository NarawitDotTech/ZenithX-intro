import { Reveal } from "@/components/motion/Reveal";
import { goals, phases, process, workStyle } from "@/content/notebook";
import { SectionHeader } from "./SectionHeader";

export const Process = () => (
  <section id="process" className="scroll-mt-16 border-t border-line py-24 md:py-36">
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      <SectionHeader
        index="01"
        eyebrow="How we build"
        title="From whiteboard to working robot."
        intro="Every project moves through the same path: align the whole team, write the plan down, then build in a fixed order and test as we go."
      />

      <ol className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
        {process.map((step, i) => (
          <li key={step.title} className="bg-bg p-6 md:p-8">
            <Reveal delay={i * 0.08}>
              <span className="font-mono text-xs text-accent">STEP {String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{step.body}</p>
            </Reveal>
          </li>
        ))}
      </ol>

      <div className="mt-20 md:mt-28">
        <Reveal>
          <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Build order</h3>
        </Reveal>
        <ol className="mt-6">
          {phases.map((phase, i) => (
            <li key={phase.code} className="border-t border-line last:border-b">
              <Reveal delay={i * 0.06}>
                <div
                  data-cursor="hover"
                  className="group grid items-baseline gap-2 py-8 transition-colors md:grid-cols-[120px_1fr_1.2fr] md:gap-8 md:py-10"
                >
                  <span className="font-mono text-sm text-muted transition-colors group-hover:text-accent">
                    {phase.code}
                  </span>
                  <span className="text-4xl font-semibold tracking-tight transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-2 md:text-6xl">
                    {phase.title}
                  </span>
                  <span className="leading-relaxed text-muted md:text-lg">{phase.body}</span>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-24 grid gap-14 md:mt-32 md:grid-cols-2 md:gap-20">
        <ValueList heading="How we work" items={workStyle} />
        <ValueList heading="Our goals" items={goals} />
      </div>
    </div>
  </section>
);

const ValueList = ({ heading, items }: { heading: string; items: string[] }) => (
  <div>
    <Reveal>
      <h3 className="text-2xl font-semibold md:text-3xl">{heading}</h3>
    </Reveal>
    <ul className="mt-6 space-y-px">
      {items.map((item, i) => (
        <li key={item}>
          <Reveal delay={i * 0.06}>
            <p className="flex gap-4 border-t border-line py-5 leading-relaxed text-muted">
              <span className="font-mono text-xs leading-7 text-accent">{String(i + 1).padStart(2, "0")}</span>
              <span>{item}</span>
            </p>
          </Reveal>
        </li>
      ))}
    </ul>
  </div>
);
