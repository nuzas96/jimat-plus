import { motion } from 'framer-motion';
import { AlertTriangle, ShoppingBag, TrendingDown, ArrowRight, ChevronLeft } from 'lucide-react';
import { SurvivalResult, UserInput } from '@/lib/types';

interface ResultsDashboardProps {
  result: SurvivalResult;
  input: UserInput;
  onViewPlan: () => void;
  onBack: () => void;
}

const statusColors = {
  Safe: { bg: 'bg-status-safe/10', text: 'text-status-safe', border: 'border-status-safe' },
  Tight: { bg: 'bg-status-tight/10', text: 'text-status-tight', border: 'border-status-tight' },
  Critical: { bg: 'bg-status-critical/10', text: 'text-status-critical', border: 'border-status-critical' },
};

const confidenceColors = {
  High: 'text-status-safe',
  Medium: 'text-status-tight',
  Low: 'text-status-critical',
};

const ResultsDashboard = ({ result, input, onViewPlan, onBack }: ResultsDashboardProps) => {
  const colors = statusColors[result.survivalScore];
  const fadeUp = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-12">
      <div className="max-w-lg w-full">
        <button onClick={onBack} className="font-label text-muted-foreground mb-8 hover:text-foreground transition-colors">
          <ChevronLeft className="w-4 h-4 inline mr-1" />Back to input
        </button>

        <motion.div {...fadeUp} transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}>
          <h2 className="font-display text-3xl text-foreground mb-8">Your Food Survival Results</h2>
        </motion.div>

        {/* Main metric */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
          className="flex flex-col items-center p-8 bg-card rounded-2xl shadow-elevated mb-4"
        >
          <span className="font-label text-muted-foreground mb-2">Estimated Days Covered</span>
          <div className={`w-40 h-40 rounded-full border-4 ${colors.border} flex flex-col items-center justify-center mb-3`}>
            <div className="font-mono text-6xl font-bold text-foreground">{result.daysCovered}</div>
            <span className="text-sm text-muted-foreground">days</span>
          </div>
          <div className={`px-4 py-1 rounded-full ${colors.bg} ${colors.text} text-sm font-bold uppercase tracking-wide`}>
            {result.survivalScore}
          </div>
        </motion.div>

        {/* Status cards */}
        <motion.div {...fadeUp} transition={{ delay: 0.2, duration: 0.4 }} className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-card p-5 rounded-2xl shadow-card">
            <span className="font-label text-muted-foreground block mb-1">Survival Score</span>
            <span className={`text-lg font-bold ${colors.text}`}>{result.survivalScore}</span>
          </div>
          <div className="bg-card p-5 rounded-2xl shadow-card">
            <span className="font-label text-muted-foreground block mb-1">Confidence Level</span>
            <span className={`text-lg font-bold ${confidenceColors[result.confidenceLevel]}`}>{result.confidenceLevel}</span>
          </div>
        </motion.div>

        {/* Explanation */}
        <motion.div {...fadeUp} transition={{ delay: 0.3, duration: 0.4 }} className="bg-card p-5 rounded-2xl shadow-card mb-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your current pantry and remaining RM{input.budget.toFixed(2)} budget can almost cover the next {input.daysLeft} days, but the plan is still fragile.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mt-2">
            Your pantry already supports a few low-cost meals. One small purchase can extend your plan and reduce the risk of running out before your next allowance.
          </p>
        </motion.div>

        {/* Urgency card */}
        <motion.div {...fadeUp} transition={{ delay: 0.4, duration: 0.4 }}
          className={`p-5 rounded-2xl mb-4 border-l-4 ${
            result.survivalScore === 'Critical' ? 'bg-status-critical/5 border-status-critical' :
            result.survivalScore === 'Tight' ? 'bg-status-tight/5 border-status-tight' :
            'bg-status-safe/5 border-status-safe'
          }`}
        >
          <div className="flex items-start gap-3">
            {result.survivalScore !== 'Safe' ? (
              <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${result.survivalScore === 'Critical' ? 'text-status-critical' : 'text-status-tight'}`} />
            ) : (
              <TrendingDown className="w-5 h-5 mt-0.5 flex-shrink-0 text-status-safe" />
            )}
            <div>
              <span className="font-label text-foreground block mb-1">What Happens If You Don't Act</span>
              <p className="text-sm text-muted-foreground">{result.urgencyWarning}</p>
            </div>
          </div>
        </motion.div>

        {/* Cheapest next purchase */}
        <motion.div {...fadeUp} transition={{ delay: 0.5, duration: 0.4 }}
          className="bg-card p-5 rounded-2xl shadow-card mb-4"
        >
          <div className="flex items-start gap-3">
            <ShoppingBag className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-label text-foreground block mb-1">Cheapest Next Purchase</span>
              <p className="text-foreground font-semibold">
                Buy {result.cheapestNextPurchase.name.toLowerCase()} for RM{result.cheapestNextPurchase.estimatedCost.toFixed(2)} to unlock more affordable meal options.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Reasoning */}
        <motion.div {...fadeUp} transition={{ delay: 0.6, duration: 0.4 }} className="bg-card p-5 rounded-2xl shadow-card mb-8">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your pantry already supports a few low-cost meals. One small purchase can extend your plan and reduce the risk of running out before your next allowance.
          </p>
        </motion.div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onViewPlan}
          className="w-full inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-xl text-base font-semibold shadow-elevated transition-all hover:opacity-90"
        >
          View My 3-Day Plan
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default ResultsDashboard;
