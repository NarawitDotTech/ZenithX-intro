import { PhotoFrame } from "@/components/PhotoFrame";
import { Reveal } from "@/components/motion/Reveal";
import { intake } from "@/content/notebook";
import { SectionHeader } from "./SectionHeader";

export const Robot = () => (
  <section id="robot" className="scroll-mt-16 border-t border-line py-24 md:py-32">
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      <SectionHeader title="The robot" />

      <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-center md:gap-16">
        <Reveal>
          <PhotoFrame photo={intake.render} sizes="(min-width: 768px) 60vw, 100vw" caption={intake.render.alt} />
        </Reveal>

        <div>
          <Reveal>
            <h3 className="text-2xl font-semibold md:text-3xl">{intake.title}</h3>
            <p className="mt-4 text-lg leading-relaxed text-muted">{intake.summary}</p>
          </Reveal>
          {intake.specs.length ? (
            <Reveal delay={0.1}>
              <dl className="mt-10 divide-y divide-line border-y border-line">
                {intake.specs.map((spec, si) => (
                  <div key={`${spec.label}-${si}`} className="flex items-baseline justify-between gap-6 py-4">
                    <dt className="text-muted">{spec.label}</dt>
                    <dd className="text-right font-medium">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          ) : null}
        </div>
      </div>
    </div>
  </section>
);
