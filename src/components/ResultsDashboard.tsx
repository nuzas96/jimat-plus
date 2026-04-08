import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, BarChart3, ChefHat, ChevronLeft, HeartHandshake, Info, Scale, ShoppingBag, TrendingDown, Zap } from 'lucide-react';
import { SurvivalResult, UserInput } from '@/lib/types';

interface ResultsDashboardProps {
  result: SurvivalResult;
  input: UserInput;
  onViewPlan: () => void;
  onBack: () => void;
}

const statusConfig = {
  Safe: { bg: 'bg-status-safe/10', text: 'text-status-safe', border: 'border-status-safe', badge: 'Safe' },
  Tight: { bg: 'bg-status-tight/10', text: 'text-status-tight', border: 'border-status-tight', badge: 'Tight' },
  Critical: { bg: 'bg-status-critical/10', text: 'text-status-critical', border: 'border-status-critical', badge: 'Critical' },
};

const confidenceColors = {
  High: 'text-status-safe',
  Medium: 'text-status-tight',
  Low: 'text-status-critical',
};

function getStatusFromCoverage(coverage: number, targetDays: number): 'Safe' | 'Tight' | 'Critical' {
  if (coverage >= targetDays) {
    return 'Safe';
  }

  if (coverage >= targetDays * 0.7) {
    return 'Tight';
  }

  return 'Critical';
}

const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

