import { PhotoFrame } from "@/components/PhotoFrame";
import { Reveal } from "@/components/motion/Reveal";
import { intake } from "@/content/notebook";
import { SectionHeader } from "./SectionHeader";

export const Robot = () => (
  <section id="robot" className="relative scroll-mt-16 border-t border-line py-24 md:py-36">
    <div className="bp-grid pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      <SectionHeader
        index="02"
        eyebrow="The robot"
        title="An intake built to grab, guide and let go."
      />

      <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-center md:gap-16">
        <Reveal>
          <div className="relative">
            <PhotoFrame
              photo={intake.render}
              sizes="(min-width: 768px) 60vw, 100vw"
              caption="Robot CAD render from our engineering notebook"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute top-4 left-4 flex items-center gap-2 rounded-full border border-line-strong bg-bg/80 py-1 pr-3 pl-1 font-mono text-[11px] backdrop-blur"
            >
              <span className="grid h-5 place-items-center rounded-full bg-accent px-1.5 text-[10px] font-bold text-[var(--accent-ink)]">
                FIG.01
              </span>
              CAD render
            </span>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <h3 className="text-2xl font-semibold md:text-3xl">Intake method</h3>
            <p className="mt-4 text-lg leading-relaxed text-muted">{intake.summary}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <dl className="mt-10 divide-y divide-line border-y border-line">
              {intake.specs.map((spec) => (
                <div key={spec.label} className="flex items-baseline justify-between gap-6 py-4">
                  <dt className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{spec.label}</dt>
                  <dd className="text-right font-medium">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);
