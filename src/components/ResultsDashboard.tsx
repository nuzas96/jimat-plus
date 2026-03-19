import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, ChefHat, ChevronLeft, Info, Scale, ShoppingBag, TrendingDown, Zap } from 'lucide-react';
import { SurvivalResult, UserInput } from '@/lib/types';

interface ResultsDashboardProps {
  result: SurvivalResult;
  input: UserInput;
  onViewPlan: () => void;
  onBack: () => void;
}

const statusConfig = {
  Safe: { bg: 'bg-status-safe/[0.08]', text: 'text-status-safe-foreground', border: 'border-status-safe/20', glow: 'shadow-[0_0_30px_-8px_hsl(155_55%_35%/0.15)]', badge: 'Safe', color: 'text-status-safe' },
  Tight: { bg: 'bg-status-tight/[0.08]', text: 'text-status-tight-foreground', border: 'border-status-tight/20', glow: 'shadow-[0_0_30px_-8px_hsl(32_75%_45%/0.15)]', badge: 'Tight', color: 'text-status-tight' },
  Critical: { bg: 'bg-status-critical/[0.08]', text: 'text-status-critical-foreground', border: 'border-status-critical/20', glow: 'shadow-[0_0_30px_-8px_hsl(0_65%_48%/0.15)]', badge: 'Critical', color: 'text-status-critical' },
};

const confidenceColors = {
  High: 'text-status-safe-foreground',
  Medium: 'text-status-tight-foreground',
  Low: 'text-status-critical-foreground',
};

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
};

