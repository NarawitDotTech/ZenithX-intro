"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Logo } from "@/components/Logo";
import type { Photo, SiteContent } from "@/content/types";
import { DriveTeamEditor, LogEditor, RobotEditor, TeamEditor } from "./editors";
import {
  CONTENT_PATH,
  ConflictError,
  GitHubError,
  UPLOAD_DIR,
  loadFile,
  publish,
  verifyAccess,
  type NewFile,
  type RepoConfig,
} from "./github";
import { prepareImage, slugify } from "./image";
import { PhotoPreviewContext, PhotoUploadContext } from "./PhotoInput";
import { Button, Card, TextField } from "./ui";

// Where the site lives. Change the branch here (or in "Repository settings" on the
// sign-in screen) if Cloudflare is set to build from a different branch.
const DEFAULT_REPO = { owner: "NarawitDotTech", repo: "ZenithX-intro", branch: "ccr-90a2ad6d-nx7o6m" };

const STORAGE_KEY = "zx-admin";

const TABS = [
  { id: "log", label: "Season log" },
  { id: "robot", label: "Robot" },
  { id: "units", label: "Team" },
  { id: "driveTeam", label: "Drive team" },
] as const;
type TabId = (typeof TABS)[number]["id"];

const SECTION_NAMES: Record<keyof SiteContent, string> = {
  log: "season log",
  robot: "robot",
  units: "team",
  driveTeam: "drive team",
};

type PendingUpload = { base64: string; ext: "jpg" | "png" };

// ---------------------------------------------------------------- storage

const readSaved = (): Partial<RepoConfig> => {
  for (const store of [() => localStorage, () => sessionStorage]) {
    try {
      const raw = store().getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as Partial<RepoConfig>;
    } catch {
      /* storage blocked or bad JSON */
    }
  }
  return {};
};

const save = (cfg: RepoConfig, remember: boolean) => {
  try {
    (remember ? localStorage : sessionStorage).setItem(STORAGE_KEY, JSON.stringify(cfg));
  } catch {
    /* storage blocked: still works for this tab */
  }
};

const forget = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
};

// ---------------------------------------------------------------- content helpers

/** Drop blank lines/rows the editor allows while typing; newest log entries first. */
const tidy = (c: SiteContent): SiteContent => ({
  robot: {
    ...c.robot,
    specs: c.robot.specs
      .map((s) => ({ label: s.label.trim(), value: s.value.trim() }))
      .filter((s) => s.label || s.value),
  },
  units: c.units.map((u) => ({ ...u, members: u.members.map((m) => m.trim()).filter(Boolean) })),
  log: [...c.log]
    .map((e) => ({
      ...e,
      title: e.title.trim(),
      tag: e.tag.trim(),
      groups: e.groups
        .map((g) => ({ heading: g.heading.trim(), items: g.items.map((i) => i.trim()).filter(Boolean) }))
        .filter((g) => g.heading || g.items.length),
    }))
    .sort((a, b) => b.date.localeCompare(a.date)),
  driveTeam: {
    ...c.driveTeam,
    rankings: c.driveTeam.rankings
      .map((r) => ({ name: r.name.trim(), role: r.role.trim() }))
      .filter((r) => r.name),
  },
});

const problemsWith = (c: SiteContent) => {
  const problems: string[] = [];
  c.log.forEach((e, i) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(e.date)) problems.push(`Season log entry ${i + 1} needs a date.`);
    if (!e.title.trim()) problems.push(`The ${e.date || "undated"} season log entry needs a title.`);
  });
  c.units.forEach((u, i) => {
    if (!u.name.trim()) problems.push(`Team unit ${i + 1} needs a name.`);
  });
  if (!c.robot.title.trim()) problems.push("The robot section needs a heading.");
  return problems;
};

const changedSections = (a: SiteContent, b: SiteContent) =>
  (Object.keys(SECTION_NAMES) as (keyof SiteContent)[]).filter(
    (k) => JSON.stringify(a[k]) !== JSON.stringify(b[k]),
  );

// ---------------------------------------------------------------- app

type Session = { cfg: RepoConfig; saved: SiteContent; sha: string };

const loadSession = async (cfg: RepoConfig): Promise<Session> => {
  await verifyAccess(cfg);
  const file = await loadFile(cfg, CONTENT_PATH);
  return { cfg, saved: tidy(JSON.parse(file.text) as SiteContent), sha: file.sha };
};

