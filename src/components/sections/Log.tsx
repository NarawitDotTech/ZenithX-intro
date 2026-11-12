import { PhotoFrame } from "@/components/PhotoFrame";
import { Reveal } from "@/components/motion/Reveal";
import { log } from "@/content/notebook";
import { SectionHeader } from "./SectionHeader";

export const Log = () => (
  <section id="log" className="scroll-mt-16 border-t border-line py-24 md:py-36">
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      <SectionHeader
        index="04"
        eyebrow="Season log"
        title="Straight from the notebook."
        intro="Every meeting, what we decided, and what it looked like."
      />

      <ol className="relative md:ml-[180px]">
        <span aria-hidden className="absolute top-2 bottom-0 left-[5px] w-px bg-line md:-left-[1px]" />
        {log.map((entry) => (
          <li key={entry.key} className="relative pb-16 pl-10 last:pb-0 md:pl-14">
            <span
              aria-hidden
              className="absolute top-2 left-0 size-[11px] rounded-full border-2 border-accent bg-bg md:-left-[6px]"
            />
            <Reveal>
              <div className="md:relative">
                <time
                  dateTime={entry.iso}
                  className="font-mono text-sm text-accent md:absolute md:top-1 md:-left-[264px] md:w-[180px] md:text-right"
                >
                  {entry.date}
                </time>
                <h3 className="mt-1 flex flex-wrap items-center gap-3 text-2xl font-semibold md:mt-0">
                  {entry.title}
                  {entry.tag ? (
                    <span className="rounded-full bg-accent-soft px-2.5 py-0.5 font-mono text-xs font-normal text-accent">
                      {entry.tag}
                    </span>
                  ) : null}
                </h3>
                <div className="mt-4 space-y-4">
                  {entry.groups.map((group, gi) => (
                    <div key={group.heading ?? gi}>
                      {group.heading ? (
                        <p className="mb-1.5 font-mono text-xs uppercase tracking-[0.2em] text-muted">
                          {group.heading}
                        </p>
                      ) : null}
                      <ul className="space-y-1.5 text-lg leading-relaxed text-muted">
                        {group.items.map((item, ii) => (
                          <li key={`${ii}-${item}`} className="flex gap-3">
                            <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-line-strong" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {entry.photos ? (
              <div
                className={`mt-8 grid gap-3 ${
                  entry.photos.length === 1 ? "max-w-3xl" : entry.photos.length === 2 ? "sm:grid-cols-2" : "grid-cols-2 lg:grid-cols-4"
                }`}
              >
                {entry.photos.map((photo, pi) => (
                  <Reveal key={`${photo.src}-${pi}`} delay={pi * 0.06}>
                    <PhotoFrame
                      photo={photo}
                      className="aspect-[4/3]"
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      caption={`${entry.date} — ${photo.alt}`}
                    />
                  </Reveal>
                ))}
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  </section>
);
