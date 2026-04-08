import { describe, expect, it } from 'vitest';
import { calculateSurvival } from '@/lib/survival-engine';
import { UserInput } from '@/lib/types';

function buildInput(overrides: Partial<UserInput> = {}): UserInput {
  return {
    budget: 20,
    daysLeft: 3,
    dietaryPreference: 'no-preference',
    pantryItems: ['rice', 'eggs', 'onion', 'instant noodles'],
    pricingContext: 'upm-hostel',
    ...overrides,
  };
}

describe('calculateSurvival', () => {
  it('returns the locked canonical demo outputs', () => {
    const result = calculateSurvival(buildInput());

    expect(result.daysCovered).toBe(2.8);
    expect(result.daysCoveredDisplay).toBe('2.8');
    expect(result.survivalScore).toBe('Tight');
    expect(result.confidenceLevel).toBe('Medium');
    expect(result.cheapestNextPurchase.name).toBe('Tofu');
    expect(result.cheapestNextPurchase.estimatedCost).toBe(4.5);
    expect(result.coverageImproved).toBe('from 2.8 days to 3+ days');
    expect(result.recommendationExplainer.coverageSummary.label).toBe('from 2.8 days to 3+ days');
    expect(result.recommendationExplainer.coverageSummary.beforeDisplay).toBe('2.8');
    expect(result.recommendationExplainer.coverageSummary.afterDisplay).toBe('3+');
    expect(result.recommendationExplainer.pantryMealNames).toEqual([
      'Egg Fried Rice',
      'Instant Noodles with Egg',
      'Onion Omelette with Rice',
      'Plain Rice with Onion',
    ]);
    expect(result.recommendationExplainer.comparisonItems[0]).toMatchObject({
      name: 'Tofu',
      verdict: 'selected',
      mealsUnlocked: 2,
      coverageAfterPurchase: 3.3,
      coverageAfterPurchaseDisplay: '3+',
    });
    expect(result.recommendationExplainer.comparisonItems[1]).toMatchObject({
      verdict: 'alternative',
    });
    expect(result.meals.map(meal => meal.name)).toEqual([
      'Egg Fried Rice',
      'Instant Noodles with Egg',
      'Tofu Rice Bowl',
    ]);
    expect(result.missingIngredients).toEqual(['tofu']);
    expect(result.recommendationExplainer.selectedPricingContextLabel).toBe('Student-Area Budget Preset');
    expect(result.recommendationExplainer.whyAlternativesLost.length).toBeGreaterThan(0);
  });

  it('returns a critical warning for a fragile low-budget case', () => {
    const result = calculateSurvival(buildInput({
      budget: 5,
      pantryItems: ['instant noodles'],
    }));

    expect(result.survivalScore).toBe('Critical');
    expect(result.confidenceLevel).toBe('Low');
    expect(result.urgencyWarning).toContain('critically low');
    expect(result.supportRecommendations.length).toBeGreaterThan(0);
  });

  it('returns a safer result for a stronger pantry and budget', () => {
    const result = calculateSurvival(buildInput({
      budget: 35,
      pantryItems: ['rice', 'eggs', 'onion', 'instant noodles', 'bread', 'tofu'],
    }));

    expect(result.survivalScore).toBe('Safe');
    expect(result.confidenceLevel).toBe('High');
    expect(result.daysCovered).toBeGreaterThanOrEqual(4.9);
    expect(result.daysCoveredDisplay).toBe('3+');
    expect(result.coverageImproved).toBe('stays at 3+ days');
    expect(result.cheapestNextPurchase.name).toBe('No urgent purchase needed');
    expect(result.cheapestNextPurchase.estimatedCost).toBe(0);
    expect(result.supportRecommendations).toEqual([]);
  });

  it('filters out non-vegetarian unlocks for vegetarian mode', () => {
    const result = calculateSurvival(buildInput({
      dietaryPreference: 'vegetarian',
      pantryItems: ['rice', 'onion', 'instant noodles'],
    }));

    expect(result.cheapestNextPurchase.name).not.toBe('Sardines');
    expect(result.meals.every(meal => meal.name !== 'Sardine Rice')).toBe(true);
  });

  it('keeps low-cost-only mode away from non-low-cost candidates and meals', () => {
    const result = calculateSurvival(buildInput({
      dietaryPreference: 'low-cost-only',
      pantryItems: ['rice', 'onion'],
    }));

    expect(result.cheapestNextPurchase.name).not.toBe('Sardines');
    expect(result.meals.every(meal => meal.name !== 'Sardine Rice')).toBe(true);
  });

  it('uses a real fallback meal for an empty pantry case', () => {
    const result = calculateSurvival(buildInput({
      budget: 12,
      pantryItems: [],
    }));

    expect(result.meals[0]?.name).toBe('Tofu Starter Meal');
    expect(result.meals).toHaveLength(2);
    expect(result.meals[1]?.estimatedCost).toBe(0);
    expect(result.missingIngredients).toEqual(['tofu']);
    expect(result.cheapestNextPurchase.mealsUnlocked).toBe(1);
    expect(result.daysCovered).toBe(1.3);
    expect(result.daysCoveredDisplay).toBe('1.3');
    expect(result.coverageImproved).toBe('from 1.3 days to 1.8 days');
    expect(result.recommendationExplainer.coverageSummary.afterDisplay).toBe('1.8');
    expect(result.recommendationExplainer.comparisonItems).toHaveLength(1);
  });

  it('does not mark a high-budget long-horizon case as critical when budget can clearly cover the period', () => {
    const result = calculateSurvival(buildInput({
      budget: 450,
      daysLeft: 21,
      pantryItems: ['rice', 'tofu', 'instant noodles'],
    }));

    expect(result.daysCovered).toBeGreaterThanOrEqual(21);
    expect(result.daysCoveredDisplay).toBe('21+');
    expect(result.survivalScore).toBe('Safe');
    expect(result.confidenceLevel).toBe('Medium');
  });

  it('does not recommend spending beyond the available budget', () => {
    const result = calculateSurvival(buildInput({
      budget: 2,
      pantryItems: [],
    }));

    expect(result.cheapestNextPurchase.name).toBe('No affordable purchase');
    expect(result.cheapestNextPurchase.estimatedCost).toBe(0);
    expect(result.budgetAfterShopping).toBe(2);
    expect(result.coverageImproved).toBe('stays at 0.2 days');
    expect(result.meals).toHaveLength(0);
  });

  it('caps pantry-only coverage so template variety does not imply unlimited inventory', () => {
    const result = calculateSurvival(buildInput({
      budget: 0,
      pantryItems: ['rice', 'eggs', 'onion', 'instant noodles', 'bread', 'tofu'],
    }));

    expect(result.daysCovered).toBeLessThanOrEqual(1.5);
    expect(result.survivalScore).toBe('Critical');
  });

  it('uses explicit quantity hints when pantry items include counts', () => {
    const baseline = calculateSurvival(buildInput({
      budget: 0,
      pantryItems: ['rice', 'eggs', 'onion'],
    }));
    const withQuantities = calculateSurvival(buildInput({
      budget: 0,
      pantryItems: ['rice', '3 eggs', 'onion'],
    }));

    expect(withQuantities.daysCovered).toBeGreaterThanOrEqual(baseline.daysCovered);
  });

  it('normalizes casing and duplicate pantry items before scoring', () => {
    const normalized = calculateSurvival(buildInput({
      pantryItems: ['rice', 'eggs', 'onion'],
    }));
    const noisyInput = calculateSurvival(buildInput({
      pantryItems: [' Rice ', 'EGGS', 'onion', 'rice', 'eggs'],
    }));

    expect(noisyInput.daysCovered).toBe(normalized.daysCovered);
    expect(noisyInput.cheapestNextPurchase.name).toBe(normalized.cheapestNextPurchase.name);
  });

  it('counts a strategic purchase only once in the three-day plan cost', () => {
    const result = calculateSurvival(buildInput({
      budget: 10,
      pantryItems: ['rice', 'onion'],
    }));

    expect(result.meals.filter(meal => meal.estimatedCost > 0)).toHaveLength(1);
    expect(result.totalEstimatedCost.min).toBeLessThanOrEqual(result.cheapestNextPurchase.estimatedCost);
  });

  it('keeps fragile plans conservative instead of padding a full three days', () => {
    const result = calculateSurvival(buildInput({
      budget: 5,
      pantryItems: ['instant noodles'],
    }));

    expect(result.survivalScore).toBe('Critical');
    expect(result.meals.length).toBeLessThanOrEqual(1);
  });

  it('applies pricing context overrides without breaking deterministic logic', () => {
    const genericCampus = calculateSurvival(buildInput({
      pricingContext: 'generic-campus',
    }));
    const repeated = calculateSurvival(buildInput({
      pricingContext: 'generic-campus',
    }));

    expect(genericCampus.cheapestNextPurchase.estimatedCost).toBe(4.8);
    expect(genericCampus.daysCovered).toBe(repeated.daysCovered);
    expect(genericCampus.recommendationExplainer.selectedPricingContextLabel).toBe('Campus Budget Preset');
  });

  it('falls back to the default pricing context when the id is unknown', () => {
    const fallback = calculateSurvival(buildInput({
      pricingContext: 'unknown-context',
    }));

    expect(fallback.cheapestNextPurchase.estimatedCost).toBe(4.5);
    expect(fallback.recommendationExplainer.selectedPricingContextLabel).toBe('Student-Area Budget Preset');
  });

  it('keeps the same recommendation under urban price pressure while lowering affordability', () => {
    const baseline = calculateSurvival(buildInput());
    const urban = calculateSurvival(buildInput({
      pricingContext: 'urban-off-campus',
    }));

    expect(urban.cheapestNextPurchase.name).toBe(baseline.cheapestNextPurchase.name);
    expect(urban.cheapestNextPurchase.estimatedCost).toBeGreaterThan(baseline.cheapestNextPurchase.estimatedCost);
    expect(urban.daysCovered).toBeLessThanOrEqual(baseline.daysCovered);
  });

  it('keeps support recommendations off for non-critical results', () => {
    const tight = calculateSurvival(buildInput());
    const safe = calculateSurvival(buildInput({
      budget: 35,
      pantryItems: ['rice', 'eggs', 'onion', 'instant noodles', 'bread', 'tofu'],
    }));

    expect(tight.survivalScore).toBe('Tight');
    expect(tight.supportRecommendations).toEqual([]);
    expect(safe.supportRecommendations).toEqual([]);
  });

  it('populates explanation fields needed for judge-facing trust', () => {
    const result = calculateSurvival(buildInput());

    expect(result.recommendationExplainer.localContextNote).toContain('Student-Area Budget Preset');
    expect(result.recommendationExplainer.selectedMissingIngredient).toBe('tofu');
    expect(result.recommendationExplainer.comparisonItems[0]?.reason.length).toBeGreaterThan(0);
  });
});
