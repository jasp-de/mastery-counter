export type TemplateCategory = "mastery" | "habit";

export interface ActivityTemplate {
  id: string;
  name: string;
  emoji: string;
  description: string;
  suggestedMinutes: number[];
  defaultGoalHours: number;
  defaultWeeklyGoalHours: number;
  category: TemplateCategory;
}

/** Skills worth locking in — scoped to months, not a lifetime vow */
export const MASTERY_TEMPLATES: ActivityTemplate[] = [
  {
    id: "psychotherapy",
    name: "Psychotherapy",
    emoji: "🛋️",
    description:
      "Clients, supervision, study — 200h of couch time that actually counts toward the license.",
    suggestedMinutes: [50, 60, 75, 90],
    defaultGoalHours: 200,
    defaultWeeklyGoalHours: 3,
    category: "mastery",
  },
  {
    id: "writing",
    name: "Writing",
    emoji: "✍️",
    description:
      "Draft the mess, edit the mess, ship something legible. 50h beats another year of 'almost done.'",
    suggestedMinutes: [25, 45, 60, 90],
    defaultGoalHours: 50,
    defaultWeeklyGoalHours: 3,
    category: "mastery",
  },
  {
    id: "instrument",
    name: "Instrument",
    emoji: "🎻",
    description:
      "Scales until the neighbors negotiate. 30h — one month of showing up with the case open.",
    suggestedMinutes: [15, 20, 30, 45],
    defaultGoalHours: 30,
    defaultWeeklyGoalHours: 2,
    category: "mastery",
  },
  {
    id: "programming",
    name: "Programming",
    emoji: "💻",
    description:
      "That side project from 2019? 60h of deep work and it might actually leave localhost.",
    suggestedMinutes: [30, 45, 60, 90],
    defaultGoalHours: 60,
    defaultWeeklyGoalHours: 4,
    category: "mastery",
  },
  {
    id: "visual-art",
    name: "Visual art",
    emoji: "🎨",
    description:
      "Studio time, not Pinterest time. 25h builds a corner of work you can point at without cringing.",
    suggestedMinutes: [20, 30, 45, 60],
    defaultGoalHours: 25,
    defaultWeeklyGoalHours: 2,
    category: "mastery",
  },
  {
    id: "athletics",
    name: "Athletics",
    emoji: "🏃",
    description:
      "Drills, sweat, repeat — 20h before the excuse muscle gets too strong to ignore.",
    suggestedMinutes: [20, 30, 45, 60],
    defaultGoalHours: 20,
    defaultWeeklyGoalHours: 2,
    category: "mastery",
  },
  {
    id: "language-mastery",
    name: "Language fluency",
    emoji: "🌍",
    description:
      "Past 'hello' and into real conversation. 30h to sound less like a phrasebook having a crisis.",
    suggestedMinutes: [15, 20, 30, 45],
    defaultGoalHours: 30,
    defaultWeeklyGoalHours: 2,
    category: "mastery",
  },
  {
    id: "chess",
    name: "Chess",
    emoji: "♟️",
    description:
      "Tactics, blitz, review the blunder at 2 a.m. 15h — opponents won't know what hit them (you still will).",
    suggestedMinutes: [10, 15, 20, 30],
    defaultGoalHours: 15,
    defaultWeeklyGoalHours: 1,
    category: "mastery",
  },
];

export const HABIT_TEMPLATES: ActivityTemplate[] = [
  {
    id: "reading",
    name: "Reading",
    emoji: "📖",
    description:
      "Phone down. Book up. 12h finishes the stack that's been judging you from the nightstand.",
    suggestedMinutes: [10, 15, 20, 30],
    defaultGoalHours: 12,
    defaultWeeklyGoalHours: 1,
    category: "habit",
  },
  {
    id: "stretching",
    name: "Stretching",
    emoji: "🧘",
    description:
      "Touch your toes — or at least send them a polite wave. 8h of mobility, zero heroics required.",
    suggestedMinutes: [5, 10, 15, 20],
    defaultGoalHours: 8,
    defaultWeeklyGoalHours: 1,
    category: "habit",
  },
  {
    id: "meditation",
    name: "Meditation",
    emoji: "🧠",
    description:
      "Sit still while your brain runs a marathon. 6h of not opening another tab counts as progress.",
    suggestedMinutes: [5, 10, 15, 20],
    defaultGoalHours: 6,
    defaultWeeklyGoalHours: 1,
    category: "habit",
  },
  {
    id: "walking",
    name: "Walking",
    emoji: "🚶",
    description:
      "Outside counts. 10h of steps beats 10h of 'I should really go for a walk.'",
    suggestedMinutes: [15, 20, 30, 45],
    defaultGoalHours: 10,
    defaultWeeklyGoalHours: 1.5,
    category: "habit",
  },
  {
    id: "journaling",
    name: "Journaling",
    emoji: "📓",
    description:
      "Brain dump in ink. 5h of honest sentences — future you can pretend to read them later.",
    suggestedMinutes: [5, 10, 15, 20],
    defaultGoalHours: 5,
    defaultWeeklyGoalHours: 1,
    category: "habit",
  },
];

export const ACTIVITY_TEMPLATES: ActivityTemplate[] = [
  ...MASTERY_TEMPLATES,
  ...HABIT_TEMPLATES,
];
