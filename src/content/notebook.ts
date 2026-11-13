// Fixed site copy lives here. The robot, team, season log and drive team live in
// site.json and are edited through /admin.

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
    title: "Brainstorm together",
    body: "Engineering, Booth/Presentation and Programming plan each project together. We hold regular whole-team meetings so nobody works off old information.",
  },
  {
    title: "Write the plan down",
    body: "Goals and roadmaps go into our digital and paper notes, so we can check progress against them.",
  },
  {
    title: "Buy parts, then build in order",
    body: "We get the materials first, then build the robot in three phases and test after each one.",
  },
];

export const phases = [
  {
    title: "Drivetrain",
    body: "The drivetrain and movement systems.",
  },
  {
    title: "Intake",
    body: "Building and refining the mechanism that picks up the ball.",
  },
  {
    title: "Storage and testing",
    body: "Adding the storage system, then testing the whole robot and fixing what fails.",
  },
];

export const workStyle = [
  "Everyone has a clear role and is accountable for it.",
  "We talk openly and brainstorm as a group. Big decisions go to a vote, and the team's consensus sets the direction.",
  "We take responsibility for our work and stick to our deadlines.",
];

export const goals = [
  "Meet people and get real experience by competing in the FIRST Tech Challenge.",
  "Get better at robotics, public speaking and working as a team.",
  "Win at least one award this season.",
  "Share what we learn and help other students get into engineering.",
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
