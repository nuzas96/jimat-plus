import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, ChevronLeft, Info, Package, Receipt, Utensils } from 'lucide-react';
import { SurvivalResult } from '@/lib/types';

interface SurvivalPlanProps {
  result: SurvivalResult;
  onViewShopping: () => void;
  onBack: () => void;
}

const dayColors = [
  'border-primary/30 bg-primary/5',
  'border-accent/30 bg-accent/5',
  'border-status-safe/30 bg-status-safe/5',
];

const SurvivalPlan = ({ result, onViewShopping, onBack }: SurvivalPlanProps) => {
  const hasPurchase = result.cheapestNextPurchase.estimatedCost > 0;
  const targetPlanDays = Math.min(result.recommendationExplainer.coverageSummary.targetDays, 3);
  const hasPartialPlan = result.meals.length > 0 && result.meals.length < targetPlanDays;
  const hasNoPlanMeals = result.meals.length === 0;

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-10 gradient-surface">
      <div className="max-w-lg w-full">
        <motion.button
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8 hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />Back to results
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-display text-2xl sm:text-3xl text-foreground mb-1">Your JiMAT+ Survival Plan</h2>
          <p className="text-sm text-muted-foreground mb-2">
            {hasPurchase ? 'Pantry-first meals, minimal spending, clearer next steps.' : 'Pantry-first meals and safer next steps for the days ahead.'}
          </p>
          <p className="text-xs text-muted-foreground/70 mb-4">
            {hasPurchase
              ? `${result.recommendationExplainer.coverageSummary.label} after one strategic purchase.`
              : `${result.recommendationExplainer.coverageSummary.label} without any extra purchase.`}
          </p>
          <p className="text-xs text-muted-foreground/70 mb-4">
            Pricing context: {result.selectedPricingContext.label}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
          className="bg-card p-4 rounded-2xl shadow-card border border-border/50 mb-6"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Info className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {hasPurchase
                ? 'This plan is a practical estimate, not exact meal prep tracking. It prioritizes pantry use first, then applies one strategic purchase once across the plan.'
                : 'This plan is a practical estimate, not exact meal prep tracking. It prioritizes pantry use first and avoids adding any purchase that your current situation does not support.'}
            </p>
          </div>
        </motion.div>

        {(hasPartialPlan || hasNoPlanMeals) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.4 }}
            className="bg-status-tight/5 p-4 rounded-2xl shadow-card border border-status-tight/20 mb-6"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-status-tight/10 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-4 h-4 text-status-tight" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {hasNoPlanMeals
                  ? 'JiMAT+ cannot build a safe sample meal sequence from your current budget and pantry. Treat this as an emergency state: protect any remaining staples and use the support or next-step guidance immediately.'
                  : `JiMAT+ is only showing ${result.meals.length} practical day${result.meals.length === 1 ? '' : 's'} here because the current situation does not credibly support a fuller 3-day sample plan.`}
              </p>
            </div>
          </motion.div>
        )}

        <div className="space-y-3 mb-6">
          {result.meals.map((meal, index) => (
            <motion.div
              key={meal.day}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1), duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className={`bg-card rounded-2xl shadow-card border overflow-hidden ${dayColors[index] || 'border-border/50'}`}
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl gradient-warm flex items-center justify-center shadow-sm">
                      <span className="font-mono text-xs font-bold text-primary-foreground">{meal.day}</span>
                    </div>
                    <div>
                      <span className="font-label text-muted-foreground">Day {meal.day}</span>
                    </div>
                  </div>
                  {meal.estimatedCost > 0 ? (
                    <span className="font-mono text-xs text-accent font-semibold bg-accent/10 px-2 py-1 rounded-lg">
                      +RM{meal.estimatedCost.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-xs text-status-safe font-semibold bg-status-safe/10 px-2 py-1 rounded-lg">
                      Pantry only
                    </span>
                  )}
                </div>

                <h3 className="text-foreground font-semibold text-base mb-2.5 flex items-center gap-2">
                  <Utensils className="w-3.5 h-3.5 text-primary" />
                  {meal.name}
                </h3>

                <div className="flex flex-wrap gap-1.5">
                  {meal.ingredients.map(ingredient => (
                    <span key={ingredient} className="px-2.5 py-1 bg-muted/60 text-muted-foreground text-xs rounded-lg border border-border/30 font-medium">
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {hasNoPlanMeals && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.4 }}
            className="bg-card rounded-2xl shadow-card border border-border/50 p-5 mb-6"
          >
            <p className="text-sm font-semibold text-foreground mb-2">What to do right now</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Follow the next-step guidance in your results and shopping summary. JiMAT+ is intentionally not inventing a meal plan here because the current resources do not support a believable one.
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="grid grid-cols-2 gap-3 mb-4"
        >
          <div className="bg-card p-4 rounded-2xl shadow-card border border-border/50">
            <div className="flex items-center gap-2 mb-2.5">
              <Package className="w-3.5 h-3.5 text-status-safe" />
              <span className="font-label text-muted-foreground">Pantry Used</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {result.pantryItemsUsed.map(item => (
                <span key={item} className="px-2 py-1 bg-status-safe/8 text-status-safe-foreground text-xs rounded-lg font-medium border border-status-safe/15">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-card p-4 rounded-2xl shadow-card border border-border/50">
            <div className="flex items-center gap-2 mb-2.5">
              <AlertCircle className="w-3.5 h-3.5 text-status-tight" />
              <span className="font-label text-muted-foreground">Missing</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {result.missingIngredients.length > 0 ? result.missingIngredients.map(item => (
                <span key={item} className="px-2 py-1 bg-status-tight/8 text-status-tight-foreground text-xs rounded-lg font-medium border border-status-tight/15">
                  {item}
                </span>
              )) : (
                <span className="text-xs text-muted-foreground italic">None needed</span>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="bg-card p-5 rounded-2xl shadow-card border border-border/50 mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <Receipt className="w-4 h-4 text-primary" />
            <span className="font-label text-muted-foreground">Estimated Total Cost</span>
          </div>
          <span className="font-mono text-2xl font-bold text-foreground">
            RM{result.totalEstimatedCost.min.toFixed(2)} - RM{result.totalEstimatedCost.max.toFixed(2)}
          </span>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            {hasPurchase
              ? 'This estimate assumes your recommended purchase is paid for once, then reused across the plan where relevant.'
              : 'This estimate reflects a no-purchase path based on your current pantry and budget situation.'}
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4 }}
          whileHover={{ scale: 1.01, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={onViewShopping}
          className="w-full inline-flex items-center justify-center gap-3 gradient-warm text-primary-foreground px-8 py-4 rounded-2xl text-base font-semibold shadow-glow transition-all"
        >
          See JiMAT+ Shopping Summary
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default SurvivalPlan;
