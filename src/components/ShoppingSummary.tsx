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
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
};

const ShoppingSummary = ({ result, input, onRestart, onBack }: ShoppingSummaryProps) => {
  const selectedComparison = result.recommendationExplainer.comparisonItems.find(item => item.verdict === 'selected');
  const coverageChanged = result.recommendationExplainer.coverageSummary.afterDisplay !== result.recommendationExplainer.coverageSummary.beforeDisplay;

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-10 gradient-surface relative overflow-hidden">
      <div className="absolute top-1/3 right-0 w-[350px] h-[350px] bg-primary/[0.03] rounded-full blur-3xl" />

      <div className="max-w-lg w-full relative z-10">
        <motion.button
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8 hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />Back to plan
        </motion.button>

        <motion.div {...fadeUp} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
          <p className="font-label text-primary mb-2">JiMAT+ Summary</p>
          <h2 className="font-display text-3xl sm:text-4xl text-foreground mb-1">Your Next Move</h2>
          <p className="text-sm text-muted-foreground mb-8">One smart purchase to stabilize your plan.</p>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.08, duration: 0.4 }}
          className="bg-card/70 p-4 rounded-2xl border border-border mb-4"
        >
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Optimized for survival coverage and affordability, not full nutrition planning.
            </p>
          </div>
        </motion.div>

        {/* Best next purchase */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.1, duration: 0.45 }}
          className="relative bg-card p-6 rounded-3xl shadow-elevated border-glow mb-4 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/[0.03] rounded-full -translate-y-1/2 translate-x-1/2 blur-xl" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl gradient-warm flex items-center justify-center shadow-glow">
                <ShoppingCart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-label text-primary">Best Next Purchase</span>
            </div>
            <h3 className="text-foreground text-3xl font-bold font-display">{result.cheapestNextPurchase.name}</h3>
            <p className="font-mono text-xl text-primary font-bold mt-1">
              RM{result.cheapestNextPurchase.estimatedCost.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{result.cheapestNextPurchase.reason}</p>
          </div>
        </motion.div>

        {/* Budget breakdown */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-card rounded-2xl shadow-card border border-border mb-4 overflow-hidden"
        >
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-primary" />
              <span className="font-label text-foreground">Budget Breakdown</span>
            </div>
          </div>
          <div className="divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <span className="text-sm text-muted-foreground">Starting Budget</span>
              <span className="font-mono font-bold text-foreground">RM{input.budget.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between p-4">
              <span className="text-sm text-muted-foreground">Suggested Spend</span>
              <span className="font-mono font-bold text-status-tight">- RM{result.cheapestNextPurchase.estimatedCost.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-status-safe/[0.04]">
              <span className="text-sm font-bold text-foreground font-display">Remaining</span>
              <span className="font-mono font-bold text-status-safe-foreground text-xl">RM{result.budgetAfterShopping.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        {/* Meals unlocked + Coverage */}
        <motion.div {...fadeUp} transition={{ delay: 0.3, duration: 0.4 }} className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-card p-4 rounded-2xl shadow-card border border-border text-center">
            <span className="font-label text-muted-foreground block mb-2">Meals Unlocked</span>
            <span className="font-mono text-3xl font-bold text-foreground">
              {selectedComparison?.mealsUnlocked ?? result.cheapestNextPurchase.mealsUnlocked}
            </span>
          </div>
          <div className="bg-card p-4 rounded-2xl shadow-card border border-border text-center">
            <span className="font-label text-muted-foreground block mb-2">Coverage</span>
            <div className="flex items-center justify-center gap-1.5">
              <ArrowUpRight className={`w-4 h-4 ${coverageChanged ? 'text-status-safe' : 'text-muted-foreground'}`} />
              <span className={`text-sm font-bold font-display ${coverageChanged ? 'text-status-safe-foreground' : 'text-muted-foreground'}`}>
                {result.coverageImproved}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Final message */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="bg-card p-5 rounded-2xl shadow-card border border-border mb-8"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/[0.08] border border-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Heart className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-foreground font-bold mb-1.5 font-display">You&apos;ve got this</p>
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
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRestart}
          className="w-full inline-flex items-center justify-center gap-3 gradient-warm text-primary-foreground px-8 py-4 rounded-2xl text-base font-bold shadow-glow transition-all font-display"
        >
          <RotateCcw className="w-4 h-4" />
          Start Over
        </motion.button>
      </div>
    </div>
  );
};

export default ShoppingSummary;
