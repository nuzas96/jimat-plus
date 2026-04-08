import {
  ComparisonRow,
  FinalsCatalog,
  ScenarioEvidence,
  ValidationMetric,
  ValidationQuote,
  ValidationSnapshot,
} from '@/lib/types';

export const DEFAULT_PRICING_CONTEXT_ID = 'upm-hostel';

export const finalsCatalog: FinalsCatalog = {
  meals: [
    {
      name: 'Egg Fried Rice',
      ingredients: ['rice', 'eggs', 'onion'],
      dietaryTags: ['no-preference', 'vegetarian', 'halal-friendly', 'low-cost-only'],
      isLowCost: true,
    },
    {
      name: 'Instant Noodles with Egg',
      ingredients: ['instant noodles', 'eggs'],
      dietaryTags: ['no-preference', 'vegetarian', 'halal-friendly', 'low-cost-only'],
      isLowCost: true,
    },
    {
      name: 'Onion Omelette with Rice',
      ingredients: ['rice', 'eggs', 'onion'],
      dietaryTags: ['no-preference', 'vegetarian', 'halal-friendly', 'low-cost-only'],
      isLowCost: true,
    },
    {
      name: 'Plain Rice with Onion',
      ingredients: ['rice', 'onion'],
      dietaryTags: ['no-preference', 'vegetarian', 'halal-friendly', 'low-cost-only'],
      isLowCost: true,
    },
    {
      name: 'Tofu Rice Bowl',
      ingredients: ['rice', 'tofu', 'onion'],
      dietaryTags: ['no-preference', 'vegetarian', 'halal-friendly', 'low-cost-only'],
      isLowCost: true,
    },
    {
      name: 'Tofu Stir Fry with Rice',
      ingredients: ['rice', 'tofu', 'onion'],
      dietaryTags: ['no-preference', 'vegetarian', 'halal-friendly', 'low-cost-only'],
      isLowCost: true,
    },
    {
      name: 'Vegetable Soup with Rice',
      ingredients: ['rice', 'cabbage', 'onion'],
      dietaryTags: ['no-preference', 'vegetarian', 'halal-friendly', 'low-cost-only'],
      isLowCost: true,
    },
    {
      name: 'Toast with Egg',
      ingredients: ['bread', 'eggs'],
      dietaryTags: ['no-preference', 'vegetarian', 'halal-friendly', 'low-cost-only'],
      isLowCost: true,
    },
    {
      name: 'Sardine Rice',
      ingredients: ['rice', 'sardines'],
      dietaryTags: ['no-preference', 'halal-friendly'],
      isLowCost: false,
    },
  ],
  purchaseCandidates: [
    {
      name: 'Tofu',
      estimatedCost: 4.5,
      mealsUnlocked: 3,
      reason: 'Unlocks additional low-cost meals and improves your chance of covering a hostel-style 3-day stretch.',
      dietaryTags: ['no-preference', 'vegetarian', 'halal-friendly', 'low-cost-only'],
    },
    {
      name: 'Bread',
      estimatedCost: 3.5,
      mealsUnlocked: 1,
      reason: 'Adds one quick backup meal, but improves coverage less than tofu for the same 3-day allowance gap.',
      dietaryTags: ['no-preference', 'vegetarian', 'halal-friendly', 'low-cost-only'],
    },
    {
      name: 'Cabbage',
      estimatedCost: 4,
      mealsUnlocked: 1,
      reason: 'Adds one cheap vegetable-based meal, but gives less overall coverage than tofu in this student-budget scenario.',
      dietaryTags: ['no-preference', 'vegetarian', 'halal-friendly', 'low-cost-only'],
    },
    {
      name: 'Eggs',
      estimatedCost: 4,
      mealsUnlocked: 1,
      reason: 'Adds a flexible protein option, but unlocks fewer new meals than tofu with the current pantry.',
      dietaryTags: ['no-preference', 'vegetarian', 'halal-friendly', 'low-cost-only'],
    },
    {
      name: 'Sardines',
      estimatedCost: 6.5,
      mealsUnlocked: 1,
      reason: 'Supports one filling rice meal, but costs more than lower-cost alternatives near campus.',
      dietaryTags: ['no-preference', 'halal-friendly'],
    },
  ],
  pricingContexts: [
    {
      id: 'upm-hostel',
      label: 'Student-Area Budget Preset',
      ingredientPriceOverrides: {
        tofu: 4.5,
        bread: 3.5,
        cabbage: 4,
        eggs: 4,
        sardines: 6.5,
      },
      contextNote: 'Estimated from student-accessible shops near the UniKL MIIT area.',
    },
    {
      id: 'generic-campus',
      label: 'Campus Budget Preset',
      ingredientPriceOverrides: {
        tofu: 4.8,
        bread: 3.8,
        cabbage: 4.2,
        eggs: 4.3,
        sardines: 6.9,
      },
      contextNote: 'Estimated from typical campus-area grocery and convenience prices.',
    },
    {
      id: 'urban-off-campus',
      label: 'Urban Off-Campus',
      ingredientPriceOverrides: {
        tofu: 5.4,
        bread: 4.3,
        cabbage: 4.9,
        eggs: 4.8,
        sardines: 7.8,
      },
      contextNote: 'Estimated from higher-price shops in off-campus urban areas.',
    },
  ],
  supportResources: [
    {
      id: 'campus-food-support',
      title: 'Campus Food Support',
      audience: 'Students facing immediate meal gaps',
      triggerStatuses: ['Critical'],
      actionText: 'Check your campus welfare office, residential college, or student support unit for emergency meal aid or food basket support.',
      contactInfo: 'Use the nearest student affairs or welfare contact during office hours.',
    },
    {
      id: 'peer-support',
      title: 'Peer Support Shortcut',
      audience: 'Students needing a same-day fallback',
      triggerStatuses: ['Critical'],
      actionText: 'Ask a trusted roommate, classmate, or housemate for a short-term meal share before the gap becomes unsafe.',
    },
    {
      id: 'protein-first-stabiliser',
      title: 'Protein-First Stabiliser',
      audience: 'Students with a small remaining budget',
      triggerStatuses: ['Critical'],
      actionText: 'If you can only make one small purchase, prioritize the cheapest stabilizing protein that unlocks repeatable meals first.',
    },
  ],
};

