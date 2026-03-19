import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, ChevronLeft, Info, Package, Receipt, Utensils } from 'lucide-react';
import { SurvivalResult } from '@/lib/types';

interface SurvivalPlanProps {
  result: SurvivalResult;
  onViewShopping: () => void;
  onBack: () => void;
}

const dayAccents = [
  { border: 'border-primary/20', bg: 'bg-primary/[0.04]', badge: 'gradient-warm' },
  { border: 'border-accent/20', bg: 'bg-accent/[0.04]', badge: 'bg-accent' },
  { border: 'border-status-safe/20', bg: 'bg-status-safe/[0.04]', badge: 'bg-status-safe' },
];

const SurvivalPlan = ({ result, onViewShopping, onBack }: SurvivalPlanProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-10 gradient-surface relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-primary/[0.03] rounded-full blur-3xl" />

      <div className="max-w-lg w-full relative z-10">
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
          <p className="font-label text-primary mb-2">JiMAT+ Plan</p>
          <h2 className="font-display text-3xl sm:text-4xl text-foreground mb-2">Your Survival Plan</h2>
          <p className="text-sm text-muted-foreground mb-2">Pantry-first meals. Minimal spending. Clear next steps.</p>
          <p className="text-xs text-muted-foreground/60 mb-6">
            {result.recommendationExplainer.coverageSummary.label} after one strategic purchase.
          </p>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
          className="bg-card/70 p-4 rounded-2xl border border-border mb-6"
        >
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Practical estimate, not exact meal prep. Prioritizes pantry use first, then one strategic purchase reused across the plan.
            </p>
          </div>
        </motion.div>

        {/* Day cards */}
        <div className="space-y-3 mb-6">
          {result.meals.map((meal, index) => {
            const accent = dayAccents[index] || dayAccents[0];
            return (
              <motion.div
                key={meal.day}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={`bg-card rounded-2xl shadow-card border overflow-hidden ${accent.border}`}
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl ${accent.badge} flex items-center justify-center shadow-sm`}>
                        <span className="font-mono text-xs font-bold text-primary-foreground">{meal.day}</span>
                      </div>
                      <span className="font-display text-sm font-bold text-foreground uppercase tracking-wide">Day {meal.day}</span>
                    </div>
                    {meal.estimatedCost > 0 ? (
                      <span className="font-mono text-xs text-accent font-bold bg-accent/[0.08] px-2.5 py-1 rounded-lg border border-accent/15">
                        +RM{meal.estimatedCost.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-xs text-status-safe font-bold bg-status-safe/[0.06] px-2.5 py-1 rounded-lg border border-status-safe/15">
                        Pantry only
                      </span>
                    )}
                  </div>

                  <h3 className="text-foreground font-bold text-lg mb-3 flex items-center gap-2 font-display">
                    <Utensils className="w-4 h-4 text-primary" />
                    {meal.name}
                  </h3>

                  <div className="flex flex-wrap gap-1.5">
                    {meal.ingredients.map(ingredient => (
                      <span key={ingredient} className="px-2.5 py-1 bg-secondary text-muted-foreground text-xs rounded-lg border border-border font-medium">
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Pantry used + Missing */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="grid grid-cols-2 gap-3 mb-4"
        >
          <div className="bg-card p-4 rounded-2xl shadow-card border border-border">
            <div className="flex items-center gap-2 mb-2.5">
              <Package className="w-3.5 h-3.5 text-status-safe" />
              <span className="font-label text-muted-foreground">Pantry Used</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {result.pantryItemsUsed.map(item => (
                <span key={item} className="px-2 py-1 bg-status-safe/[0.06] text-status-safe-foreground text-xs rounded-lg font-medium border border-status-safe/15">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-card p-4 rounded-2xl shadow-card border border-border">
            <div className="flex items-center gap-2 mb-2.5">
              <AlertCircle className="w-3.5 h-3.5 text-status-tight" />
              <span className="font-label text-muted-foreground">Missing</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {result.missingIngredients.length > 0 ? result.missingIngredients.map(item => (
                <span key={item} className="px-2 py-1 bg-status-tight/[0.06] text-status-tight-foreground text-xs rounded-lg font-medium border border-status-tight/15">
                  {item}
                </span>
              )) : (
                <span className="text-xs text-muted-foreground/50 italic">None needed</span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Total cost */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="bg-card p-5 rounded-2xl shadow-card border border-border mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <Receipt className="w-4 h-4 text-primary" />
            <span className="font-label text-muted-foreground">Estimated Total Cost</span>
          </div>
          <span className="font-mono text-3xl font-bold text-foreground">
            RM{result.totalEstimatedCost.min.toFixed(2)} – RM{result.totalEstimatedCost.max.toFixed(2)}
          </span>
          <p className="text-xs text-muted-foreground/60 mt-2 leading-relaxed">
            Purchase paid once, then reused across the plan where relevant.
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onViewShopping}
          className="w-full inline-flex items-center justify-center gap-3 gradient-warm text-primary-foreground px-8 py-4 rounded-2xl text-base font-bold shadow-glow transition-all font-display"
        >
          Shopping Summary
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default SurvivalPlan;
