import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, ChevronLeft, Package, Receipt, Utensils, Info } from 'lucide-react';
import { SurvivalResult } from '@/lib/types';

interface SurvivalPlanProps {
  result: SurvivalResult;
  onViewShopping: () => void;
  onBack: () => void;
}

const SurvivalPlan = ({ result, onViewShopping, onBack }: SurvivalPlanProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-10 gradient-surface">
      <div className="max-w-lg w-full">
        <motion.button
          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8 hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />Back to results
        </motion.button>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <span className="font-mono text-xs text-primary tracking-[0.2em] uppercase block mb-2">Survival Plan</span>
          <h2 className="font-display text-2xl sm:text-3xl text-foreground mb-1">Your 3-Day Strategy</h2>
          <p className="text-sm text-muted-foreground mb-2">Pantry-first meals. Minimal spending.</p>
          <p className="text-xs text-muted-foreground/60 mb-6">
            {result.recommendationExplainer.coverageSummary.label} after one strategic purchase.
          </p>
        </motion.div>

        {/* Disclaimer */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="bg-card rounded-xl border border-border p-4 mb-6 flex items-start gap-3"
        >
          <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            This is a practical estimate, not exact meal prep. Prioritizes pantry use, then applies one strategic purchase.
          </p>
        </motion.div>

        {/* Meal cards */}
        <div className="space-y-3 mb-6">
          {result.meals.map((meal, i) => (
            <motion.div
              key={meal.day}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.45 }}
              className="bg-card rounded-xl border border-border overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg gradient-warm flex items-center justify-center">
                      <span className="font-mono text-xs font-bold text-primary-foreground">{meal.day}</span>
                    </div>
                    <span className="font-label text-muted-foreground">Day {meal.day}</span>
                  </div>
                  {meal.estimatedCost > 0 ? (
                    <span className="font-mono text-xs text-status-tight font-semibold bg-status-tight/10 px-2 py-1 rounded-md border border-status-tight/20">
                      +RM{meal.estimatedCost.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-xs text-status-safe font-semibold bg-status-safe/10 px-2 py-1 rounded-md border border-status-safe/20">
                      Pantry only
                    </span>
                  )}
                </div>

                <h3 className="text-foreground font-semibold text-base mb-3 flex items-center gap-2">
                  <Utensils className="w-3.5 h-3.5 text-primary" />
                  {meal.name}
                </h3>

                <div className="flex flex-wrap gap-1.5">
                  {meal.ingredients.map(ing => (
                    <span key={ing} className="px-2.5 py-1 bg-secondary text-muted-foreground text-xs rounded-md border border-border font-medium">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pantry Used + Missing */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-3 mb-4"
        >
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 mb-2.5">
              <Package className="w-3.5 h-3.5 text-status-safe" />
              <span className="font-label text-muted-foreground">Pantry Used</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {result.pantryItemsUsed.map(item => (
                <span key={item} className="px-2 py-1 bg-status-safe/10 text-status-safe-foreground text-xs rounded-md font-medium border border-status-safe/20">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 mb-2.5">
              <AlertCircle className="w-3.5 h-3.5 text-status-tight" />
              <span className="font-label text-muted-foreground">Missing</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {result.missingIngredients.length > 0 ? result.missingIngredients.map(item => (
                <span key={item} className="px-2 py-1 bg-status-tight/10 text-status-tight-foreground text-xs rounded-md font-medium border border-status-tight/20">
                  {item}
                </span>
              )) : (
                <span className="text-xs text-muted-foreground italic">None</span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Estimated cost */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="bg-card rounded-xl border border-border p-5 mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <Receipt className="w-4 h-4 text-primary" />
            <span className="font-label text-muted-foreground">Estimated Total Cost</span>
          </div>
          <span className="font-mono text-2xl font-bold text-foreground">
            RM{result.totalEstimatedCost.min.toFixed(2)} – RM{result.totalEstimatedCost.max.toFixed(2)}
          </span>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            One purchase, reused across the plan where relevant.
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.01, y: -1 }} whileTap={{ scale: 0.98 }}
          onClick={onViewShopping}
          className="w-full inline-flex items-center justify-center gap-3 gradient-warm text-primary-foreground px-8 py-4 rounded-xl text-base font-semibold shadow-glow transition-all"
        >
          See Shopping Summary
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default SurvivalPlan;