const rememberedConfig = (): RepoConfig | null => {
  const saved = readSaved();
  return saved.token && saved.owner && saved.repo && saved.branch ? (saved as RepoConfig) : null;
};

// Rendered client-only (see page.tsx), so reading browser storage during render is safe.
export const AdminApp = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [booting, setBooting] = useState(() => rememberedConfig() !== null);

  // Sign back in with a remembered token.
  useEffect(() => {
    if (!booting) return;
    const cfg = rememberedConfig();
    if (!cfg) return;
    let cancelled = false;
    loadSession(cfg)
      .then((s) => {
        if (!cancelled) setSession(s);
      })
      .catch((err) => {
        // Only drop the saved token if GitHub rejected it, not on a network blip.
        if (err instanceof GitHubError && (err.status === 401 || err.status === 403)) forget();
      })
      .finally(() => {
        if (!cancelled) setBooting(false);
      });
    return () => {
      cancelled = true;
    };
  }, [booting]);

  if (booting) {
    return <Shell><p className="py-24 text-center text-muted" role="status">Loading…</p></Shell>;
  }

  if (!session) {
    return (
      <Shell>
        <SignIn
          onSignIn={async (cfg, remember) => {
            setSession(await loadSession(cfg));
            save(cfg, remember);
          }}
        />
      </Shell>
    );
  }

  return (
    <Editor
      session={session}
      onPublished={(saved, sha) => setSession({ ...session, saved, sha })}
      onReload={async () => {
        const fresh = await loadSession(session.cfg);
        setSession(fresh);
        return fresh.saved;
      }}
      onSignOut={() => {
        forget();
        setSession(null);
      }}
    />
  );
};

// ---------------------------------------------------------------- sign in

