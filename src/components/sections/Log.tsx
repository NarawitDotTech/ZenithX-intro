import { PhotoFrame } from "@/components/PhotoFrame";
import { Reveal } from "@/components/motion/Reveal";
import { log } from "@/content/notebook";
import { SectionHeader } from "./SectionHeader";

export const Log = () => (
  <section id="log" className="scroll-mt-16 border-t border-line py-24 md:py-32">
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      <SectionHeader title="Season log" intro="Notes and photos from each meeting, oldest first." />

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
                <h3 className="mt-1 text-2xl font-semibold md:mt-0">{entry.title}</h3>
                {entry.tag ? <p className="mt-1 text-sm text-muted">{entry.tag}</p> : null}
                <div className="mt-4 space-y-4">
                  {entry.groups.map((group, gi) => (
                    <div key={group.heading ?? gi}>
                      {group.heading ? <p className="mb-1 font-medium">{group.heading}</p> : null}
                      <ul className="list-disc space-y-1 pl-5 text-lg leading-relaxed text-muted marker:text-line-strong">
                        {group.items.map((item, ii) => (
                          <li key={`${ii}-${item}`}>{item}</li>
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
                  entry.photos.length === 1
                    ? "max-w-3xl"
                    : entry.photos.length === 2
                      ? "sm:grid-cols-2"
                      : "grid-cols-2 lg:grid-cols-4"
                }`}
              >
                {entry.photos.map((photo, pi) => (
                  <Reveal key={`${photo.src}-${pi}`} delay={pi * 0.06}>
                    <PhotoFrame
                      photo={photo}
                      className="aspect-[4/3]"
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      caption={`${entry.date}. ${photo.alt}`}
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
