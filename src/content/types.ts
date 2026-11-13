// Shape of src/content/site.json, the part of the site the admin panel edits.

export type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type LogGroup = {
  /** Optional sub-heading, e.g. "Robot Construction". Empty string = none. */
  heading: string;
  items: string[];
};

export type LogEntryData = {
  /** ISO date, YYYY-MM-DD */
  date: string;
  title: string;
  /** Optional badge, e.g. "Pre-season". Empty string = none. */
  tag: string;
  groups: LogGroup[];
  photos: Photo[];
};

export type Unit = {
  name: string;
  focus: string;
  members: string[];
};

export type SiteContent = {
  robot: {
    title: string;
    summary: string;
    specs: { label: string; value: string }[];
    photo: Photo;
  };
  units: Unit[];
  log: LogEntryData[];
  driveTeam: {
    photo: Photo;
    rankings: { name: string; role: string }[];
  };
};
