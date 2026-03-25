import { describe, expect, it } from 'vitest';
import { calculateSurvival } from '@/lib/survival-engine';
import { UserInput } from '@/lib/types';

function buildInput(overrides: Partial<UserInput> = {}): UserInput {
  return {
    budget: 20,
    daysLeft: 3,
    dietaryPreference: 'no-preference',
    pantryItems: ['rice', 'eggs', 'onion', 'instant noodles'],
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
  });

  it('returns a critical warning for a fragile low-budget case', () => {
    const result = calculateSurvival(buildInput({
      budget: 5,
      pantryItems: ['instant noodles'],
    }));

    expect(result.survivalScore).toBe('Critical');
    expect(result.confidenceLevel).toBe('Low');
    expect(result.urgencyWarning).toContain('critically low');
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
  });

  it('filters out non-vegetarian unlocks for vegetarian mode', () => {
    const result = calculateSurvival(buildInput({
      dietaryPreference: 'vegetarian',
      pantryItems: ['rice', 'onion', 'instant noodles'],
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

  it('counts a strategic purchase only once in the three-day plan cost', () => {
    const result = calculateSurvival(buildInput({
      budget: 10,
      pantryItems: ['rice', 'onion'],
    }));

    expect(result.meals.filter(meal => meal.estimatedCost > 0)).toHaveLength(1);
    expect(result.totalEstimatedCost.min).toBeLessThanOrEqual(result.cheapestNextPurchase.estimatedCost);
  });
});
