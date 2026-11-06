import { Logo } from "@/components/Logo";
import { Magnetic } from "@/components/motion/Magnetic";
import { team } from "@/content/notebook";

export const Footer = () => (
  <footer className="relative overflow-hidden border-t border-line">
    <div className="mx-auto max-w-7xl px-4 pt-24 pb-10 md:px-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{team.season} · Season in progress</p>
      <p className="mt-4 max-w-2xl text-3xl font-semibold leading-tight md:text-5xl">
        More pages get written every meeting.
      </p>
      <div className="mt-8">
        <Magnetic>
          <a
            href="#top"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-line-strong px-6 font-medium transition-colors hover:border-accent hover:text-accent"
          >
            Back to top <span aria-hidden>↑</span>
          </a>
        </Magnetic>
      </div>

        <div className="mt-20 flex items-end justify-between gap-6">
        <p
          aria-hidden
          className="text-[clamp(4rem,20vw,18rem)] leading-[0.8] font-bold tracking-[-0.05em] text-transparent select-none [-webkit-text-stroke:1px_var(--line-strong)]"
        >
          {team.number}
        </p>
      <Logo className="hidden w-[min(22vw,260px)] shrink-0 text-accent sm:block" />
      </div>

      <div className="mt-8 flex flex-col justify-between gap-2 border-t border-line pt-6 font-mono text-xs text-muted sm:flex-row">
        <span className="flex items-center gap-2">
          <Logo className="h-4 w-auto text-accent" />
          {team.name} · FTC Team #{team.number}
        </span>
        <span>Built from our engineering notebook</span>
      </div>
    </div>
  </footer>
);