const SignIn = ({ onSignIn }: { onSignIn: (cfg: RepoConfig, remember: boolean) => Promise<void> }) => {
  const saved = useMemo(() => readSaved(), []);
  const [token, setToken] = useState("");
  const [owner, setOwner] = useState(saved.owner ?? DEFAULT_REPO.owner);
  const [repo, setRepo] = useState(saved.repo ?? DEFAULT_REPO.repo);
  const [branch, setBranch] = useState(saved.branch ?? DEFAULT_REPO.branch);
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const newTokenUrl = `https://github.com/settings/personal-access-tokens/new?name=${encodeURIComponent(
    "Zenith X site admin",
  )}&description=${encodeURIComponent("Edit the Zenith X website from /admin")}&contents=write`;

  return (
    <div className="mx-auto max-w-lg py-16">
      <Logo className="mb-8 h-14 w-auto text-accent" />
      <h1 className="text-3xl font-semibold">Site admin</h1>
      <p className="mt-2 text-muted">
        Edits are saved to the team&apos;s GitHub repository, then the live site rebuilds in a minute or two. Sign in
        with a GitHub token that can write to the repo.
      </p>

      <Card className="mt-8">
        <form
          className="space-y-5"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError("");
            try {
              await onSignIn({ token: token.trim(), owner: owner.trim(), repo: repo.trim(), branch: branch.trim() }, remember);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Couldn't sign in. Try again.");
            } finally {
              setBusy(false);
            }
          }}
        >
          <TextField
            label="GitHub token"
            type="password"
            autoComplete="off"
            spellCheck={false}
            required
            value={token}
            onChange={setToken}
            placeholder="github_pat_…"
            hint="Stays in this browser only. It's sent to GitHub and nowhere else."
          />

          <details className="rounded-lg border border-line px-4 py-3 text-sm">
            <summary className="cursor-pointer font-medium">How do I get a token?</summary>
            <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-muted">
              <li>
                Open{" "}
                <a href={newTokenUrl} target="_blank" rel="noreferrer" className="text-accent underline">
                  GitHub → new fine-grained token
                </a>{" "}
                (sign in as someone with access to the repo).
              </li>
              <li>
                Repository access: <span className="text-text">Only select repositories</span> → {owner}/{repo}.
              </li>
              <li>
                Permissions → Repository → <span className="text-text">Contents: Read and write</span>.
              </li>
              <li>Pick an expiry (e.g. end of season), generate, and paste it above.</li>
            </ol>
          </details>

          <details className="rounded-lg border border-line px-4 py-3 text-sm">
            <summary className="cursor-pointer font-medium">Repository settings</summary>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <TextField label="Owner" value={owner} onChange={setOwner} />
              <TextField label="Repository" value={repo} onChange={setRepo} />
              <TextField
                className="sm:col-span-2"
                label="Branch"
                value={branch}
                onChange={setBranch}
                hint="The branch Cloudflare builds the live site from."
              />
            </div>
          </details>

          <label className="flex items-center gap-2.5 text-sm">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="size-4 accent-[var(--accent)]"
            />
            Remember me on this device
          </label>

          {error ? (
            <p role="alert" className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          ) : null}

          <Button type="submit" variant="primary" disabled={busy || !token.trim()} className="w-full">
            {busy ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

// ---------------------------------------------------------------- editor

type PublishState =
  | { kind: "idle" }
  | { kind: "working" }
  | { kind: "done"; commitUrl: string }
  | { kind: "error"; message: string; conflict?: boolean };

const Editor = ({
  session,
  onPublished,
  onReload,
  onSignOut,
}: {
  session: Session;
  onPublished: (saved: SiteContent, sha: string) => void;
  onReload: () => Promise<SiteContent>;
  onSignOut: () => void;
}) => {
  const [content, setContent] = useState<SiteContent>(session.saved);
  const [tab, setTab] = useState<TabId>("log");
  const [status, setStatus] = useState<PublishState>({ kind: "idle" });
  const [previews, setPreviews] = useState<ReadonlyMap<string, string>>(new Map());
  const pending = useRef(new Map<string, PendingUpload>());

  const changes = changedSections(session.saved, tidy(content));
  const dirty = changes.length > 0;

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const addPhotos = useCallback(async (files: File[]): Promise<Photo[]> => {
    const prepared = await Promise.all(files.map(prepareImage));
    return prepared.map((img) => {
      pending.current.set(img.previewUrl, { base64: img.base64, ext: img.ext });
      return { src: img.previewUrl, alt: "", width: img.width, height: img.height };
    });
  }, []);

  const doPublish = async () => {
    const tidied = tidy(content);
    const problems = problemsWith(tidied);
    if (problems.length) {
      setStatus({ kind: "error", message: problems.join(" ") });
      return;
    }

    setStatus({ kind: "working" });

    // Give each new photo a permanent path and swap it into the content.
    const files: NewFile[] = [];
    const newPreviews = new Map(previews);
    const finalize = (photo: Photo, context: string): Photo => {
      const upload = pending.current.get(photo.src);
      if (!upload) return photo;
      const name = `${slugify(photo.alt || context)}-${Math.random().toString(36).slice(2, 7)}.${upload.ext}`;
      const src = `/${UPLOAD_DIR.replace(/^public\//, "")}/${name}`;
      files.push({ path: `${UPLOAD_DIR}/${name}`, base64: upload.base64 });
      newPreviews.set(src, photo.src);
      return { ...photo, src };
    };

    const final: SiteContent = {
      ...tidied,
      robot: { ...tidied.robot, photo: finalize(tidied.robot.photo, "robot") },
      log: tidied.log.map((e) => ({ ...e, photos: e.photos.map((p) => finalize(p, `${e.date}-${e.title}`)) })),
      driveTeam: { ...tidied.driveTeam, photo: finalize(tidied.driveTeam.photo, "drive-team") },
    };

    const message =
      `Update ${changes.map((k) => SECTION_NAMES[k]).join(", ")} via site admin` +
      (files.length ? `\n\nAdds ${files.length} photo${files.length === 1 ? "" : "s"}.` : "");

    try {
      const result = await publish(session.cfg, {
        json: `${JSON.stringify(final, null, 2)}\n`,
        baseSha: session.sha,
        files,
        message,
      });
      pending.current.clear();
      setPreviews(newPreviews);
      onPublished(final, result.contentSha);
      setContent(final);
      setStatus({ kind: "done", commitUrl: result.commitUrl });
    } catch (err) {
      if (err instanceof ConflictError) {
        setStatus({
          kind: "error",
          conflict: true,
          message:
            "Someone else published changes since you opened the admin. Reload to get their version, then redo your edits (your current edits will be discarded).",
        });
      } else {
        setStatus({ kind: "error", message: err instanceof Error ? err.message : "Publishing failed. Try again." });
      }
    }
  };

  const editor = {
    log: <LogEditor value={content.log} onChange={(log) => setContent((c) => ({ ...c, log }))} />,
    robot: <RobotEditor value={content.robot} onChange={(robot) => setContent((c) => ({ ...c, robot }))} />,
    units: <TeamEditor value={content.units} onChange={(units) => setContent((c) => ({ ...c, units }))} />,
    driveTeam: (
      <DriveTeamEditor value={content.driveTeam} onChange={(driveTeam) => setContent((c) => ({ ...c, driveTeam }))} />
    ),
  }[tab];

  return (
    <PhotoUploadContext.Provider value={addPhotos}>
      <PhotoPreviewContext.Provider value={previews}>
        <div className="min-h-screen pb-32">
          <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 md:px-8">
              <a href="/" className="flex items-center gap-2.5 font-semibold" target="_blank" rel="noreferrer">
                <Logo className="h-7 w-auto text-accent" />
                <span>Admin</span>
                <span className="sr-only">(opens the live site in a new tab)</span>
              </a>
              <div className="flex items-center gap-2">
                <span className="hidden font-mono text-xs text-muted md:inline">
                  {session.cfg.owner}/{session.cfg.repo} · {session.cfg.branch}
                </span>
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (!dirty || window.confirm("Sign out and discard your unpublished changes?")) onSignOut();
                  }}
                >
                  Sign out
                </Button>
              </div>
            </div>
            <nav aria-label="Sections" className="mx-auto max-w-5xl overflow-x-auto px-4 md:px-8">
              <ul className="flex gap-1">
                {TABS.map((t) => (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => setTab(t.id)}
                      aria-current={tab === t.id ? "page" : undefined}
                      className={`relative whitespace-nowrap px-3 py-3 text-sm transition-colors ${
                        tab === t.id ? "text-text" : "text-muted hover:text-text"
                      }`}
                    >
                      {t.label}
                      {changes.includes(t.id) ? (
                        <span className="ml-1.5 inline-block size-1.5 rounded-full bg-accent align-middle" aria-label="(changed)" />
                      ) : null}
                      {tab === t.id ? <span aria-hidden className="absolute inset-x-3 -bottom-px h-0.5 bg-accent" /> : null}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </header>

          <main className="mx-auto max-w-5xl px-4 py-10 md:px-8">{editor}</main>

          <PublishBar
            dirty={dirty}
            changes={changes.map((k) => SECTION_NAMES[k])}
            status={status}
            onPublish={doPublish}
            onDiscard={() => {
              if (window.confirm("Discard all unpublished changes?")) {
                setContent(session.saved);
                setStatus({ kind: "idle" });
              }
            }}
            onReload={async () => {
              setStatus({ kind: "working" });
              try {
                setContent(await onReload());
                setStatus({ kind: "idle" });
              } catch (err) {
                setStatus({ kind: "error", message: err instanceof Error ? err.message : "Couldn't reload." });
              }
            }}
            onDismiss={() => setStatus({ kind: "idle" })}
          />
        </div>
      </PhotoPreviewContext.Provider>
    </PhotoUploadContext.Provider>
  );
};

const PublishBar = ({
  dirty,
  changes,
  status,
  onPublish,
  onDiscard,
  onReload,
  onDismiss,
}: {
  dirty: boolean;
  changes: string[];
  status: PublishState;
  onPublish: () => void;
  onDiscard: () => void;
  onReload: () => void;
  onDismiss: () => void;
}) => {
  if (!dirty && status.kind === "idle") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line-strong bg-surface/95 backdrop-blur-md">
      <div
        className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-8"
        role="status"
        aria-live="polite"
      >
        {status.kind === "done" ? (
          <>
            <p className="text-sm">
              <span className="font-medium text-accent">Published.</span>{" "}
              <span className="text-muted">The live site updates in about 1–2 minutes, once Cloudflare rebuilds.</span>{" "}
              <a href={status.commitUrl} target="_blank" rel="noreferrer" className="text-accent underline">
                View on GitHub
              </a>
            </p>
            <Button variant="ghost" onClick={onDismiss}>
              Close
            </Button>
          </>
        ) : status.kind === "error" ? (
          <>
            <p className="max-w-2xl text-sm text-red-200">{status.message}</p>
            <div className="flex gap-2">
              {status.conflict ? (
                <Button variant="primary" onClick={onReload}>
                  Reload latest
                </Button>
              ) : (
                <Button variant="ghost" onClick={onDismiss}>
                  Close
                </Button>
              )}
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-muted">
              Unpublished changes: <span className="text-text">{changes.join(", ")}</span>
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={onDiscard} disabled={status.kind === "working"}>
                Discard
              </Button>
              <Button variant="primary" onClick={onPublish} disabled={status.kind === "working"}>
                {status.kind === "working" ? "Publishing…" : "Publish changes"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Shell = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen px-4 md:px-8">{children}</div>
);