const metrics: ValidationMetric[] = [
  {
    label: 'Direct student checks completed',
    value: 'Pending',
    detail: 'Run 3 to 5 live website walkthroughs, then replace this card with the real completion count and findings.',
  },
  {
    label: 'Google Form responses collected',
    value: 'Pending',
    detail: 'Use the validation survey template to gather broader early feedback and swap in the real response count.',
  },
  {
    label: 'Pricing items manually sampled',
    value: 'Pending',
    detail: 'Check tofu, eggs, bread, sardines, and cabbage against nearby student-accessible sources before finals.',
  },
];

const quotes: ValidationQuote[] = [
  {
    quote: 'Replace this with a real student quote after the first direct usability check.',
    source: 'Pending early student validation',
  },
];

const scenarios: ScenarioEvidence[] = [
  {
    name: 'Canonical finals demo',
    summary: 'RM20, 3 days left, rice, eggs, onion, instant noodles, Student-Area Budget Preset context.',
    outcome: 'Returns 2.8 days, Tight, Medium confidence, and recommends tofu at RM4.50.',
  },
  {
    name: 'Critical low-budget edge case',
    summary: 'RM5, 3 days left, instant noodles only.',
    outcome: 'Flags a critical gap, keeps the recommendation affordable, and shows support options.',
  },
  {
    name: 'Urban price pressure scenario',
    summary: 'Same pantry and budget as the canonical demo, but Urban Off-Campus pricing.',
    outcome: 'Shows tighter affordability and a more fragile coverage margin without changing the overall decision logic.',
  },
];

const comparisonRows: ComparisonRow[] = [
  {
    category: 'Answers "will I last until allowance day?"',
    jimatPlus: 'Yes, with days-covered and risk scoring.',
    recipeApps: 'No, recipe-first.',
    budgetingApps: 'No, spend tracking only.',
    pantryApps: 'No, inventory-first.',
  },
  {
    category: 'Recommends one lowest-cost stabilizing action',
    jimatPlus: 'Yes, with explainable purchase ranking.',
    recipeApps: 'Usually no.',
    budgetingApps: 'No.',
    pantryApps: 'No.',
  },
  {
    category: 'Surfaces support options when food insecurity becomes critical',
    jimatPlus: 'Yes, built into critical-state output.',
    recipeApps: 'No.',
    budgetingApps: 'No.',
    pantryApps: 'No.',
  },
];

export const validationSnapshot: ValidationSnapshot = {
  metrics,
  quotes,
  scenarios,
  comparisonRows,
};
