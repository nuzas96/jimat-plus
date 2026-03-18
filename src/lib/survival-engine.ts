import {
  ConfidenceLevel,
  DietaryPreference,
  MealSuggestion,
  PurchaseComparison,
  ShoppingItem,
  SurvivalResult,
  SurvivalStatus,
  UserInput,
} from './types';

interface MealTemplate {
  name: string;
  ingredients: string[];
  dietaryTags: DietaryPreference[];
  isLowCost: boolean;
}

interface CandidatePurchase extends ShoppingItem {
  dietaryTags: DietaryPreference[];
}

interface PurchaseOption {
  candidate: CandidatePurchase;
  unlockedMeals: MealTemplate[];
  rank: [number, number, number, number, string];
  coverageAfterPurchase: number;
}

interface FallbackMeal {
  name: string;
  ingredients: string[];
  estimatedCost: number;
}

const MEALS_PER_DAY = 2;
const PANTRY_BUDGET_BOOST: Array<{ minPerDay: number; boost: number }> = [
  { minPerDay: 6, boost: 0.8 },
  { minPerDay: 4, boost: 0.5 },
  { minPerDay: 2, boost: 0.2 },
  { minPerDay: 0, boost: 0 },
];

const PURCHASE_CANDIDATES: CandidatePurchase[] = [
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
];

const EMPTY_PANTRY_FALLBACKS: Record<string, FallbackMeal> = {
  tofu: {
    name: 'Tofu Starter Meal',
    ingredients: ['tofu'],
    estimatedCost: 4.5,
  },
  eggs: {
    name: 'Boiled Eggs',
    ingredients: ['eggs'],
    estimatedCost: 4,
  },
  bread: {
    name: 'Bread Meal',
    ingredients: ['bread'],
    estimatedCost: 3.5,
  },
  cabbage: {
    name: 'Cabbage Stir-Fry',
    ingredients: ['cabbage'],
    estimatedCost: 4,
  },
  sardines: {
    name: 'Sardines Meal',
    ingredients: ['sardines'],
    estimatedCost: 6.5,
  },
};

const CURATED_MEALS: MealTemplate[] = [
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
];

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

function uniquePantryItems(items: string[]): string[] {
  return [...new Set(items.map(normalize).filter(Boolean))];
}

function hasPantryItem(pantry: string[], ingredient: string): boolean {
  const needle = normalize(ingredient);
  return pantry.some(item => {
    const current = normalize(item);
    return current === needle || current.includes(needle) || needle.includes(current);
  });
}

function mealMatchesPreference(meal: MealTemplate, dietaryPreference: DietaryPreference): boolean {
  if (dietaryPreference === 'no-preference') {
    return true;
  }

  if (dietaryPreference === 'low-cost-only') {
    return meal.isLowCost;
  }

  return meal.dietaryTags.includes(dietaryPreference);
}

function purchaseMatchesPreference(purchase: CandidatePurchase, dietaryPreference: DietaryPreference): boolean {
  if (dietaryPreference === 'no-preference') {
    return true;
  }

  return purchase.dietaryTags.includes(dietaryPreference);
}

function compareMealsByName(a: MealTemplate, b: MealTemplate): number {
  return a.name.localeCompare(b.name);
}

function buildCoverageBoost(budget: number, daysLeft: number): number {
  if (daysLeft <= 0) {
    return 0;
  }

  const budgetPerDay = budget / daysLeft;
  const matchedBoost = PANTRY_BUDGET_BOOST.find(rule => budgetPerDay >= rule.minPerDay);
  return matchedBoost ? matchedBoost.boost : 0;
}

function clampCoverage(daysCovered: number, daysLeft: number): number {
  return Math.min(Math.max(daysCovered, 0), daysLeft + 1);
}

function toOneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}

function buildCoverageLabel(before: number, after: number, targetDays: number): string {
  if (after > before) {
    return after >= targetDays
      ? `from ${before} days to ${targetDays}+ days`
      : `from ${before} days to ${after}+ days`;
  }

  return `stays at ${before} days`;
}

