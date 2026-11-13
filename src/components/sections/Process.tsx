import { Reveal } from "@/components/motion/Reveal";
import { goals, phases, process, workStyle } from "@/content/notebook";
import { SectionHeader } from "./SectionHeader";

export const Process = () => (
  <section id="process" className="scroll-mt-16 border-t border-line py-24 md:py-32">
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      <SectionHeader title="How we build" />

      <ol className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
        {process.map((step, i) => (
          <li key={step.title} className="bg-bg p-6 md:p-8">
            <Reveal delay={i * 0.08}>
              <h3 className="text-xl font-semibold">
                <span className="mr-2 text-accent">{i + 1}.</span>
                {step.title}
              </h3>
              <p className="mt-3 leading-relaxed text-muted">{step.body}</p>
            </Reveal>
          </li>
        ))}
      </ol>

      <div className="mt-20 md:mt-24">
        <Reveal>
          <h3 className="text-2xl font-semibold md:text-3xl">Build order</h3>
        </Reveal>
        <ol className="mt-6">
          {phases.map((phase, i) => (
            <li key={phase.title} className="border-t border-line last:border-b">
              <Reveal delay={i * 0.06}>
                <div className="grid items-baseline gap-2 py-7 md:grid-cols-[120px_1fr_1.2fr] md:gap-8 md:py-9">
                  <span className="text-sm text-muted">Phase {i + 1}</span>
                  <span className="text-3xl font-semibold tracking-tight md:text-5xl">{phase.title}</span>
                  <span className="leading-relaxed text-muted md:text-lg">{phase.body}</span>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-20 grid gap-14 md:mt-28 md:grid-cols-2 md:gap-20">
        <ValueList heading="Work style" items={workStyle} />
        <ValueList heading="Goals this season" items={goals} />
      </div>
    </div>
  </section>
);

const ValueList = ({ heading, items }: { heading: string; items: string[] }) => (
  <div>
    <Reveal>
      <h3 className="text-2xl font-semibold md:text-3xl">{heading}</h3>
    </Reveal>
    <ul className="mt-6">
      {items.map((item, i) => (
        <li key={item}>
          <Reveal delay={i * 0.06}>
            <p className="border-t border-line py-4 leading-relaxed text-muted">{item}</p>
          </Reveal>
        </li>
      ))}
    </ul>
  </div>
);
