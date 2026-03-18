import { motion } from 'framer-motion';
import { ChevronLeft, ShoppingCart, CheckCircle2, ArrowUpRight, List } from 'lucide-react';
import { SurvivalResult, UserInput } from '@/lib/types';

interface ShoppingSummaryProps {
  result: SurvivalResult;
  input: UserInput;
  onRestart: () => void;
  onBack: () => void;
}

const ShoppingSummary = ({ result, input, onRestart, onBack }: ShoppingSummaryProps) => {
  const fadeUp = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-12">
      <div className="max-w-lg w-full">
        <button onClick={onBack} className="font-label text-muted-foreground mb-8 hover:text-foreground transition-colors">
          <ChevronLeft className="w-4 h-4 inline mr-1" />Back to plan
        </button>

        <motion.div {...fadeUp} transition={{ duration: 0.4 }}>
          <h2 className="font-display text-3xl text-foreground mb-2">Shopping Summary</h2>
          <p className="text-muted-foreground mb-8">One smart purchase to stabilize your food plan.</p>
        </motion.div>

        {/* Best Next Purchase */}
        <motion.div {...fadeUp} transition={{ delay: 0.1, duration: 0.4 }}
          className="bg-status-safe/5 border border-status-safe/20 p-6 rounded-2xl mb-4"
        >
          <div className="flex items-center gap-3 mb-3">
            <ShoppingCart className="w-5 h-5 text-status-safe" />
            <span className="font-label text-status-safe-foreground">Best Next Purchase</span>
          </div>
          <h3 className="text-foreground text-2xl font-bold">{result.cheapestNextPurchase.name}</h3>
          <p className="font-mono text-lg text-foreground mt-1">RM{result.cheapestNextPurchase.estimatedCost.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {result.cheapestNextPurchase.reason}
          </p>
        </motion.div>

        {/* Minimal Shopping List */}
        <motion.div {...fadeUp} transition={{ delay: 0.15, duration: 0.4 }}
          className="bg-card p-5 rounded-2xl shadow-card mb-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <List className="w-4 h-4 text-primary" />
            <span className="font-label text-foreground">Minimal Shopping List</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <span className="text-sm text-foreground font-medium">{result.cheapestNextPurchase.name}</span>
            <span className="font-mono text-sm text-foreground">RM{result.cheapestNextPurchase.estimatedCost.toFixed(2)}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            This is the only item you need to buy. Everything else comes from your existing pantry.
          </p>
        </motion.div>

        {/* Budget breakdown */}
        <motion.div {...fadeUp} transition={{ delay: 0.2, duration: 0.4 }} className="bg-card rounded-2xl shadow-card mb-4 overflow-hidden">
          <div className="divide-y divide-border">
            <div className="flex items-center justify-between p-5">
              <span className="text-sm text-muted-foreground">Starting Budget</span>
              <span className="font-mono font-semibold text-foreground">RM{input.budget.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between p-5">
              <span className="text-sm text-muted-foreground">Suggested Spend</span>
              <span className="font-mono font-semibold text-status-tight">– RM{result.cheapestNextPurchase.estimatedCost.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between p-5 bg-muted/50">
              <span className="text-sm font-medium text-foreground">Estimated Remaining Budget</span>
              <span className="font-mono font-bold text-foreground">RM{result.budgetAfterShopping.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        {/* Impact */}
        <motion.div {...fadeUp} transition={{ delay: 0.3, duration: 0.4 }} className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-card p-5 rounded-2xl shadow-card">
            <span className="font-label text-muted-foreground block mb-1">Meals Unlocked</span>
            <span className="font-mono text-2xl font-bold text-foreground">2–3</span>
          </div>
          <div className="bg-card p-5 rounded-2xl shadow-card">
            <span className="font-label text-muted-foreground block mb-1">Coverage Improved</span>
            <div className="flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4 text-status-safe" />
              <span className="text-sm font-medium text-status-safe-foreground">{result.coverageImproved}</span>
            </div>
          </div>
        </motion.div>

        {/* Final message */}
        <motion.div {...fadeUp} transition={{ delay: 0.4, duration: 0.4 }}
          className="bg-card p-6 rounded-2xl shadow-card mb-8"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {result.finalMessage}
            </p>
          </div>
        </motion.div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onRestart}
          className="w-full inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-xl text-base font-semibold shadow-elevated transition-all hover:opacity-90"
        >
          Start Over
        </motion.button>
      </div>
    </div>
  );
};

export default ShoppingSummary;
