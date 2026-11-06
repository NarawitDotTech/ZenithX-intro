// All copy on the site comes from the Zenith X FTC 2026 engineering notebook.

export const team = {
  name: "Zenith X",
  number: "33634",
  season: "FTC 2026",
};

export type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
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

export const intake = {
  summary:
    "A servo-driven intake paired with rubber bands. The servo actively guides the ball into the robot, while the rubber-band setup gives the control we need and helps drop the ball when it's time.",
  specs: [
    { label: "Drive", value: "Servo motor" },
    { label: "Grip", value: "Rubber-band rollers" },
    { label: "Job", value: "Collect, guide, release" },
  ],
  render: {
    src: "/notebook/robot-render.png",
    alt: "CAD render of a competition robot chassis with side arms and intake rollers",
    width: 1600,
    height: 1200,
  } satisfies Photo,
};

export const units = [
  {
    name: "Booth & Presentation",
    focus: "Booth, booth games, presentation, introduction and show",
    members: ["Nana", "Kawin", "Pangpoon", "Nacky", "Yada"],
  },
  {
    name: "Robot Construction",
    focus: "Building the robot, from drivetrain to storage",
    members: ["Nain", "Proton", "Ocean", "Phat", "Pun", "Diamond"],
  },
  {
    name: "Programming & Design",
    focus: "Robot code and robot design",
    members: ["Gundam", "Prompt"],
  },
];

export const memberCount = units.reduce((n, u) => n + u.members.length, 0);

export type LogEntry = {
  date: string;
  iso: string;
  title: string;
  tag?: string;
  groups: { heading?: string; items: string[] }[];
  photos?: Photo[];
};

const meetingPhoto = (file: string, alt: string): Photo => ({
  src: `/notebook/${file}.jpg`,
  alt,
  width: 1280,
  height: 960,
});

export const log: LogEntry[] = [
  {
    date: "08 Jun 2026",
    iso: "2026-06-08",
    title: "First meeting — FTC 2026 & roles",
    groups: [
      {
        items: [
          "Kicked off FTC 2026 and split the team into three units: Booth & Presentation, Robot Construction, and Programming & Design.",
        ],
      },
    ],
  },
  {
    date: "08 Jul 2026",
    iso: "2026-07-08",
    title: "Second meeting",
    tag: "Pre-season",
    groups: [{ items: ["Pre-season starts. The whole team meets in the lab."] }],
    photos: [
      meetingPhoto("second-meeting-2", "Team members at desktop computers in the school lab"),
      meetingPhoto("second-meeting-1", "Students working at a row of computers during the second meeting"),
    ],
  },
  {
    date: "09 Jul 2026",
    iso: "2026-07-09",
    title: "Engineering meeting",
    groups: [
      {
        items: [
          "Brainstormed intake methods.",
          "Talked through the responsibilities and duties of the engineering team.",
        ],
      },
    ],
  },
  {
    date: "27 Aug 2026",
    iso: "2026-08-27",
    title: "Season update",
    groups: [{ items: ["Went through FTC 2026 gameplay and the robot's mechanics."] }],
    photos: [
      meetingPhoto("meeting-aug-4", "Team member presenting to the group in the computer lab"),
      meetingPhoto("meeting-aug-3", "Team sitting on the floor in a circle discussing the game"),
      meetingPhoto("meeting-aug-2", "Team members seated in the lab listening to a briefing"),
      meetingPhoto("meeting-aug-1", "Two team members at computers in the lab"),
    ],
  },
  {
    date: "12 Sep 2026",
    iso: "2026-09-12",
    title: "Work update",
    groups: [
      {
        heading: "Media & Presentation",
        items: ["The FTC 2026 banner for Instagram is almost finished."],
      },
      {
        heading: "Robot Construction",
        items: [
          "Phat and Ocean selected as the robot's controllers.",
          "Discussed who will be the Human Player.",
        ],
      },
    ],
  },
  {
    date: "01 Oct 2026",
    iso: "2026-10-01",
    title: "Final meeting of semester 1",
    groups: [
      {
        heading: "Robot Construction",
        items: ["Talked through the intake method and other mechanics.", "Selected the Human Player."],
      },
    ],
    photos: [
      {
        src: "/notebook/final-meeting.jpg",
        alt: "Team members on the lab floor raising their hands during the final meeting",
        width: 1600,
        height: 1200,
      },
    ],
  },
];

export const competitionLine = {
  photo: {
    src: "/notebook/competition-line.jpg",
    alt: "Hand-drawn tournament bracket on a blackboard with winner and loser lines and final rankings",
    width: 1547,
    height: 1040,
  } satisfies Photo,
  rankings: [
    { place: 1, name: "Ocean", role: "Controller" },
    { place: 2, name: "Diamond", role: "Controller" },
    { place: 3, name: "Phat", role: "Human Player" },
  ],
};