function buildCandidateRank(
  candidate: CandidatePurchase,
  unlockedMeals: MealTemplate[],
  currentCoverage: number,
): [number, number, number, number, string] {
  const coverageAfterPurchase = currentCoverage + unlockedMeals.length / MEALS_PER_DAY;
  return [
    unlockedMeals.length,
    coverageAfterPurchase,
    -candidate.estimatedCost,
    candidate.name === 'Tofu' ? 1 : 0,
    candidate.name,
  ];
}

function compareCandidateRanks(a: [number, number, number, number, string], b: [number, number, number, number, string]): number {
  for (let index = 0; index < a.length; index += 1) {
    if (a[index] === b[index]) {
      continue;
    }

    return a[index] > b[index] ? 1 : -1;
  }

  return 0;
}

function buildLocalContextNote(daysLeft: number): string {
  return `This recommendation assumes a Malaysian student trying to stretch simple pantry staples across the last ${daysLeft} day${daysLeft === 1 ? '' : 's'} before the next allowance.`;
}

function buildPurchaseComparison(
  option: PurchaseOption,
  verdict: 'selected' | 'alternative',
): PurchaseComparison {
  return {
    name: option.candidate.name,
    estimatedCost: option.candidate.estimatedCost,
    mealsUnlocked: option.unlockedMeals.length,
    coverageAfterPurchase: option.coverageAfterPurchase,
    verdict,
    reason: option.candidate.reason,
  };
}

function buildThreeDayPlan(
  pantryMeals: MealTemplate[],
  unlockedMeals: MealTemplate[],
  daysLeft: number,
  cheapestNextPurchase: ShoppingItem,
): MealSuggestion[] {
  const planDays = Math.min(daysLeft, 3);
  const meals: MealSuggestion[] = [];
  const usedMealNames = new Set<string>();

  for (const pantryMeal of pantryMeals) {
    if (meals.length >= Math.max(0, planDays - 1)) {
      break;
    }

    usedMealNames.add(pantryMeal.name);
    meals.push({
      day: meals.length + 1,
      name: pantryMeal.name,
      ingredients: pantryMeal.ingredients,
      estimatedCost: 0,
    });
  }

  const preferredUnlockedMeal = unlockedMeals.find(meal => meal.name === 'Tofu Rice Bowl')
    ?? unlockedMeals.find(meal => !usedMealNames.has(meal.name));

  if (planDays > 0 && preferredUnlockedMeal) {
    meals.push({
      day: meals.length + 1,
      name: preferredUnlockedMeal.name,
      ingredients: preferredUnlockedMeal.ingredients,
      estimatedCost: cheapestNextPurchase.estimatedCost,
    });
    usedMealNames.add(preferredUnlockedMeal.name);
  }

  while (meals.length < planDays) {
    const fallbackPantryMeal = pantryMeals.find(meal => !usedMealNames.has(meal.name))
      ?? pantryMeals[0];

    if (fallbackPantryMeal) {
      meals.push({
        day: meals.length + 1,
        name: fallbackPantryMeal.name,
        ingredients: fallbackPantryMeal.ingredients,
        estimatedCost: 0,
      });
      usedMealNames.add(fallbackPantryMeal.name);
      continue;
    }

    const fallbackPurchaseMeal = unlockedMeals.find(meal => !usedMealNames.has(meal.name));
    if (!fallbackPurchaseMeal) {
      break;
    }

    meals.push({
      day: meals.length + 1,
      name: fallbackPurchaseMeal.name,
      ingredients: fallbackPurchaseMeal.ingredients,
      estimatedCost: cheapestNextPurchase.estimatedCost,
    });
    usedMealNames.add(fallbackPurchaseMeal.name);
  }

  if (meals.length === 0 && planDays > 0) {
    const fallbackMeal = EMPTY_PANTRY_FALLBACKS[normalize(cheapestNextPurchase.name)];
    meals.push({
      day: 1,
      name: fallbackMeal?.name ?? `${cheapestNextPurchase.name} Starter Meal`,
      ingredients: fallbackMeal?.ingredients ?? [normalize(cheapestNextPurchase.name)],
      estimatedCost: fallbackMeal?.estimatedCost ?? cheapestNextPurchase.estimatedCost,
    });
  }

  return meals;
}

