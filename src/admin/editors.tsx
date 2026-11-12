"use client";

import { useState } from "react";
import { formatDate } from "@/content/notebook";
import type { LogEntryData, LogGroup, SiteContent, Unit } from "@/content/types";
import { PhotoListInput, SinglePhotoInput } from "./PhotoInput";
import { Button, Card, IconButton, SectionTitle, TextAreaField, TextField, move } from "./ui";

type EditorProps<K extends keyof SiteContent> = {
  value: SiteContent[K];
  onChange: (value: SiteContent[K]) => void;
};

const lines = (text: string) => text.split("\n");
const replaceAt = <T,>(list: T[], i: number, item: T) => list.map((x, xi) => (xi === i ? item : x));

const today = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// ---------------------------------------------------------------- Season log

export const LogEditor = ({ value, onChange }: EditorProps<"log">) => {
  const [open, setOpen] = useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const addEntry = () => {
    const entry: LogEntryData = {
      date: today(),
      title: "",
      tag: "",
      groups: [{ heading: "", items: [""] }],
      photos: [],
    };
    onChange([entry, ...value]);
    // Shift open indexes down by one and open the new entry.
    setOpen((prev) => new Set([0, ...[...prev].map((i) => i + 1)]));
  };

  const removeEntry = (i: number) => {
    const entry = value[i];
    const name = entry.title.trim() || "this untitled entry";
    if (!window.confirm(`Delete “${name}” (${formatDate(entry.date)})? This can't be undone after you publish.`)) return;
    onChange(value.filter((_, ei) => ei !== i));
    setOpen(new Set());
  };

  return (
    <section>
      <SectionTitle
        title="Season log"
        description="Each meeting or update is one entry. The site sorts entries by date automatically."
        action={
          <Button variant="primary" onClick={addEntry}>
            + Add entry
          </Button>
        }
      />
      <ul className="space-y-3">
        {value.map((entry, i) => {
          const isOpen = open.has(i);
          return (
            <li key={i}>
              <Card className="!p-0">
                <div className="flex items-center gap-3 p-4 md:px-6">
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    className="flex min-w-0 flex-1 items-center gap-4 text-left"
                  >
                    <span className="w-24 shrink-0 font-mono text-xs text-accent">{formatDate(entry.date)}</span>
                    <span className="min-w-0 flex-1 truncate font-medium">
                      {entry.title || <span className="text-muted italic">Untitled entry</span>}
                    </span>
                    {entry.photos.length ? (
                      <span className="hidden shrink-0 font-mono text-xs text-muted sm:inline">
                        {entry.photos.length} photo{entry.photos.length === 1 ? "" : "s"}
                      </span>
                    ) : null}
                    <span aria-hidden className={`shrink-0 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}>
                      ▾
                    </span>
                  </button>
                </div>

                {isOpen ? (
                  <div className="space-y-6 border-t border-line p-4 md:p-6">
                    <LogEntryForm entry={entry} onChange={(next) => onChange(replaceAt(value, i, next))} />
                    <div className="flex justify-end border-t border-line pt-4">
                      <Button variant="danger" onClick={() => removeEntry(i)}>
                        Delete entry
                      </Button>
                    </div>
                  </div>
                ) : null}
              </Card>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

const LogEntryForm = ({ entry, onChange }: { entry: LogEntryData; onChange: (e: LogEntryData) => void }) => {
  const set = (patch: Partial<LogEntryData>) => onChange({ ...entry, ...patch });
  const setGroup = (gi: number, patch: Partial<LogGroup>) =>
    set({ groups: replaceAt(entry.groups, gi, { ...entry.groups[gi], ...patch }) });

  return (
    <>
      <div className="grid gap-4 md:grid-cols-[180px_1fr_200px]">
        <TextField label="Date" type="date" required value={entry.date} onChange={(date) => set({ date })} />
        <TextField
          label="Title"
          required
          value={entry.title}
          onChange={(title) => set({ title })}
          placeholder="e.g. Drivetrain test day"
        />
        <TextField
          label="Badge (optional)"
          value={entry.tag}
          onChange={(tag) => set({ tag })}
          placeholder="e.g. Pre-season"
        />
      </div>

      <div className="space-y-4">
        {entry.groups.map((group, gi) => (
          <div key={gi} className="rounded-xl border border-line p-4">
            <div className="grid gap-4">
              <div className="flex items-end gap-3">
                <TextField
                  className="flex-1"
                  label="Section heading (optional)"
                  value={group.heading}
                  onChange={(heading) => setGroup(gi, { heading })}
                  placeholder="e.g. Robot Construction"
                />
                {entry.groups.length > 1 ? (
                  <IconButton
                    label="Remove this section"
                    className="mb-0.5 hover:!border-red-400/50 hover:!text-red-300"
                    onClick={() => set({ groups: entry.groups.filter((_, x) => x !== gi) })}
                  >
                    ✕
                  </IconButton>
                ) : null}
              </div>
              <TextAreaField
                label="What happened"
                hint="One point per line. Each line becomes a bullet."
                rows={4}
                value={group.items.join("\n")}
                onChange={(text) => setGroup(gi, { items: lines(text) })}
              />
            </div>
          </div>
        ))}
        <Button variant="ghost" onClick={() => set({ groups: [...entry.groups, { heading: "", items: [""] }] })}>
          + Add section
        </Button>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium">Photos</p>
        <PhotoListInput photos={entry.photos} onChange={(photos) => set({ photos })} />
      </div>
    </>
  );
};

// ---------------------------------------------------------------- Robot

export const RobotEditor = ({ value, onChange }: EditorProps<"robot">) => {
  const set = (patch: Partial<SiteContent["robot"]>) => onChange({ ...value, ...patch });
  const specs = value.specs;

  return (
    <section className="space-y-6">
      <SectionTitle title="Robot" description="The robot section: main photo, description and the spec list." />
      <Card>
        <p className="mb-3 text-sm font-medium">Robot photo or render</p>
        <SinglePhotoInput photo={value.photo} onChange={(photo) => set({ photo })} />
      </Card>
      <Card className="space-y-4">
        <TextField label="Heading" value={value.title} onChange={(title) => set({ title })} />
        <TextAreaField label="Description" rows={5} value={value.summary} onChange={(summary) => set({ summary })} />
      </Card>
      <Card>
        <p className="mb-3 text-sm font-medium">Specs</p>
        <ul className="space-y-3">
          {specs.map((spec, i) => (
            <li key={i} className="flex flex-wrap items-end gap-3 sm:flex-nowrap">
              <TextField
                className="w-full sm:w-48"
                label="Label"
                value={spec.label}
                onChange={(label) => set({ specs: replaceAt(specs, i, { ...spec, label }) })}
              />
              <TextField
                className="min-w-0 flex-1"
                label="Value"
                value={spec.value}
                onChange={(v) => set({ specs: replaceAt(specs, i, { ...spec, value: v }) })}
              />
              <ListControls
                index={i}
                length={specs.length}
                noun="spec"
                onMove={(to) => set({ specs: move(specs, i, to) })}
                onRemove={() => set({ specs: specs.filter((_, x) => x !== i) })}
              />
            </li>
          ))}
        </ul>
        <Button variant="ghost" className="mt-3" onClick={() => set({ specs: [...specs, { label: "", value: "" }] })}>
          + Add spec
        </Button>
      </Card>
    </section>
  );
};

// ---------------------------------------------------------------- Team

export const TeamEditor = ({ value, onChange }: EditorProps<"units">) => {
  const setUnit = (i: number, patch: Partial<Unit>) => onChange(replaceAt(value, i, { ...value[i], ...patch }));

  return (
    <section>
      <SectionTitle
        title="Team"
        description="Units and who's in them. Member counts on the site update automatically."
        action={<Button onClick={() => onChange([...value, { name: "", focus: "", members: [""] }])}>+ Add unit</Button>}
      />
      <ul className="space-y-4">
        {value.map((unit, i) => (
          <li key={i}>
            <Card className="space-y-4">
              <div className="flex items-end gap-3">
                <TextField className="flex-1" label="Unit name" value={unit.name} onChange={(name) => setUnit(i, { name })} />
                <ListControls
                  index={i}
                  length={value.length}
                  noun="unit"
                  onMove={(to) => onChange(move(value, i, to))}
                  onRemove={() => {
                    if (window.confirm(`Remove the “${unit.name || "untitled"}” unit and its member list?`)) {
                      onChange(value.filter((_, x) => x !== i));
                    }
                  }}
                />
              </div>
              <TextField label="What they do" value={unit.focus} onChange={(focus) => setUnit(i, { focus })} />
              <TextAreaField
                label="Members"
                hint="One name per line."
                rows={Math.max(3, unit.members.length)}
                value={unit.members.join("\n")}
                onChange={(text) => setUnit(i, { members: lines(text) })}
              />
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
};

// ---------------------------------------------------------------- Drive team

export const DriveTeamEditor = ({ value, onChange }: EditorProps<"driveTeam">) => {
  const set = (patch: Partial<SiteContent["driveTeam"]>) => onChange({ ...value, ...patch });
  const rankings = value.rankings;

  return (
    <section className="space-y-6">
      <SectionTitle title="Drive team" description="The competition-line photo and final rankings. Order = ranking." />
      <Card>
        <p className="mb-3 text-sm font-medium">Bracket photo</p>
        <SinglePhotoInput photo={value.photo} onChange={(photo) => set({ photo })} />
      </Card>
      <Card>
        <p className="mb-3 text-sm font-medium">Rankings</p>
        <ol className="space-y-3">
          {rankings.map((rank, i) => (
            <li key={i} className="flex flex-wrap items-end gap-3 sm:flex-nowrap">
              <span className="mb-2.5 w-6 font-mono text-lg font-bold text-accent">{i + 1}</span>
              <TextField
                className="min-w-0 flex-1"
                label="Name"
                value={rank.name}
                onChange={(name) => set({ rankings: replaceAt(rankings, i, { ...rank, name }) })}
              />
              <TextField
                className="min-w-0 flex-1"
                label="Role"
                value={rank.role}
                onChange={(role) => set({ rankings: replaceAt(rankings, i, { ...rank, role }) })}
                placeholder="Controller / Human Player"
              />
              <ListControls
                index={i}
                length={rankings.length}
                noun="ranking"
                onMove={(to) => set({ rankings: move(rankings, i, to) })}
                onRemove={() => set({ rankings: rankings.filter((_, x) => x !== i) })}
              />
            </li>
          ))}
        </ol>
        <Button variant="ghost" className="mt-3" onClick={() => set({ rankings: [...rankings, { name: "", role: "" }] })}>
          + Add person
        </Button>
      </Card>
    </section>
  );
};

// ---------------------------------------------------------------- shared

const ListControls = ({
  index,
  length,
  noun,
  onMove,
  onRemove,
}: {
  index: number;
  length: number;
  noun: string;
  onMove: (to: number) => void;
  onRemove: () => void;
}) => (
  <div className="mb-0.5 flex gap-2">
    <IconButton label={`Move ${noun} up`} disabled={index === 0} onClick={() => onMove(index - 1)}>
      ↑
    </IconButton>
    <IconButton label={`Move ${noun} down`} disabled={index === length - 1} onClick={() => onMove(index + 1)}>
      ↓
    </IconButton>
    <IconButton label={`Remove ${noun}`} className="hover:!border-red-400/50 hover:!text-red-300" onClick={onRemove}>
      ✕
    </IconButton>
  </div>
);
