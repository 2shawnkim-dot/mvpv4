export const USER = {
  name: "Alex",
  age: 31,
  tier: "premium",
  scores: { values: 78, attachment: 82, goals: 75, comms: 71, conflict: 68 },
  insights: {
    attachment: "Secure-leaning",
    communication: "Analytical-expressive",
    conflict: "Collaborative repair",
  },
};

export const MATCHES = [
  {
    id: 1,
    name: "Elena R.",
    age: 31,
    loc: "Denver, CO",
    verified: 3,
    tagline: "Veterinarian who believes dinner parties > nightclubs",
    compat: { overall: 86, values: 91, attachment: 82, goals: 88, comms: 79, conflict: 84 },
    shared: ["Benevolence", "Personal Growth", "Connection"],
    prompts: [
      {
        q: "A life well-lived looks like:",
        a: "Waking up next to someone I've built something real with. A house with too many plants, a dog that's too spoiled, and friends who show up unannounced.",
      },
      {
        q: "I've learned about myself:",
        a: "That I'm not afraid of being alone. I'm afraid of being with someone and still feeling alone. That distinction changed everything.",
      },
      {
        q: "On Sundays:",
        a: "Farmer's market first thing, then cooking something ambitious with music too loud.",
      },
    ],
    starters: [
      "Ask about a belief she changed her mind about recently",
      "What does bravery in a relationship look like?",
      "Most ambitious thing she's ever cooked?",
    ],
    isNew: true,
    expires: "47h 12m",
  },
  {
    id: 2,
    name: "Maya L.",
    age: 29,
    loc: "Denver, CO",
    verified: 2,
    tagline: "Product designer with a hiking problem and a book collection",
    compat: { overall: 79, values: 83, attachment: 76, goals: 81, comms: 74, conflict: 78 },
    shared: ["Self-Direction", "Stimulation", "Achievement"],
    prompts: [
      {
        q: "A life well-lived looks like:",
        a: "Having built something meaningful with my hands and my mind. Creating, exploring, and never settling for comfortable.",
      },
      {
        q: "I've learned about myself:",
        a: "I need more solitude than most people to recharge, and that is not a flaw. It is how I stay present for the people I love.",
      },
      {
        q: "On Sundays:",
        a: "Long trail run, then hours at a coffee shop with a novel or sketchbook.",
      },
    ],
    starters: ["What is she designing right now?", "Favorite trail near Denver?"],
    isNew: false,
    expires: "22h 45m",
  },
];

export const ACTIVE_CONN = {
  name: "Sophie M.",
  age: 30,
  stage: 2,
  week: 6,
  startDate: "Jan 4",
  health: { emotional: 8.2, communication: 7.8, trust: 8.5, growth: 7.6 },
  nextCheckin: "Wednesday",
  milestones: [
    "First date (Jan 8)",
    "Second date (Jan 15)",
    "Exclusive (Feb 2)",
    "Met friends (Feb 12)",
  ],
};

export const ONBOARD_QS = [
  {
    id: 1,
    section: "Values",
    q: "Rank these life priorities from most to least important to you:",
    type: "rank",
    options: [
      "Family & Relationships",
      "Career & Achievement",
      "Personal Growth",
      "Financial Security",
      "Adventure & Experiences",
      "Community & Service",
    ],
  },
  {
    id: 2,
    section: "Values",
    q: "You and your partner receive an unexpected $50,000. You want to invest it; they want to travel. What do you do?",
    type: "choice",
    options: [
      "Find a compromise that serves both goals",
      "Defer to their preference",
      "Advocate strongly for investing",
      "Suggest splitting it 50/50",
    ],
  },
  {
    id: 3,
    section: "Attachment",
    q: "You texted your partner 6 hours ago. They have not replied. What is your first instinct?",
    type: "choice",
    options: [
      "They are probably busy",
      "Check if the message was delivered",
      "Feel a bit anxious but distract myself",
      "Barely notice",
    ],
  },
  {
    id: 4,
    section: "Attachment",
    q: "After an argument, what do you need most?",
    type: "choice",
    options: [
      "Talk it through right away",
      "Some space to process first",
      "Physical reassurance like a hug",
      "Time alone to cool down",
    ],
  },
  {
    id: 5,
    section: "Communication",
    q: "When something is bothering you in a relationship, you typically:",
    type: "choice",
    options: [
      "Bring it up directly",
      "Drop hints and hope they notice",
      "Wait to see if it resolves",
      "Write out my thoughts first",
    ],
  },
  {
    id: 6,
    section: "Life Vision",
    q: "Do you want children?",
    type: "choice",
    options: ["Yes, definitely", "Leaning yes", "Open but not set", "No"],
  },
  {
    id: 7,
    section: "Life Vision",
    q: "Where do you see yourself in 5 years geographically?",
    type: "choice",
    options: [
      "Rooted in one city",
      "Open to relocating",
      "Want to explore multiple cities",
      "Does not matter with the right person",
    ],
  },
  {
    id: 8,
    section: "EQ",
    q: "When you realize you have been wrong about something important, your first reaction is:",
    type: "choice",
    options: [
      "Curiosity about what I can learn",
      "Brief defensiveness, then openness",
      "Embarrassment that lingers",
      "Frustration at myself",
    ],
  },
];
