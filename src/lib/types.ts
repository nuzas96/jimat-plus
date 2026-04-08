export type DietaryPreference = 'no-preference' | 'vegetarian' | 'halal-friendly' | 'low-cost-only';

export interface UserInput {
  budget: number;
  daysLeft: number;
  dietaryPreference: DietaryPreference;
  pantryItems: string[];
  pricingContext: string;
}

export type SurvivalStatus = 'Safe' | 'Tight' | 'Critical';
export type ConfidenceLevel = 'High' | 'Medium' | 'Low';

export interface MealTemplate {
  name: string;
  ingredients: string[];
  dietaryTags: DietaryPreference[];
  isLowCost: boolean;
}

export interface MealSuggestion {
  day: number;
  name: string;
  ingredients: string[];
  estimatedCost: number;
}

export interface ShoppingItem {
  name: string;
  estimatedCost: number;
  mealsUnlocked: number;
  reason: string;
}

export interface PurchaseCandidate extends ShoppingItem {
  dietaryTags: DietaryPreference[];
}

export interface PricingContext {
  id: string;
  label: string;
  ingredientPriceOverrides: Record<string, number>;
  contextNote: string;
}

export interface SupportResource {
  id: string;
  title: string;
  audience: string;
  triggerStatuses: SurvivalStatus[];
  actionText: string;
  contactInfo?: string;
}

export interface PurchaseComparison {
  name: string;
  estimatedCost: number;
  mealsUnlocked: number;
  coverageAfterPurchase: number;
  coverageAfterPurchaseDisplay: string;
  verdict: 'selected' | 'alternative';
  reason: string;
}

export interface CoverageSummary {
  before: number;
  beforeDisplay: string;
  after: number;
  afterDisplay: string;
  targetDays: number;
  label: string;
}

export interface RecommendationExplainer {
  pantryMealNames: string[];
  pantryMealCount: number;
  localContextNote: string;
  purchaseRationale: string;
  comparisonItems: PurchaseComparison[];
  coverageSummary: CoverageSummary;
  selectedPricingContextLabel: string;
  selectedPricingContextNote: string;
  selectedMissingIngredient: string | null;
  whyAlternativesLost: string[];
}

export interface AssessmentAnalytics {
  pantryItemCount: number;
  comparisonCount: number;
}

export interface SurvivalResult {
  survivalScore: SurvivalStatus;
  confidenceLevel: ConfidenceLevel;
  daysCovered: number;
  daysCoveredDisplay: string;
  urgencyWarning: string;
  cheapestNextPurchase: ShoppingItem;
  meals: MealSuggestion[];
  pantryItemsUsed: string[];
  missingIngredients: string[];
  totalEstimatedCost: { min: number; max: number };
  budgetAfterShopping: number;
  coverageImproved: string;
  finalMessage: string;
  recommendationExplainer: RecommendationExplainer;
  selectedPricingContext: PricingContext;
  supportRecommendations: SupportResource[];
  analytics: AssessmentAnalytics;
}

export interface FinalsCatalog {
  meals: MealTemplate[];
  purchaseCandidates: PurchaseCandidate[];
  pricingContexts: PricingContext[];
  supportResources: SupportResource[];
}

export interface ValidationMetric {
  label: string;
  value: string;
  detail: string;
}

export interface ValidationQuote {
  quote: string;
  source: string;
}

export interface ScenarioEvidence {
  name: string;
  summary: string;
  outcome: string;
}

export interface ComparisonRow {
  category: string;
  jimatPlus: string;
  recipeApps: string;
  budgetingApps: string;
  pantryApps: string;
}

export interface ValidationSnapshot {
  metrics: ValidationMetric[];
  quotes: ValidationQuote[];
  scenarios: ScenarioEvidence[];
  comparisonRows: ComparisonRow[];
}

export interface AssessmentLog {
  timestamp: string;
  pricingContext: string;
  budget: number;
  daysLeft: number;
  pantryItemCount: number;
  survivalScore: SurvivalStatus;
  recommendationName: string;
  coverageBefore: number;
  coverageAfter: number;
}
