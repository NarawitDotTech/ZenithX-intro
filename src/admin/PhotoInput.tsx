"use client";

import { createContext, useContext, useRef, useState } from "react";
import type { Photo } from "@/content/types";
import { Button, IconButton, move } from "./ui";

/** Provided by AdminApp: turns picked files into Photos and remembers them until publish. */
export const PhotoUploadContext = createContext<(files: File[]) => Promise<Photo[]>>(async () => []);

/** Maps a just-published photo path to its local preview, so it still shows before the site rebuilds. */
export const PhotoPreviewContext = createContext<ReadonlyMap<string, string>>(new Map());

const usePicker = (multiple: boolean, onPicked: (photos: Photo[]) => void) => {
  const addPhotos = useContext(PhotoUploadContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const input = (
    <input
      ref={inputRef}
      type="file"
      accept="image/jpeg,image/png,image/webp"
      multiple={multiple}
      className="sr-only"
      tabIndex={-1}
      aria-hidden
      onChange={async (e) => {
        const files = Array.from(e.target.files ?? []);
        e.target.value = "";
        if (!files.length) return;
        setBusy(true);
        setError("");
        try {
          onPicked(await addPhotos(files));
        } catch (err) {
          setError(err instanceof Error ? err.message : "That photo couldn't be added.");
        } finally {
          setBusy(false);
        }
      }}
    />
  );

  return { input, busy, error, open: () => inputRef.current?.click() };
};

const Thumb = ({ photo }: { photo: Photo }) => {
  const previews = useContext(PhotoPreviewContext);
  return (
  // Plain <img>: new photos are local blob: previews that next/image can't load.
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src={previews.get(photo.src) ?? photo.src}
    alt=""
    className="aspect-[4/3] w-full rounded-lg border border-line bg-surface-2 object-cover"
    onError={(e) => {
      e.currentTarget.style.visibility = "hidden";
    }}
  />
  );
};

const AltField = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <label className="block">
    <span className="mb-1 block text-xs text-muted">Describe the photo (for screen readers)</span>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="e.g. Team testing the intake in the lab"
      className="w-full rounded-md border border-line-strong bg-bg px-2.5 py-1.5 text-sm focus:border-accent focus:outline-none"
    />
  </label>
);

/** One photo that can be replaced (robot render, bracket photo). */
export const SinglePhotoInput = ({ photo, onChange }: { photo: Photo; onChange: (p: Photo) => void }) => {
  const picker = usePicker(false, ([picked]) => picked && onChange({ ...picked, alt: photo.alt }));
  return (
    <div className="grid gap-3 sm:grid-cols-[240px_1fr] sm:items-start">
      <Thumb photo={photo} />
      <div className="space-y-3">
        <AltField value={photo.alt} onChange={(alt) => onChange({ ...photo, alt })} />
        {picker.input}
        <Button onClick={picker.open} disabled={picker.busy}>
          {picker.busy ? "Preparing photo…" : "Replace photo"}
        </Button>
        {picker.error ? <p role="alert" className="text-sm text-red-300">{picker.error}</p> : null}
      </div>
    </div>
  );
};

/** A list of photos for a log entry: add several, describe, reorder, remove. */
export const PhotoListInput = ({ photos, onChange }: { photos: Photo[]; onChange: (p: Photo[]) => void }) => {
  const picker = usePicker(true, (picked) => onChange([...photos, ...picked]));
  const update = (i: number, patch: Partial<Photo>) => onChange(photos.map((p, pi) => (pi === i ? { ...p, ...patch } : p)));

  return (
    <div>
      {photos.length ? (
        <ul className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo, i) => (
            <li key={`${photo.src}-${i}`} className="space-y-2 rounded-xl border border-line p-3">
              <Thumb photo={photo} />
              <AltField value={photo.alt} onChange={(alt) => update(i, { alt })} />
              <div className="flex gap-2">
                <IconButton label="Move photo earlier" disabled={i === 0} onClick={() => onChange(move(photos, i, i - 1))}>
                  ←
                </IconButton>
                <IconButton
                  label="Move photo later"
                  disabled={i === photos.length - 1}
                  onClick={() => onChange(move(photos, i, i + 1))}
                >
                  →
                </IconButton>
                <IconButton
                  label="Remove photo"
                  className="ml-auto hover:!border-red-400/50 hover:!text-red-300"
                  onClick={() => onChange(photos.filter((_, pi) => pi !== i))}
                >
                  ✕
                </IconButton>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
      {picker.input}
      <Button onClick={picker.open} disabled={picker.busy}>
        {picker.busy ? "Preparing photos…" : "+ Add photos"}
      </Button>
      {picker.error ? <p role="alert" className="mt-2 text-sm text-red-300">{picker.error}</p> : null}
    </div>
  );
};
