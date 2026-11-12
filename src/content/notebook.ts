// Site copy. Fixed copy lives here; the editable parts (robot, team, season log,
// drive team) live in site.json and are changed through /admin.

import siteJson from "./site.json";
import type { LogGroup, Photo, SiteContent } from "./types";

export type { Photo } from "./types";

const site = siteJson as SiteContent;

export const team = {
  name: "Zenith X",
  number: "33634",
  season: "FTC 2026",
};

export const process = [
  {
    title: "Brainstorm & align",
    body: "We start every project by brainstorming across our three units — Engineering, Booth/Presentation and Programming — with regular whole-team meetings so everyone shares the same picture.",
  },
  {
    title: "Plan it down",
    body: "Objectives and roadmaps get written down, in digital and paper notes, so every initiative has a clear, trackable path.",
  },
  {
    title: "Build in phases",
    body: "We get the materials we need first, then build in a fixed order and test as we go.",
  },
];

export const phases = [
  {
    code: "P1",
    title: "Drivetrain",
    body: "Develop the drivetrain and movement systems — the base everything else sits on.",
  },
  {
    code: "P2",
    title: "Intake",
    body: "Engineer and refine the intake mechanism that brings game balls into the robot.",
  },
  {
    code: "P3",
    title: "Storage & QA",
    body: "Integrate the storage system, then run rigorous testing to find and fix technical shortcomings.",
  },
];

export const workStyle = [
  "Clear roles for everyone, with individual accountability and a shared commitment to our goals.",
  "Open communication and inclusive brainstorming. We decide democratically — team consensus sets the direction.",
  "Professional responsibility, purposeful action and sticking to our timelines.",
];

export const goals = [
  "Build professional relationships and real experience through the FIRST Tech Challenge.",
  "Grow our technical skill in robotics, our public speaking and presentation, and how we work as a team.",
  "Win at least one award this season.",
  "Share what we learn and mentor others, to grow our community and inspire interest in engineering.",
];

// ---- Editable content (site.json) ----

export const intake = {
  title: site.robot.title,
  summary: site.robot.summary,
  specs: site.robot.specs,
  render: site.robot.photo,
};

export const units = site.units;

export const memberCount = units.reduce((n, u) => n + u.members.length, 0);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-06-08" -> "08 Jun 2026" (no Date object, so no timezone surprises). */
export const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${d} ${MONTHS[Number(m) - 1] ?? m} ${y}`;
};

export type LogEntry = {
  key: string;
  date: string;
  iso: string;
  title: string;
  tag?: string;
  groups: { heading?: string; items: string[] }[];
  photos?: Photo[];
};

const cleanGroups = (groups: LogGroup[]) =>
  groups
    .map((g) => ({ heading: g.heading || undefined, items: g.items.filter((item) => item.trim()) }))
    .filter((g) => g.items.length > 0);

export const log: LogEntry[] = [...site.log]
  .sort((a, b) => a.date.localeCompare(b.date))
  .map((entry, i) => ({
    key: `${entry.date}-${i}`,
    date: formatDate(entry.date),
    iso: entry.date,
    title: entry.title,
    tag: entry.tag || undefined,
    groups: cleanGroups(entry.groups),
    photos: entry.photos.length ? entry.photos : undefined,
  }));

export const competitionLine = {
  photo: site.driveTeam.photo,
  rankings: site.driveTeam.rankings.map((r, i) => ({ place: i + 1, ...r })),
};

const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];

/** 3 -> "three"; numbers past twenty stay as digits. */
export const numberWord = (n: number) => WORDS[n] ?? String(n);

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
