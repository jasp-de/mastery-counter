import { MASTERY_GOAL_HOURS } from "@/lib/constants";

export type TemplateCategory = "mastery" | "habit";

export interface ActivityTemplate {
  id: string;
  name: string;
  emoji: string;
  description: string;
  suggestedMinutes: number[];
  defaultGoalHours: number;
  category: TemplateCategory;
}

export const MASTERY_TEMPLATES: ActivityTemplate[] = [
  {
    id: "psychotherapy",
    name: "Psychotherapy",
    emoji: "🛋️",
    description:
      "Clinical training, supervision, and direct client hours toward licensure.",
    suggestedMinutes: [20, 30, 45, 60],
    defaultGoalHours: MASTERY_GOAL_HOURS,
    category: "mastery",
  },
  {
    id: "writing",
    name: "Writing",
    emoji: "✍️",
    description:
      "Drafts, revisions, and deliberate craft — novels, essays, scripts.",
    suggestedMinutes: [20, 30, 45, 60],
    defaultGoalHours: MASTERY_GOAL_HOURS,
    category: "mastery",
  },
  {
    id: "instrument",
    name: "Instrument",
    emoji: "🎻",
    description:
      "Scales, repertoire, and focused practice on your instrument.",
    suggestedMinutes: [15, 20, 30, 45],
    defaultGoalHours: MASTERY_GOAL_HOURS,
    category: "mastery",
  },
  {
    id: "programming",
    name: "Programming",
    emoji: "💻",
    description: "Deep coding, system design, and shipping real software.",
    suggestedMinutes: [25, 45, 60, 90],
    defaultGoalHours: MASTERY_GOAL_HOURS,
    category: "mastery",
  },
  {
    id: "visual-art",
    name: "Visual art",
    emoji: "🎨",
    description: "Drawing, painting, or digital art with intentional study.",
    suggestedMinutes: [20, 30, 45, 60],
    defaultGoalHours: MASTERY_GOAL_HOURS,
    category: "mastery",
  },
  {
    id: "athletics",
    name: "Athletics",
    emoji: "🏃",
    description: "Sport-specific training, drills, and conditioning.",
    suggestedMinutes: [20, 30, 45, 60],
    defaultGoalHours: MASTERY_GOAL_HOURS,
    category: "mastery",
  },
  {
    id: "language-mastery",
    name: "Language fluency",
    emoji: "🌍",
    description: "Immersion, conversation, and structured language study.",
    suggestedMinutes: [15, 20, 30, 45],
    defaultGoalHours: MASTERY_GOAL_HOURS,
    category: "mastery",
  },
  {
    id: "chess",
    name: "Chess",
    emoji: "♟️",
    description: "Tactics, games, and analysis on the path to expertise.",
    suggestedMinutes: [15, 20, 30, 45],
    defaultGoalHours: MASTERY_GOAL_HOURS,
    category: "mastery",
  },
];

export const HABIT_TEMPLATES: ActivityTemplate[] = [
  {
    id: "reading",
    name: "Reading",
    emoji: "📖",
    description: "Books, articles, or papers — small daily steps add up.",
    suggestedMinutes: [15, 20, 30, 45],
    defaultGoalHours: 50,
    category: "habit",
  },
  {
    id: "stretching",
    name: "Stretching",
    emoji: "🧘",
    description: "Mobility and recovery sessions to stay loose.",
    suggestedMinutes: [10, 15, 20, 30],
    defaultGoalHours: 30,
    category: "habit",
  },
  {
    id: "meditation",
    name: "Meditation",
    emoji: "🧠",
    description: "Mindfulness, breath work, or quiet focus.",
    suggestedMinutes: [10, 15, 20],
    defaultGoalHours: 20,
    category: "habit",
  },
  {
    id: "walking",
    name: "Walking",
    emoji: "🚶",
    description: "Steps outside or on a treadmill.",
    suggestedMinutes: [20, 30, 45],
    defaultGoalHours: 40,
    category: "habit",
  },
  {
    id: "journaling",
    name: "Journaling",
    emoji: "📓",
    description: "Reflect, plan, or free-write.",
    suggestedMinutes: [10, 15, 20],
    defaultGoalHours: 25,
    category: "habit",
  },
];

export const ACTIVITY_TEMPLATES: ActivityTemplate[] = [
  ...MASTERY_TEMPLATES,
  ...HABIT_TEMPLATES,
];
