import { Logo } from "@/components/Logo";
import { log, team } from "@/content/notebook";

const lastUpdate = log.at(-1)?.date;

export const Footer = () => (
  <footer className="border-t border-line">
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:flex-row sm:items-center sm:justify-between md:px-8">
      <div className="flex items-center gap-3">
        <Logo className="h-10 w-auto text-accent" />
        <div>
          <p className="font-semibold">{team.name}</p>
          <p className="text-sm text-muted">FIRST Tech Challenge team #{team.number}</p>
        </div>
      </div>
      <div className="flex items-center gap-6 text-sm text-muted">
        {lastUpdate ? <p>Last log entry: {lastUpdate}</p> : null}
        <a href="#top" className="transition-colors hover:text-text">
          Back to top
        </a>
      </div>
    </div>
  </footer>
);