const ResultsDashboard = ({ result, input, onViewPlan, onBack }: ResultsDashboardProps) => {
  const config = statusConfig[result.survivalScore];
  const projectedStatus = getStatusFromCoverage(
    result.recommendationExplainer.coverageSummary.after,
    result.recommendationExplainer.coverageSummary.targetDays,
  );
  const projectedConfig = statusConfig[projectedStatus];
  const hasActionablePurchase = result.cheapestNextPurchase.estimatedCost > 0;
  const explanationText = result.survivalScore === 'Safe'
    ? `Your current pantry and remaining RM${input.budget.toFixed(2)} budget can cover the next ${input.daysLeft} days with a comfortable margin.`
    : result.survivalScore === 'Critical'
      ? `Your current pantry and remaining RM${input.budget.toFixed(2)} budget are not enough to cover the next ${input.daysLeft} days reliably.`
      : `Your current pantry and remaining RM${input.budget.toFixed(2)} budget can almost cover the next ${input.daysLeft} days, but the plan is still fragile.`;

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-10 gradient-surface">
      <div className="max-w-lg w-full">
        <motion.button
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8 hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />Back to input
        </motion.button>

        <motion.div {...fadeUp} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
          <h2 className="font-display text-2xl sm:text-3xl text-foreground mb-1">Your JiMAT+ Results</h2>
          <p className="text-sm text-muted-foreground mb-6">A clear next-step decision before the gap becomes critical.</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-card rounded-3xl shadow-elevated border border-border/50 p-6 mb-4 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex items-center gap-6">
            <div className={`w-28 h-28 rounded-2xl ${config.bg} border-2 ${config.border} flex flex-col items-center justify-center flex-shrink-0`}>
              <div className="font-mono text-4xl font-bold text-foreground leading-none">{result.daysCoveredDisplay}</div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mt-1">days</span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-label text-muted-foreground block mb-1.5">Estimated Days Covered</span>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg ${config.bg} ${config.text} text-xs font-bold uppercase tracking-wide`}>
                {config.badge}
              </div>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{explanationText}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ delay: 0.16, duration: 0.4 }}
          className="bg-card p-4 rounded-2xl shadow-card border border-border/50 mb-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Info className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">How this works</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                JiMAT+ scores your current position from pantry coverage, simple serving assumptions, and what your remaining budget can still support.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp} transition={{ delay: 0.18, duration: 0.4 }} className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-card p-4 rounded-2xl shadow-card border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="font-label text-muted-foreground">Score</span>
            </div>
            <span className={`text-base font-bold ${config.text}`}>{result.survivalScore}</span>
          </div>
          <div className="bg-card p-4 rounded-2xl shadow-card border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="font-label text-muted-foreground">Confidence</span>
            </div>
            <span className={`text-base font-bold ${confidenceColors[result.confidenceLevel]}`}>{result.confidenceLevel}</span>
          </div>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ delay: 0.22, duration: 0.4 }}
          className={`p-4 rounded-2xl mb-4 border ${
            result.survivalScore === 'Critical' ? 'bg-status-critical/5 border-status-critical/20' :
            result.survivalScore === 'Tight' ? 'bg-status-tight/5 border-status-tight/20' :
            'bg-status-safe/5 border-status-safe/20'
          }`}
        >
          <div className="flex items-start gap-3">
            {result.survivalScore !== 'Safe' ? (
              <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${result.survivalScore === 'Critical' ? 'text-status-critical' : 'text-status-tight'}`} />
            ) : (
              <TrendingDown className="w-4 h-4 mt-0.5 flex-shrink-0 text-status-safe" />
            )}
            <div>
              <span className="text-xs font-semibold text-foreground block mb-1">What If You Don&apos;t Act</span>
              <p className="text-xs text-muted-foreground leading-relaxed">{result.urgencyWarning}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ delay: 0.28, duration: 0.4 }}
          className="bg-card p-5 rounded-2xl shadow-elevated border border-primary/15 mb-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl gradient-warm flex items-center justify-center flex-shrink-0 shadow-sm">
              <ShoppingBag className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <span className="font-label text-primary block mb-1">
                {result.cheapestNextPurchase.estimatedCost > 0 ? 'Best Next Purchase' : 'Best Next Step'}
              </span>
              <p className="text-foreground font-semibold text-sm">
                {result.cheapestNextPurchase.estimatedCost > 0
                  ? `Buy ${result.cheapestNextPurchase.name.toLowerCase()} for RM${result.cheapestNextPurchase.estimatedCost.toFixed(2)} to unlock more affordable meal options.`
                  : 'Do not spend your remaining budget yet. Stretch what you have first and seek support if the gap becomes unsafe.'}
              </p>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{result.cheapestNextPurchase.reason}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ delay: 0.34, duration: 0.4 }}
          className="bg-card p-5 rounded-2xl shadow-card border border-border/50 mb-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Scale className="w-4 h-4 text-primary" />
            <span className="font-label text-foreground">Why This Recommendation Holds Up</span>
          </div>
          <div className="grid gap-3">
            <div className="rounded-xl bg-muted/40 p-3">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Pantry meals detected</p>
              <p className="mt-1 text-sm text-foreground">
                {result.recommendationExplainer.pantryMealCount > 0
                  ? `${result.recommendationExplainer.pantryMealCount} pantry-supported meal options were detected before any purchase.`
                  : 'No full pantry-supported meals were detected yet, so the engine looked for the cheapest stabilizing action.'}
              </p>
            </div>
            <div className="rounded-xl bg-muted/40 p-3">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Key missing ingredient</p>
              <p className="mt-1 text-sm text-foreground">
                Missing ingredient with the strongest low-cost impact: <span className="font-semibold capitalize">{result.recommendationExplainer.selectedMissingIngredient ?? 'none'}</span>.
              </p>
            </div>
            <div className="rounded-xl bg-primary/8 p-3 border border-primary/15">
              <p className="text-[11px] uppercase tracking-wider text-primary">Coverage improvement</p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {result.recommendationExplainer.coverageSummary.label}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {result.recommendationExplainer.purchaseRationale}
              </p>
            </div>
          </div>
          {result.recommendationExplainer.whyAlternativesLost.length > 0 && (
            <div className="mt-3 space-y-2">
              {result.recommendationExplainer.whyAlternativesLost.map(reason => (
                <p key={reason} className="text-xs text-muted-foreground leading-relaxed">
                  {reason}
                </p>
              ))}
            </div>
          )}
        </motion.div>

        {hasActionablePurchase && (
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.37, duration: 0.4 }}
            className="bg-card p-5 rounded-2xl shadow-card border border-border/50 mb-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-primary" />
              <span className="font-label text-foreground">Current Plan vs After This Purchase</span>
            </div>
            <div className="grid grid-cols-[1.2fr_1fr_1fr] gap-3 text-sm">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Decision check</div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold text-center">Current</div>
              <div className="text-[11px] uppercase tracking-wider text-primary font-semibold text-center">After buying {result.cheapestNextPurchase.name.toLowerCase()}</div>

              <div className="rounded-xl bg-muted/30 px-3 py-2 font-medium text-foreground">Days covered</div>
              <div className="rounded-xl bg-muted/30 px-3 py-2 text-center font-mono font-semibold text-foreground">
                {result.recommendationExplainer.coverageSummary.beforeDisplay}
              </div>
              <div className="rounded-xl bg-primary/8 px-3 py-2 text-center font-mono font-semibold text-primary">
                {result.recommendationExplainer.coverageSummary.afterDisplay}
              </div>

              <div className="rounded-xl bg-muted/30 px-3 py-2 font-medium text-foreground">Survival status</div>
              <div className={`rounded-xl px-3 py-2 text-center font-semibold ${config.bg} ${config.text}`}>
                {result.survivalScore}
              </div>
              <div className={`rounded-xl px-3 py-2 text-center font-semibold ${projectedConfig.bg} ${projectedConfig.text}`}>
                {projectedStatus}
              </div>

              <div className="rounded-xl bg-muted/30 px-3 py-2 font-medium text-foreground">Budget after action</div>
              <div className="rounded-xl bg-muted/30 px-3 py-2 text-center font-mono font-semibold text-foreground">
                RM{input.budget.toFixed(2)}
              </div>
              <div className="rounded-xl bg-primary/8 px-3 py-2 text-center font-mono font-semibold text-primary">
                RM{result.budgetAfterShopping.toFixed(2)}
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          {...fadeUp}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="bg-card p-5 rounded-2xl shadow-card border border-border/50 mb-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <ChefHat className="w-4 h-4 text-status-safe" />
            <span className="font-label text-foreground">Meals From Your Pantry</span>
          </div>
          {result.recommendationExplainer.pantryMealNames.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {result.recommendationExplainer.pantryMealNames.map(mealName => (
                <span key={mealName} className="rounded-xl bg-status-safe/8 border border-status-safe/15 px-3 py-1.5 text-xs font-medium text-status-safe-foreground">
                  {mealName}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">No full pantry meals yet - one purchase can change that.</p>
          )}
        </motion.div>

        {result.recommendationExplainer.comparisonItems.length > 1 && (
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.45, duration: 0.4 }}
            className="bg-card p-5 rounded-2xl shadow-card border border-border/50 mb-8"
          >
            <span className="font-label text-foreground block mb-3">Other Options Considered</span>
            <div className="space-y-2">
              {result.recommendationExplainer.comparisonItems.map(option => (
                <div
                  key={option.name}
                  className={`rounded-xl p-3 border ${
                    option.verdict === 'selected'
                      ? 'border-primary/20 bg-primary/5'
                      : 'border-border/50 bg-muted/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${option.verdict === 'selected' ? 'font-semibold text-foreground' : 'font-medium text-muted-foreground'}`}>
                      {option.name}
                      {option.verdict === 'selected' && <span className="ml-1.5 text-[10px] text-primary font-bold uppercase">Best</span>}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">RM{option.estimatedCost.toFixed(2)}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {option.mealsUnlocked} meal{option.mealsUnlocked === 1 ? '' : 's'} | {option.coverageAfterPurchaseDisplay} days
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {result.supportRecommendations.length > 0 && (
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.48, duration: 0.4 }}
            className="bg-card p-5 rounded-2xl shadow-card border border-status-critical/20 mb-8"
          >
            <div className="flex items-center gap-2 mb-3">
              <HeartHandshake className="w-4 h-4 text-status-critical" />
              <span className="font-label text-foreground">Support Options</span>
            </div>
            <div className="space-y-3">
              {result.supportRecommendations.map(resource => (
                <div key={resource.id} className="rounded-xl border border-status-critical/15 bg-status-critical/5 p-3">
                  <p className="text-sm font-semibold text-foreground">{resource.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{resource.actionText}</p>
                  {resource.contactInfo && <p className="mt-2 text-[11px] text-muted-foreground/80">{resource.contactInfo}</p>}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          whileHover={{ scale: 1.01, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={onViewPlan}
          className="w-full inline-flex items-center justify-center gap-3 gradient-warm text-primary-foreground px-8 py-4 rounded-2xl text-base font-semibold shadow-glow transition-all"
        >
          View My Survival Plan
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default ResultsDashboard;
