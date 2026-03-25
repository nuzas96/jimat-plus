import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, Heart, Info, RotateCcw, ShoppingCart, Wallet } from 'lucide-react';
import { SurvivalResult, UserInput } from '@/lib/types';

interface ShoppingSummaryProps {
  result: SurvivalResult;
  input: UserInput;
  onRestart: () => void;
  onBack: () => void;
}

const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

const ShoppingSummary = ({ result, input, onRestart, onBack }: ShoppingSummaryProps) => {
  const selectedComparison = result.recommendationExplainer.comparisonItems.find(item => item.verdict === 'selected');
  const coverageChanged = result.recommendationExplainer.coverageSummary.afterDisplay !== result.recommendationExplainer.coverageSummary.beforeDisplay;

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-10 gradient-surface">
      <div className="max-w-lg w-full">
        <motion.button
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8 hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />Back to plan
        </motion.button>

        <motion.div {...fadeUp} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
          <h2 className="font-display text-2xl sm:text-3xl text-foreground mb-1">JiMAT+ Shopping Summary</h2>
          <p className="text-sm text-muted-foreground mb-8">One purchase to stabilize your plan.</p>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ delay: 0.08, duration: 0.4 }}
          className="bg-card p-4 rounded-2xl shadow-card border border-border/50 mb-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Info className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This recommendation is optimized for survival coverage and affordability, not full nutrition planning or exact household inventory.
            </p>
          </div>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ delay: 0.1, duration: 0.45 }}
          className="relative bg-card p-6 rounded-3xl shadow-elevated border border-primary/15 mb-4 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-warm flex items-center justify-center shadow-sm">
                <ShoppingCart className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <span className="font-label text-primary">Best Next Step</span>
              </div>
            </div>
            <h3 className="text-foreground text-2xl font-bold">{result.cheapestNextPurchase.name}</h3>
            <p className="font-mono text-lg text-primary font-semibold mt-1">
              RM{result.cheapestNextPurchase.estimatedCost.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{result.cheapestNextPurchase.reason}</p>
          </div>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-card rounded-2xl shadow-card border border-border/50 mb-4 overflow-hidden"
        >
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-primary" />
              <span className="font-label text-foreground">Budget Breakdown</span>
            </div>
          </div>
          <div className="divide-y divide-border/50">
            <div className="flex items-center justify-between p-4">
              <span className="text-sm text-muted-foreground">Starting Budget</span>
              <span className="font-mono font-semibold text-foreground">RM{input.budget.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between p-4">
              <span className="text-sm text-muted-foreground">Suggested Spend</span>
              <span className="font-mono font-semibold text-status-tight">- RM{result.cheapestNextPurchase.estimatedCost.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-status-safe/5">
              <span className="text-sm font-semibold text-foreground">Remaining Budget</span>
              <span className="font-mono font-bold text-status-safe-foreground text-lg">RM{result.budgetAfterShopping.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.3, duration: 0.4 }} className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-card p-4 rounded-2xl shadow-card border border-border/50 text-center">
            <span className="font-label text-muted-foreground block mb-2">Meals Unlocked</span>
            <span className="font-mono text-2xl font-bold text-foreground">
              {selectedComparison?.mealsUnlocked ?? result.cheapestNextPurchase.mealsUnlocked}
            </span>
          </div>
          <div className="bg-card p-4 rounded-2xl shadow-card border border-border/50 text-center">
            <span className="font-label text-muted-foreground block mb-2">Coverage</span>
            <div className="flex items-center justify-center gap-1">
              <ArrowUpRight className={`w-4 h-4 ${coverageChanged ? 'text-status-safe' : 'text-muted-foreground'}`} />
              <span className={`text-sm font-semibold ${coverageChanged ? 'text-status-safe-foreground' : 'text-muted-foreground'}`}>
                {result.coverageImproved}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="bg-card p-5 rounded-2xl shadow-card border border-border/50 mb-8"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Heart className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-foreground font-medium mb-1.5">Next move</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {result.finalMessage}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          whileHover={{ scale: 1.01, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRestart}
          className="w-full inline-flex items-center justify-center gap-3 gradient-warm text-primary-foreground px-8 py-4 rounded-2xl text-base font-semibold shadow-glow transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Start Over
        </motion.button>
      </div>
    </div>
  );
};

export default ShoppingSummary;
