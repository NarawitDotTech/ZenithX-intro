// Minimal GitHub client for the admin panel. The repo is the database:
// reading site.json = GET contents, saving = one commit with the JSON + new photos.

export type RepoConfig = {
  token: string;
  owner: string;
  repo: string;
  branch: string;
};

export const CONTENT_PATH = "src/content/site.json";
export const UPLOAD_DIR = "public/notebook/uploads";

export class GitHubError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

/** Someone else published since this editor loaded the content. */
export class ConflictError extends Error {}

const api = async <T>(cfg: RepoConfig, path: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(`https://api.github.com/repos/${cfg.owner}/${cfg.repo}${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${cfg.token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    let detail = "";
    try {
      detail = ((await res.json()) as { message?: string }).message ?? "";
    } catch {
      /* body wasn't JSON */
    }
    throw new GitHubError(explain(res.status, detail), res.status);
  }
  return (await res.json()) as T;
};

const explain = (status: number, detail: string) => {
  if (status === 401) return "GitHub didn't accept that token. It may be mistyped or expired.";
  if (status === 403) return "This token isn't allowed to do that. It needs Contents: Read and write on this repository.";
  if (status === 404) return "Couldn't find the repository or branch. Check the owner, repo and branch names.";
  if (status === 409 || status === 422) return "The branch changed while saving. Reload and try again.";
  return `GitHub returned an error (${status})${detail ? `: ${detail}` : ""}.`;
};

const utf8ToBase64 = (text: string) => {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
};

const base64ToUtf8 = (b64: string) => {
  const bin = atob(b64.replace(/\s/g, ""));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
};

/** Checks the token can see the repo and push to it. */
export const verifyAccess = async (cfg: RepoConfig) => {
  const repo = await api<{ permissions?: { push?: boolean } }>(cfg, "");
  if (!repo.permissions?.push) {
    throw new GitHubError("This token can read the repository but can't save to it. Give it Contents: Read and write.", 403);
  }
  await api(cfg, `/branches/${encodeURIComponent(cfg.branch)}`);
};

export const loadFile = async (cfg: RepoConfig, path: string) => {
  const file = await api<{ content: string; sha: string }>(
    cfg,
    `/contents/${path}?ref=${encodeURIComponent(cfg.branch)}`,
  );
  return { text: base64ToUtf8(file.content), sha: file.sha };
};

export type NewFile = { path: string; base64: string };

/**
 * Commits the JSON (and any new files) in a single commit on top of the branch.
 * Throws ConflictError if the JSON on GitHub isn't the version we started from.
 */
export const publish = async (
  cfg: RepoConfig,
  opts: { json: string; baseSha: string; files: NewFile[]; message: string },
) => {
  const ref = await api<{ object: { sha: string } }>(cfg, `/git/ref/heads/${encodeURIComponent(cfg.branch)}`);
  const headSha = ref.object.sha;

  const current = await api<{ sha: string }>(cfg, `/contents/${CONTENT_PATH}?ref=${headSha}`);
  if (current.sha !== opts.baseSha) throw new ConflictError("Someone else published changes.");

  const head = await api<{ tree: { sha: string } }>(cfg, `/git/commits/${headSha}`);

  const blobs = await Promise.all([
    api<{ sha: string }>(cfg, "/git/blobs", {
      method: "POST",
      body: JSON.stringify({ content: utf8ToBase64(opts.json), encoding: "base64" }),
    }).then((b) => ({ path: CONTENT_PATH, sha: b.sha })),
    ...opts.files.map((f) =>
      api<{ sha: string }>(cfg, "/git/blobs", {
        method: "POST",
        body: JSON.stringify({ content: f.base64, encoding: "base64" }),
      }).then((b) => ({ path: f.path, sha: b.sha })),
    ),
  ]);

  const tree = await api<{ sha: string }>(cfg, "/git/trees", {
    method: "POST",
    body: JSON.stringify({
      base_tree: head.tree.sha,
      tree: blobs.map((b) => ({ path: b.path, mode: "100644", type: "blob", sha: b.sha })),
    }),
  });

  const commit = await api<{ sha: string; html_url: string }>(cfg, "/git/commits", {
    method: "POST",
    body: JSON.stringify({ message: opts.message, tree: tree.sha, parents: [headSha] }),
  });

  // Not forced: GitHub rejects this if the branch moved since we read it.
  await api(cfg, `/git/refs/heads/${encodeURIComponent(cfg.branch)}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha, force: false }),
  });

  return { commitUrl: commit.html_url, contentSha: blobs[0].sha };
};