export function calculateSurvival(input: UserInput): SurvivalResult {
  const pantryItems = uniquePantryItems(input.pantryItems);
  const hasEmptyPantry = pantryItems.length === 0;
  const filteredMeals = CURATED_MEALS.filter(meal => mealMatchesPreference(meal, input.dietaryPreference));

  const pantryMeals = filteredMeals
    .filter(meal => meal.ingredients.every(ingredient => hasPantryItem(pantryItems, ingredient)))
    .sort(compareMealsByName);

  const pantryCoverage = pantryMeals.length / MEALS_PER_DAY;
  const budgetBoost = buildCoverageBoost(input.budget, input.daysLeft);
  const currentCoverage = toOneDecimal(clampCoverage(pantryCoverage + budgetBoost, input.daysLeft));

  const purchaseOptions = PURCHASE_CANDIDATES
    .filter(candidate => candidate.estimatedCost <= input.budget && purchaseMatchesPreference(candidate, input.dietaryPreference))
    .map(candidate => {
      const unlockedMeals = filteredMeals.filter(meal => {
        if (!meal.ingredients.some(ingredient => normalize(ingredient) === normalize(candidate.name))) {
          return false;
        }

        const missingIngredients = meal.ingredients.filter(ingredient => !hasPantryItem(pantryItems, ingredient));
        return missingIngredients.length === 1 && normalize(missingIngredients[0]) === normalize(candidate.name);
      });

      const sortedUnlockedMeals = unlockedMeals.sort(compareMealsByName);
      return {
        candidate,
        unlockedMeals: sortedUnlockedMeals,
        rank: buildCandidateRank(candidate, sortedUnlockedMeals, currentCoverage),
        coverageAfterPurchase: toOneDecimal(
          clampCoverage(currentCoverage + sortedUnlockedMeals.length / MEALS_PER_DAY, input.daysLeft),
        ),
      };
    })
    .filter(option => option.unlockedMeals.length > 0);

  const selectedPurchase = purchaseOptions.slice().sort((left, right) => compareCandidateRanks(right.rank, left.rank))[0];
  const fallbackPurchaseCandidate = PURCHASE_CANDIDATES.find(candidate =>
    normalize(candidate.name) === 'tofu' && candidate.estimatedCost <= input.budget && purchaseMatchesPreference(candidate, input.dietaryPreference),
  ) ?? PURCHASE_CANDIDATES.find(candidate =>
    candidate.estimatedCost <= input.budget && purchaseMatchesPreference(candidate, input.dietaryPreference),
  );
  const fallbackPurchase = fallbackPurchaseCandidate
    ? {
        ...fallbackPurchaseCandidate,
        mealsUnlocked: hasEmptyPantry ? 1 : fallbackPurchaseCandidate.mealsUnlocked,
        reason: hasEmptyPantry
          ? 'Gives you one simple low-cost meal to stabilize the situation before your next allowance.'
          : fallbackPurchaseCandidate.reason,
      }
    : {
        name: 'Tofu',
        estimatedCost: 4.5,
        mealsUnlocked: hasEmptyPantry ? 1 : 3,
        reason: hasEmptyPantry
          ? 'Gives you one simple low-cost meal to stabilize the situation before your next allowance.'
          : 'Unlocks additional low-cost meals and improves your chance of covering a hostel-style 3-day stretch.',
      };

  const cheapestNextPurchase: ShoppingItem = selectedPurchase?.candidate ?? fallbackPurchase;
  const unlockedMeals = selectedPurchase?.unlockedMeals ?? [];
  const fallbackUnlockedMeals = !selectedPurchase && hasEmptyPantry && cheapestNextPurchase.estimatedCost <= input.budget ? 1 : 0;
  const improvedCoverage = toOneDecimal(
    clampCoverage(currentCoverage + (unlockedMeals.length + fallbackUnlockedMeals) / MEALS_PER_DAY, input.daysLeft),
  );
  const displayedImprovedCoverage = Math.max(currentCoverage, improvedCoverage);
  const coverageImproved = buildCoverageLabel(currentCoverage, displayedImprovedCoverage, input.daysLeft);

  let survivalScore: SurvivalStatus = 'Critical';
  if (currentCoverage >= input.daysLeft + 0.3) {
    survivalScore = 'Safe';
  } else if (currentCoverage >= input.daysLeft * 0.7) {
    survivalScore = 'Tight';
  }

  let confidenceLevel: ConfidenceLevel = 'Low';
  if (survivalScore === 'Safe') {
    confidenceLevel = pantryMeals.length >= 4 && input.budget / input.daysLeft >= 6 ? 'High' : 'Medium';
  } else if (survivalScore === 'Tight') {
    confidenceLevel = pantryMeals.length >= 3 && unlockedMeals.length >= 2 ? 'Medium' : 'Low';
  }

  const meals = buildThreeDayPlan(pantryMeals, unlockedMeals, input.daysLeft, cheapestNextPurchase);
  const allIngredients = [...new Set(meals.flatMap(meal => meal.ingredients))];
  const pantryItemsUsed = allIngredients.filter(ingredient => hasPantryItem(pantryItems, ingredient));
  const missingIngredients = allIngredients.filter(ingredient => !hasPantryItem(pantryItems, ingredient));

  const totalCostMin = toOneDecimal(meals.reduce((sum, meal) => sum + meal.estimatedCost, 0));
  const totalCostMax = toOneDecimal(totalCostMin + (missingIngredients.length > 0 ? 1.5 : 0));

  const urgencyWarning = survivalScore === 'Critical'
    ? 'Your current food supply is critically low. Without immediate action, you may face days without adequate meals.'
    : survivalScore === 'Tight'
      ? 'Without adjustment, your current food plan may not last until your next allowance.'
      : 'Your situation looks manageable, but staying mindful of spending will help you stay on track.';

  const comparisonItems = selectedPurchase
    ? purchaseOptions
        .slice()
        .sort((left, right) => compareCandidateRanks(right.rank, left.rank))
        .slice(0, 3)
        .map(option => buildPurchaseComparison(
          option,
          option.candidate.name === selectedPurchase.candidate.name ? 'selected' : 'alternative',
        ))
    : [
        {
          name: cheapestNextPurchase.name,
          estimatedCost: cheapestNextPurchase.estimatedCost,
          mealsUnlocked: fallbackUnlockedMeals || cheapestNextPurchase.mealsUnlocked,
          coverageAfterPurchase: displayedImprovedCoverage,
          verdict: 'selected' as const,
          reason: cheapestNextPurchase.reason,
        },
      ];

  const purchaseRationale = selectedPurchase
    ? `${selectedPurchase.candidate.name} is the best next purchase because it unlocks ${selectedPurchase.unlockedMeals.length} extra meal option${selectedPurchase.unlockedMeals.length === 1 ? '' : 's'} and moves your coverage ${coverageImproved}.`
    : `${cheapestNextPurchase.name} is the safest fallback because it gives you at least one workable low-cost meal without requiring a full grocery restock.`;

  return {
    survivalScore,
    confidenceLevel,
    daysCovered: currentCoverage,
    urgencyWarning,
    cheapestNextPurchase,
    meals,
    pantryItemsUsed,
    missingIngredients,
    totalEstimatedCost: { min: totalCostMin, max: totalCostMax },
    budgetAfterShopping: Math.round((input.budget - cheapestNextPurchase.estimatedCost) * 100) / 100,
    coverageImproved,
    finalMessage: 'You do not need a full grocery restock. One low-cost purchase can make your current food plan more stable.',
    recommendationExplainer: {
      pantryMealNames: pantryMeals.map(meal => meal.name),
      pantryMealCount: pantryMeals.length,
      localContextNote: buildLocalContextNote(input.daysLeft),
      purchaseRationale,
      comparisonItems,
      coverageSummary: {
        before: currentCoverage,
        after: displayedImprovedCoverage,
        targetDays: input.daysLeft,
        label: coverageImproved,
      },
    },
  };
}
