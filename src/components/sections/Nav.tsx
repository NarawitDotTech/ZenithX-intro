import { Logo } from "@/components/Logo";
import { team } from "@/content/notebook";

const links = [
  { href: "#process", label: "Process" },
  { href: "#robot", label: "Robot" },
  { href: "#team", label: "Team" },
  { href: "#log", label: "Log" },
];

export const Nav = () => (
  <nav
    aria-label="Main"
    className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/70 backdrop-blur-md"
  >
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
      <a href="#top" aria-label={`${team.name} home`} className="flex items-center gap-2.5 font-semibold tracking-tight">
        <Logo className="h-8 w-auto text-accent" />
        <span className="hidden sm:inline">{team.name}</span>
      </a>
      <ul className="flex items-center gap-1 text-sm text-muted sm:gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="rounded-full px-2.5 py-2 transition-colors hover:text-text sm:px-3"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <span className="hidden rounded-full border border-line-strong px-3 py-1 font-mono text-xs text-muted md:inline">
        #{team.number}
      </span>
    </div>
  </nav>
);
