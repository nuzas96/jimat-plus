import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, ChevronLeft, ShoppingBag, TrendingUp } from 'lucide-react';
import { SurvivalResult, UserInput } from '@/lib/types';

interface ResultsDashboardProps {
  result: SurvivalResult;
  input: UserInput;
  onViewPlan: () => void;
  onBack: () => void;
}

const statusConfig = {
  Safe: { accent: 'text-status-safe', border: 'border-status-safe/30', bg: 'bg-status-safe/10', label: 'SAFE' },
  Tight: { accent: 'text-status-tight', border: 'border-status-tight/30', bg: 'bg-status-tight/10', label: 'TIGHT' },
  Critical: { accent: 'text-status-critical', border: 'border-status-critical/30', bg: 'bg-status-critical/10', label: 'CRITICAL' },
};

const confidenceColors = {
  High: 'text-status-safe',
  Medium: 'text-status-tight',
  Low: 'text-status-critical',
};

const ResultsDashboard = ({ result, input, onViewPlan, onBack }: ResultsDashboardProps) => {
  const config = statusConfig[result.survivalScore];
  const explanationText = result.survivalScore === 'Safe'
    ? `Your pantry and RM${input.budget.toFixed(2)} budget can cover the next ${input.daysLeft} days with margin.`
    : result.survivalScore === 'Critical'
      ? `Your pantry and RM${input.budget.toFixed(2)} budget are not enough to reliably cover the next ${input.daysLeft} days.`
      : `Your pantry and RM${input.budget.toFixed(2)} budget can almost cover the next ${input.daysLeft} days, but the plan is fragile.`;

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-10 gradient-surface">
      <div className="max-w-lg w-full">
        <motion.button
          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8 hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />Back
        </motion.button>

        {/* Section label */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <span className="font-mono text-xs text-primary tracking-[0.2em] uppercase block mb-2">Results</span>
        </motion.div>

        {/* VERDICT HERO — the dominant moment */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="gradient-verdict rounded-2xl border border-border p-8 mb-4 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <p className="font-label text-muted-foreground mb-3">Estimated Days Covered</p>
            <div className="flex items-end gap-3 mb-4">
              <span className="font-mono text-6xl sm:text-7xl font-bold text-foreground leading-none">
                {result.daysCoveredDisplay}
              </span>
              <span className="text-lg text-muted-foreground font-medium mb-2">days</span>
            </div>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md ${config.bg} ${config.border} border`}>
              <span className={`font-mono text-xs font-bold tracking-wider ${config.accent}`}>{config.label}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed max-w-sm">{explanationText}</p>
          </div>
        </motion.div>

        {/* Score + Confidence row */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3 mb-4"
        >
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="font-label text-muted-foreground mb-2">Survival Score</p>
            <span className={`text-lg font-bold ${config.accent}`}>{result.survivalScore}</span>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="font-label text-muted-foreground mb-2">Confidence</p>
            <span className={`text-lg font-bold ${confidenceColors[result.confidenceLevel]}`}>{result.confidenceLevel}</span>
          </div>
        </motion.div>

        {/* Urgency warning */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className={`p-4 rounded-xl border mb-4 ${
            result.survivalScore === 'Critical' ? 'bg-status-critical/5 border-status-critical/20' :
            result.survivalScore === 'Tight' ? 'bg-status-tight/5 border-status-tight/20' :
            'bg-status-safe/5 border-status-safe/20'
          }`}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
              result.survivalScore === 'Critical' ? 'text-status-critical' :
              result.survivalScore === 'Tight' ? 'text-status-tight' : 'text-status-safe'
            }`} />
            <div>
              <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">What If You Don't Act</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{result.urgencyWarning}</p>
            </div>
          </div>
        </motion.div>

        {/* Best Next Purchase */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-card rounded-xl border-2 border-primary/20 p-5 mb-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg gradient-warm flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-label text-primary mb-1">
                {result.cheapestNextPurchase.estimatedCost > 0 ? 'Best Next Purchase' : 'Best Next Step'}
              </p>
              <p className="text-foreground font-semibold text-base">
                {result.cheapestNextPurchase.estimatedCost > 0
                  ? `Buy ${result.cheapestNextPurchase.name.toLowerCase()} for RM${result.cheapestNextPurchase.estimatedCost.toFixed(2)} to unlock more affordable meal options.`
                  : 'Stretch what you have first and seek support if the gap becomes unsafe.'}
              </p>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{result.cheapestNextPurchase.reason}</p>
            </div>
          </div>
        </motion.div>

        {/* Before → After coverage */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-card rounded-xl border border-border p-5 mb-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <p className="font-label text-foreground">Coverage Impact</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">{result.recommendationExplainer.purchaseRationale}</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-secondary p-4 text-center border border-border">
              <p className="font-label text-muted-foreground mb-1">Before</p>
              <p className="font-mono text-2xl font-bold text-foreground">{result.recommendationExplainer.coverageSummary.beforeDisplay}</p>
              <span className="text-xs text-muted-foreground">days</span>
            </div>
            <div className="rounded-lg bg-primary/8 p-4 text-center border border-primary/15">
              <p className="font-label text-primary mb-1">After</p>
              <p className="font-mono text-2xl font-bold text-primary">{result.recommendationExplainer.coverageSummary.afterDisplay}</p>
              <span className="text-xs text-muted-foreground">days</span>
            </div>
          </div>
        </motion.div>

        {/* Pantry meals */}
        {result.recommendationExplainer.pantryMealNames.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-card rounded-xl border border-border p-5 mb-4"
          >
            <p className="font-label text-foreground mb-3">Meals From Your Pantry</p>
            <div className="flex flex-wrap gap-2">
              {result.recommendationExplainer.pantryMealNames.map(name => (
                <span key={name} className="rounded-md bg-status-safe/10 border border-status-safe/20 px-3 py-1.5 text-xs font-medium text-status-safe-foreground">
                  {name}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Comparison */}
        {result.recommendationExplainer.comparisonItems.length > 1 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="bg-card rounded-xl border border-border p-5 mb-8"
          >
            <p className="font-label text-foreground mb-3">Options Considered</p>
            <div className="space-y-2">
              {result.recommendationExplainer.comparisonItems.map(opt => (
                <div key={opt.name}
                  className={`rounded-lg p-3 border ${
                    opt.verdict === 'selected' ? 'border-primary/25 bg-primary/5' : 'border-border bg-secondary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${opt.verdict === 'selected' ? 'font-bold text-foreground' : 'font-medium text-muted-foreground'}`}>
                      {opt.name}
                      {opt.verdict === 'selected' && <span className="ml-2 text-[10px] text-primary font-bold uppercase">Best</span>}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">RM{opt.estimatedCost.toFixed(2)}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {opt.mealsUnlocked} meal{opt.mealsUnlocked === 1 ? '' : 's'} · {opt.coverageAfterPurchaseDisplay} days
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.01, y: -1 }} whileTap={{ scale: 0.98 }}
          onClick={onViewPlan}
          className="w-full inline-flex items-center justify-center gap-3 gradient-warm text-primary-foreground px-8 py-4 rounded-xl text-base font-semibold shadow-glow transition-all"
        >
          View My Survival Plan
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default ResultsDashboard;