const ResultsDashboard = ({ result, input, onViewPlan, onBack }: ResultsDashboardProps) => {
  const config = statusConfig[result.survivalScore];
  const explanationText = result.survivalScore === 'Safe'
    ? `Your current pantry and remaining RM${input.budget.toFixed(2)} budget can cover the next ${input.daysLeft} days with a comfortable margin.`
    : result.survivalScore === 'Critical'
      ? `Your current pantry and remaining RM${input.budget.toFixed(2)} budget are not enough to cover the next ${input.daysLeft} days reliably.`
      : `Your current pantry and remaining RM${input.budget.toFixed(2)} budget can almost cover the next ${input.daysLeft} days, but the plan is still fragile.`;

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-10 gradient-surface relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/[0.03] rounded-full blur-3xl" />

      <div className="max-w-lg w-full relative z-10">
        <motion.button
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8 hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />Back to input
        </motion.button>

        <motion.div {...fadeUp} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
          <p className="font-label text-primary mb-2">JiMAT+ Results</p>
          <h2 className="font-display text-3xl sm:text-4xl text-foreground mb-6">Your Verdict</h2>
        </motion.div>

        {/* Hero verdict */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className={`relative bg-card rounded-3xl shadow-elevated border ${config.border} p-6 mb-4 overflow-hidden ${config.glow}`}
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/[0.03] rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="relative flex items-center gap-6">
            <div className={`w-28 h-28 rounded-2xl ${config.bg} border ${config.border} flex flex-col items-center justify-center flex-shrink-0`}>
              <div className="font-mono text-4xl font-bold text-foreground animate-count-up">{result.daysCoveredDisplay}</div>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-display mt-1">days</span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-label text-muted-foreground block mb-2">Estimated Days Covered</span>
              <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg ${config.bg} border ${config.border} text-xs font-bold uppercase tracking-wider ${config.color}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${result.survivalScore === 'Safe' ? 'bg-status-safe' : result.survivalScore === 'Tight' ? 'bg-status-tight' : 'bg-status-critical'}`} />
                {config.badge}
              </div>
              <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{explanationText}</p>
            </div>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.16, duration: 0.4 }}
          className="bg-card/70 p-4 rounded-2xl border border-border mb-4"
        >
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Survival estimate based on pantry items, rough serving assumptions, and remaining budget. Adding quantities like `3 eggs` improves accuracy.
            </p>
          </div>
        </motion.div>

        {/* Score + Confidence */}
        <motion.div {...fadeUp} transition={{ delay: 0.2, duration: 0.4 }} className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-card p-4 rounded-2xl shadow-card border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="font-label text-muted-foreground">Score</span>
            </div>
            <span className={`text-lg font-bold font-display ${config.color}`}>{result.survivalScore}</span>
          </div>
          <div className="bg-card p-4 rounded-2xl shadow-card border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="font-label text-muted-foreground">Confidence</span>
            </div>
            <span className={`text-lg font-bold font-display ${confidenceColors[result.confidenceLevel]}`}>{result.confidenceLevel}</span>
          </div>
        </motion.div>

        {/* Urgency warning */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.25, duration: 0.4 }}
          className={`p-4 rounded-2xl mb-4 border ${
            result.survivalScore === 'Critical' ? 'bg-status-critical/[0.04] border-status-critical/15' :
            result.survivalScore === 'Tight' ? 'bg-status-tight/[0.04] border-status-tight/15' :
            'bg-status-safe/[0.04] border-status-safe/15'
          }`}
        >
          <div className="flex items-start gap-3">
            {result.survivalScore !== 'Safe' ? (
              <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${result.survivalScore === 'Critical' ? 'text-status-critical' : 'text-status-tight'}`} />
            ) : (
              <TrendingDown className="w-4 h-4 mt-0.5 flex-shrink-0 text-status-safe" />
            )}
            <div>
              <span className="text-xs font-bold text-foreground block mb-1 font-display uppercase tracking-wide">What If You Don&apos;t Act</span>
              <p className="text-xs text-muted-foreground leading-relaxed">{result.urgencyWarning}</p>
            </div>
          </div>
        </motion.div>

        {/* Best next purchase */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="bg-card p-5 rounded-2xl shadow-elevated border-glow mb-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl gradient-warm flex items-center justify-center flex-shrink-0 shadow-glow">
              <ShoppingBag className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <span className="font-label text-primary block mb-1">
                {result.cheapestNextPurchase.estimatedCost > 0 ? 'Best Next Purchase' : 'Best Next Step'}
              </span>
              <p className="text-foreground font-bold text-base font-display">
                {result.cheapestNextPurchase.estimatedCost > 0
                  ? `Buy ${result.cheapestNextPurchase.name.toLowerCase()} for RM${result.cheapestNextPurchase.estimatedCost.toFixed(2)} to unlock more affordable meal options.`
                  : 'Do not spend your remaining budget yet. Stretch what you have first and seek support if the gap becomes unsafe.'}
              </p>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{result.cheapestNextPurchase.reason}</p>
            </div>
          </div>
        </motion.div>

        {/* Coverage impact */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="bg-card p-5 rounded-2xl shadow-card border border-border mb-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Scale className="w-4 h-4 text-primary" />
            <span className="font-label text-foreground">Coverage Impact</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">
            {result.recommendationExplainer.purchaseRationale}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-secondary p-4 text-center border border-border">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-display block mb-1">Before</span>
              <p className="font-mono text-2xl font-bold text-foreground">
                {result.recommendationExplainer.coverageSummary.beforeDisplay}
              </p>
              <span className="text-[10px] text-muted-foreground/50">days</span>
            </div>
            <div className="rounded-xl bg-primary/[0.06] p-4 text-center border-glow">
              <span className="text-[10px] uppercase tracking-widest text-primary font-display block mb-1">After</span>
              <p className="font-mono text-2xl font-bold text-primary">
                {result.recommendationExplainer.coverageSummary.afterDisplay}
              </p>
              <span className="text-[10px] text-muted-foreground/50">days</span>
            </div>
          </div>
        </motion.div>

        {/* Pantry meals */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="bg-card p-5 rounded-2xl shadow-card border border-border mb-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <ChefHat className="w-4 h-4 text-status-safe" />
            <span className="font-label text-foreground">Meals From Your Pantry</span>
          </div>
          {result.recommendationExplainer.pantryMealNames.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {result.recommendationExplainer.pantryMealNames.map(mealName => (
                <span key={mealName} className="rounded-xl bg-status-safe/[0.06] border border-status-safe/15 px-3 py-1.5 text-xs font-medium text-status-safe-foreground">
                  {mealName}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground/50 italic">No full pantry meals yet — one purchase can change that.</p>
          )}
        </motion.div>

        {/* Comparison */}
        {result.recommendationExplainer.comparisonItems.length > 1 && (
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.45, duration: 0.4 }}
            className="bg-card p-5 rounded-2xl shadow-card border border-border mb-8"
          >
            <span className="font-label text-foreground block mb-3">Other Options Considered</span>
            <div className="space-y-2">
              {result.recommendationExplainer.comparisonItems.map(option => (
                <div
                  key={option.name}
                  className={`rounded-xl p-3 border ${
                    option.verdict === 'selected'
                      ? 'border-primary/20 bg-primary/[0.04]'
                      : 'border-border bg-secondary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-display ${option.verdict === 'selected' ? 'font-bold text-foreground' : 'font-medium text-muted-foreground'}`}>
                      {option.name}
                      {option.verdict === 'selected' && <span className="ml-2 text-[10px] text-primary font-bold uppercase tracking-wider">Best</span>}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">RM{option.estimatedCost.toFixed(2)}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {option.mealsUnlocked} meal{option.mealsUnlocked === 1 ? '' : 's'} · {option.coverageAfterPurchaseDisplay} days
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onViewPlan}
          className="w-full inline-flex items-center justify-center gap-3 gradient-warm text-primary-foreground px-8 py-4 rounded-2xl text-base font-bold shadow-glow transition-all font-display"
        >
          View My Survival Plan
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default ResultsDashboard;
