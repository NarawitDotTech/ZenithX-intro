"use client";

import Image from "next/image";
import { useRef } from "react";
import type { Photo } from "@/content/notebook";

type PhotoFrameProps = {
  photo: Photo;
  className?: string;
  sizes?: string;
  priority?: boolean;
  caption?: string;
};

/** A photo that opens full-size in a modal <dialog> (native focus trap + Esc to close). */
export const PhotoFrame = ({ photo, className = "", sizes = "100vw", priority, caption }: PhotoFrameProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={open}
        data-cursor="view"
        aria-label={`Open photo: ${photo.alt}`}
        className={`group relative block w-full overflow-hidden rounded-xl border border-line bg-surface ${className}`}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes={sizes}
          priority={priority}
          className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]"
        />
      </button>

      <dialog
        ref={dialogRef}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        className="m-auto max-h-[92vh] w-[min(1200px,94vw)] rounded-2xl border border-line-strong bg-surface p-0 text-text backdrop:bg-bg/90"
      >
        <figure className="flex flex-col">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="94vw"
            className="max-h-[80vh] w-full object-contain"
          />
          <figcaption className="flex items-center justify-between gap-4 border-t border-line px-5 py-3 font-mono text-xs text-muted">
            <span>{caption ?? photo.alt}</span>
            <button
              type="button"
              onClick={close}
              className="shrink-0 rounded-full border border-line-strong px-3 py-1.5 text-text transition-colors hover:border-accent hover:text-accent"
            >
              Close photo
            </button>
          </figcaption>
        </figure>
      </dialog>
    </>
  );
};
