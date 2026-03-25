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
  rank: [number, number, number, string];
  coverageAfterPurchase: number;
}

interface FallbackMeal {
  name: string;
  ingredients: string[];
  estimatedCost: number;
}

interface PantryServingProfile {
  servings: number;
  isStaple?: boolean;
  isProtein?: boolean;
  isFlavoring?: boolean;
}

const MEALS_PER_DAY = 2;
const BASE_DAILY_FOOD_COST = 9.5;
const MIN_DAILY_FOOD_COST = 5.5;
const PANTRY_COST_REDUCTION_RULES: Array<{
  ingredients: string[];
  discount: number;
  excludedPreferences?: DietaryPreference[];
}> = [
  { ingredients: ['rice'], discount: 1.2 },
  { ingredients: ['eggs', 'tofu'], discount: 0.7 },
  { ingredients: ['sardines'], discount: 0.7, excludedPreferences: ['vegetarian', 'low-cost-only'] },
  { ingredients: ['instant noodles', 'bread'], discount: 0.3 },
  { ingredients: ['onion', 'garlic', 'soy sauce', 'oil'], discount: 0.2 },
  { ingredients: ['cabbage'], discount: 0.2 },
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

const NO_AFFORDABLE_PURCHASE: ShoppingItem = {
  name: 'No affordable purchase',
  estimatedCost: 0,
  mealsUnlocked: 0,
  reason: 'Your remaining budget is below the cost of the cheapest helpful item, so the safest move is to stretch your pantry first and seek support if needed.',
};

const NO_URGENT_PURCHASE_NEEDED: ShoppingItem = {
  name: 'No urgent purchase needed',
  estimatedCost: 0,
  mealsUnlocked: 0,
  reason: 'Your current pantry and budget already cover the target period, so you do not need to buy anything right now unless you want extra variety.',
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

const PANTRY_SERVING_PROFILES: Record<string, PantryServingProfile> = {
  rice: { servings: 4, isStaple: true },
  bread: { servings: 3, isStaple: true },
  'instant noodles': { servings: 2, isStaple: true },
  eggs: { servings: 2, isProtein: true },
  tofu: { servings: 2, isProtein: true },
  sardines: { servings: 1.5, isProtein: true },
  cabbage: { servings: 2 },
  onion: { servings: 1, isFlavoring: true },
  garlic: { servings: 0.5, isFlavoring: true },
  'soy sauce': { servings: 0.5, isFlavoring: true },
  oil: { servings: 0.5, isFlavoring: true },
};

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

function extractExplicitQuantity(item: string): number | null {
  const normalizedItem = normalize(item);
  const quantityMatch = normalizedItem.match(/^(\d+(?:\.\d+)?)\s*(x|pcs?|pieces?|packs?|eggs?)?\s+/);
  return quantityMatch ? Number(quantityMatch[1]) : null;
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

function pantryItemsHelpPreference(
  pantryItems: string[],
  ingredients: string[],
  dietaryPreference: DietaryPreference,
): boolean {
  if (dietaryPreference === 'vegetarian' && ingredients.includes('sardines')) {
    return false;
  }

  if (dietaryPreference === 'low-cost-only' && ingredients.includes('sardines')) {
    return false;
  }

  return ingredients.some(ingredient => hasPantryItem(pantryItems, ingredient));
}

function buildBudgetDrivenCoverage(
  budget: number,
  pantryItems: string[],
  dietaryPreference: DietaryPreference,
): number {
  if (budget <= 0) {
    return 0;
  }

  const pantryDiscount = PANTRY_COST_REDUCTION_RULES.reduce((sum, rule) => {
    if (rule.excludedPreferences?.includes(dietaryPreference)) {
      return sum;
    }

    return pantryItemsHelpPreference(pantryItems, rule.ingredients, dietaryPreference)
      ? sum + rule.discount
      : sum;
  }, 0);
  const effectiveDailyCost = Math.max(MIN_DAILY_FOOD_COST, BASE_DAILY_FOOD_COST - pantryDiscount);
  return toOneDecimal(budget / effectiveDailyCost);
}

function buildPantryCoverage(pantryItems: string[], pantryMeals: MealTemplate[]): number {
  if (pantryMeals.length === 0) {
    return 0;
  }

  const templateCoverage = pantryMeals.length / MEALS_PER_DAY;
  const servingEstimate = pantryItems.reduce((sum, item) => {
    const explicitQuantity = extractExplicitQuantity(item);
    const matchedProfile = Object.entries(PANTRY_SERVING_PROFILES).find(([ingredient]) => hasPantryItem([item], ingredient))?.[1];

    if (!matchedProfile) {
      return sum + 0.5;
    }

    const quantityMultiplier = explicitQuantity ? Math.min(explicitQuantity, 6) : 1;
    return sum + matchedProfile.servings * quantityMultiplier;
  }, 0);
  const stapleCount = pantryItems.filter(item =>
    Object.entries(PANTRY_SERVING_PROFILES).some(([ingredient, profile]) => profile.isStaple && hasPantryItem([item], ingredient)),
  ).length;
  const proteinCount = pantryItems.filter(item =>
    Object.entries(PANTRY_SERVING_PROFILES).some(([ingredient, profile]) => profile.isProtein && hasPantryItem([item], ingredient)),
  ).length;
  const baseReliableCap = Math.max(0.5, servingEstimate / MEALS_PER_DAY);
  const structuralCap = stapleCount > 0 && proteinCount > 0
    ? Math.min(baseReliableCap, 1.5)
    : stapleCount > 0
      ? Math.min(baseReliableCap, 1.4)
      : Math.min(baseReliableCap, 1);
  const reliablePantryCap = pantryItems.length >= 5
    ? structuralCap
    : pantryItems.length >= 3
      ? Math.min(structuralCap, 1.2)
      : Math.min(structuralCap, 0.8);

  return toOneDecimal(Math.min(templateCoverage, reliablePantryCap));
}

function normalizeCoverage(daysCovered: number): number {
  return toOneDecimal(Math.max(daysCovered, 0));
}

function toOneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}

function buildCoverageDisplay(daysCovered: number, targetDays: number): string {
  const normalizedCoverage = normalizeCoverage(daysCovered);
  return normalizedCoverage >= targetDays ? `${targetDays}+` : `${normalizedCoverage}`;
}

function buildCoverageLabel(before: number, after: number, targetDays: number): string {
  const normalizedBefore = normalizeCoverage(before);
  const normalizedAfter = normalizeCoverage(after);
  const beforeDisplay = buildCoverageDisplay(normalizedBefore, targetDays);
  const afterDisplay = buildCoverageDisplay(normalizedAfter, targetDays);

  if (afterDisplay !== beforeDisplay) {
    return `from ${beforeDisplay} days to ${afterDisplay} days`;
  }

  return `stays at ${beforeDisplay} days`;
}

function buildCandidateRank(
  candidate: CandidatePurchase,
  coverageAfterPurchase: number,
  unlockedMeals: MealTemplate[],
): [number, number, number, string] {
  const mealValueScore = unlockedMeals.length / MEALS_PER_DAY;
  return [
    coverageAfterPurchase,
    mealValueScore,
    -candidate.estimatedCost,
    candidate.name,
  ];
}

function compareCandidateRanks(a: [number, number, number, string], b: [number, number, number, string]): number {
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
  targetDays: number,
): PurchaseComparison {
  return {
    name: option.candidate.name,
    estimatedCost: option.candidate.estimatedCost,
    mealsUnlocked: option.unlockedMeals.length,
    coverageAfterPurchase: option.coverageAfterPurchase,
    coverageAfterPurchaseDisplay: buildCoverageDisplay(option.coverageAfterPurchase, targetDays),
    verdict,
    reason: option.candidate.reason,
  };
}

function buildPurchaseMealBoost(
  candidate: CandidatePurchase,
  unlockedMeals: MealTemplate[],
  hasEmptyPantry: boolean,
): number {
  if (hasEmptyPantry) {
    return candidate.name === 'Tofu' ? 0.9 : 0.7;
  }

  const directFoodValue = candidate.name === 'Tofu'
    ? 0.7
    : candidate.name === 'Eggs'
      ? 0.6
      : candidate.name === 'Bread'
        ? 0.5
        : 0.4;

  return toOneDecimal(Math.min(1.2, directFoodValue + unlockedMeals.length * 0.2));
}

function buildThreeDayPlan(
  pantryMeals: MealTemplate[],
  unlockedMeals: MealTemplate[],
  daysLeft: number,
  cheapestNextPurchase: ShoppingItem,
  coverageTarget: number,
): MealSuggestion[] {
  const planDays = Math.min(daysLeft, 3);
  const meals: MealSuggestion[] = [];
  const usedMealNames = new Set<string>();
  let purchaseCostApplied = false;

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
      estimatedCost: purchaseCostApplied ? 0 : cheapestNextPurchase.estimatedCost,
    });
    usedMealNames.add(preferredUnlockedMeal.name);
    purchaseCostApplied = purchaseCostApplied || cheapestNextPurchase.estimatedCost > 0;
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
      estimatedCost: purchaseCostApplied ? 0 : cheapestNextPurchase.estimatedCost,
    });
    usedMealNames.add(fallbackPurchaseMeal.name);
    purchaseCostApplied = purchaseCostApplied || cheapestNextPurchase.estimatedCost > 0;
  }

  if (meals.length === 0 && planDays > 0 && cheapestNextPurchase.estimatedCost > 0) {
    const fallbackMeal = EMPTY_PANTRY_FALLBACKS[normalize(cheapestNextPurchase.name)];
    const repeatCount = Math.min(planDays, Math.max(1, Math.round(coverageTarget)));

    for (let index = 0; index < repeatCount; index += 1) {
      meals.push({
        day: index + 1,
        name: fallbackMeal?.name ?? `${cheapestNextPurchase.name} Starter Meal`,
        ingredients: fallbackMeal?.ingredients ?? [normalize(cheapestNextPurchase.name)],
        estimatedCost: index === 0 ? (fallbackMeal?.estimatedCost ?? cheapestNextPurchase.estimatedCost) : 0,
      });
    }
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

  const pantryCoverage = buildPantryCoverage(pantryItems, pantryMeals);
  const budgetDrivenCoverage = buildBudgetDrivenCoverage(
    input.budget,
    pantryItems,
    input.dietaryPreference,
  );
  const currentCoverage = normalizeCoverage(Math.max(pantryCoverage, budgetDrivenCoverage));

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
      const purchasePantryItems = uniquePantryItems([...pantryItems, candidate.name]);
      const coverageAfterPurchase = normalizeCoverage(
        buildBudgetDrivenCoverage(
          input.budget - candidate.estimatedCost,
          purchasePantryItems,
          input.dietaryPreference,
        ) + buildPurchaseMealBoost(candidate, sortedUnlockedMeals, hasEmptyPantry),
      );

      return {
        candidate,
        unlockedMeals: sortedUnlockedMeals,
        rank: buildCandidateRank(candidate, coverageAfterPurchase, sortedUnlockedMeals),
        coverageAfterPurchase,
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

  let survivalScore: SurvivalStatus = 'Critical';
  if (currentCoverage >= input.daysLeft) {
    survivalScore = 'Safe';
  } else if (currentCoverage >= input.daysLeft * 0.7) {
    survivalScore = 'Tight';
  }

  const cheapestNextPurchase: ShoppingItem = selectedPurchase?.candidate ?? fallbackPurchase;
  const unlockedMeals = selectedPurchase?.unlockedMeals ?? [];
  const hasAffordablePurchase = cheapestNextPurchase.estimatedCost <= input.budget;
  const shouldSkipPurchaseRecommendation = survivalScore === 'Safe';
  const effectiveNextPurchase = shouldSkipPurchaseRecommendation
    ? NO_URGENT_PURCHASE_NEEDED
    : hasAffordablePurchase
      ? cheapestNextPurchase
      : NO_AFFORDABLE_PURCHASE;
  const fallbackUnlockedMeals = !selectedPurchase && hasEmptyPantry && hasAffordablePurchase ? 1 : 0;
  const improvedCoverage = shouldSkipPurchaseRecommendation
    ? currentCoverage
    : selectedPurchase
      ? selectedPurchase.coverageAfterPurchase
      : hasAffordablePurchase
        ? normalizeCoverage(
            buildBudgetDrivenCoverage(
              input.budget - effectiveNextPurchase.estimatedCost,
              uniquePantryItems([...pantryItems, effectiveNextPurchase.name]),
              input.dietaryPreference,
            ) + (fallbackUnlockedMeals > 0 ? buildPurchaseMealBoost(
              {
                ...effectiveNextPurchase,
                dietaryTags: [input.dietaryPreference],
              } as CandidatePurchase,
              [],
              hasEmptyPantry,
            ) : 0),
          )
        : currentCoverage;
  const displayedImprovedCoverage = Math.max(currentCoverage, improvedCoverage);
  const coverageImproved = buildCoverageLabel(currentCoverage, displayedImprovedCoverage, input.daysLeft);

  let confidenceLevel: ConfidenceLevel = 'Low';
  if (survivalScore === 'Safe') {
    confidenceLevel = pantryMeals.length >= 4 && input.budget / input.daysLeft >= 6 ? 'High' : 'Medium';
  } else if (survivalScore === 'Tight') {
    confidenceLevel = pantryMeals.length >= 3 || improvedCoverage >= input.daysLeft ? 'Medium' : 'Low';
  }

  const meals = buildThreeDayPlan(
    pantryMeals,
    !shouldSkipPurchaseRecommendation && hasAffordablePurchase ? unlockedMeals : [],
    input.daysLeft,
    effectiveNextPurchase,
    displayedImprovedCoverage,
  );
  const allIngredients = [...new Set(meals.flatMap(meal => meal.ingredients))];
  const pantryItemsUsed = allIngredients.filter(ingredient => hasPantryItem(pantryItems, ingredient));
  const missingIngredients = allIngredients.filter(ingredient => !hasPantryItem(pantryItems, ingredient));

  const totalCostMin = toOneDecimal(meals.reduce((sum, meal) => sum + meal.estimatedCost, 0));
  const totalCostMax = toOneDecimal(totalCostMin + (missingIngredients.length > 0 ? 1.5 : 0));

  const urgencyWarning = survivalScore === 'Critical'
    ? hasAffordablePurchase
      ? 'Your current food supply is critically low. Without immediate action, you may face days without adequate meals.'
      : 'Your current food supply is critically low and your budget is below the cost of the cheapest helpful item. Stretch your pantry carefully and seek immediate support if needed.'
    : survivalScore === 'Tight'
      ? 'Without adjustment, your current food plan may not last until your next allowance.'
      : 'Your situation looks manageable, but staying mindful of spending will help you stay on track.';

  const comparisonItems = shouldSkipPurchaseRecommendation
    ? [
        {
          name: effectiveNextPurchase.name,
          estimatedCost: 0,
          mealsUnlocked: 0,
          coverageAfterPurchase: displayedImprovedCoverage,
          coverageAfterPurchaseDisplay: buildCoverageDisplay(displayedImprovedCoverage, input.daysLeft),
          verdict: 'selected' as const,
          reason: effectiveNextPurchase.reason,
        },
      ]
    : selectedPurchase
    ? purchaseOptions
        .slice()
        .sort((left, right) => compareCandidateRanks(right.rank, left.rank))
        .slice(0, 3)
        .map(option => buildPurchaseComparison(
          option,
          option.candidate.name === selectedPurchase.candidate.name ? 'selected' : 'alternative',
          input.daysLeft,
        ))
    : [
        {
          name: effectiveNextPurchase.name,
          estimatedCost: effectiveNextPurchase.estimatedCost,
          mealsUnlocked: hasAffordablePurchase ? fallbackUnlockedMeals || effectiveNextPurchase.mealsUnlocked : 0,
          coverageAfterPurchase: displayedImprovedCoverage,
          coverageAfterPurchaseDisplay: buildCoverageDisplay(displayedImprovedCoverage, input.daysLeft),
          verdict: 'selected' as const,
          reason: effectiveNextPurchase.reason,
        },
      ];

  const purchaseRationale = shouldSkipPurchaseRecommendation
    ? 'You are already covering the full target period, so there is no urgent purchase needed right now.'
    : selectedPurchase
    ? `${selectedPurchase.candidate.name} is the best next purchase because it unlocks ${selectedPurchase.unlockedMeals.length} extra meal option${selectedPurchase.unlockedMeals.length === 1 ? '' : 's'} and moves your coverage ${coverageImproved}.`
    : hasAffordablePurchase
      ? `${effectiveNextPurchase.name} is the safest fallback because it gives you at least one workable low-cost meal without requiring a full grocery restock.`
      : 'No realistic purchase fits this budget, so the safest plan is to protect your remaining pantry and seek free or subsidized food support if needed.';

  return {
    survivalScore,
    confidenceLevel,
    daysCovered: currentCoverage,
    daysCoveredDisplay: buildCoverageDisplay(currentCoverage, input.daysLeft),
    urgencyWarning,
    cheapestNextPurchase: effectiveNextPurchase,
    meals,
    pantryItemsUsed,
    missingIngredients,
    totalEstimatedCost: { min: totalCostMin, max: totalCostMax },
    budgetAfterShopping: Math.round((input.budget - effectiveNextPurchase.estimatedCost) * 100) / 100,
    coverageImproved,
    finalMessage: shouldSkipPurchaseRecommendation
      ? 'You are already in a stable position for this period, so no extra purchase is necessary unless you want more variety.'
      : hasAffordablePurchase
      ? 'You do not need a full grocery restock. One low-cost purchase can make your current food plan more stable.'
      : 'Your budget is too tight for the suggested items right now, so focus on stretching pantry staples and getting support if the gap becomes unsafe.',
    recommendationExplainer: {
      pantryMealNames: pantryMeals.map(meal => meal.name),
      pantryMealCount: pantryMeals.length,
      localContextNote: buildLocalContextNote(input.daysLeft),
      purchaseRationale,
      comparisonItems,
      coverageSummary: {
        before: currentCoverage,
        beforeDisplay: buildCoverageDisplay(currentCoverage, input.daysLeft),
        after: displayedImprovedCoverage,
        afterDisplay: buildCoverageDisplay(displayedImprovedCoverage, input.daysLeft),
        targetDays: input.daysLeft,
        label: coverageImproved,
      },
    },
  };
}
