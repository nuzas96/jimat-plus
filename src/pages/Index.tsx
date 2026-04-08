import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import LandingPage from '@/components/LandingPage';
import InputFlow from '@/components/InputFlow';
import CalculatingScreen from '@/components/CalculatingScreen';
import ResultsDashboard from '@/components/ResultsDashboard';
import SurvivalPlan from '@/components/SurvivalPlan';
import ShoppingSummary from '@/components/ShoppingSummary';
import { UserInput, SurvivalResult } from '@/lib/types';
import { calculateSurvival } from '@/lib/survival-engine';
import { getFinalsCatalog } from '@/lib/data-api';
import { appendAssessmentLog } from '@/lib/assessment-log';

type Screen = 'landing' | 'input' | 'calculating' | 'results' | 'plan' | 'shopping';

const Index = () => {
  const [screen, setScreen] = useState<Screen>('landing');
  const [input, setInput] = useState<UserInput | null>(null);
  const [result, setResult] = useState<SurvivalResult | null>(null);
  const { data: catalog } = useQuery({
    queryKey: ['finals-catalog'],
    queryFn: getFinalsCatalog,
  });

  const handleSubmit = useCallback((userInput: UserInput) => {
    if (!catalog) {
      return;
    }

    setInput(userInput);
    setScreen('calculating');
    const survivalResult = calculateSurvival(userInput, catalog);
    setResult(survivalResult);
    appendAssessmentLog({
      timestamp: new Date().toISOString(),
      pricingContext: survivalResult.selectedPricingContext.label,
      budget: userInput.budget,
      daysLeft: userInput.daysLeft,
      pantryItemCount: survivalResult.analytics.pantryItemCount,
      survivalScore: survivalResult.survivalScore,
      recommendationName: survivalResult.cheapestNextPurchase.name,
      coverageBefore: survivalResult.daysCovered,
      coverageAfter: survivalResult.recommendationExplainer.coverageSummary.after,
    });
  }, [catalog]);

  const handleCalcComplete = useCallback(() => {
    setScreen('results');
  }, []);

  const restart = useCallback(() => {
    setScreen('landing');
    setInput(null);
    setResult(null);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {screen === 'landing' && <LandingPage onStart={() => setScreen('input')} />}
      {screen === 'input' && <InputFlow onSubmit={handleSubmit} onBack={() => setScreen('landing')} />}
      {screen === 'calculating' && <CalculatingScreen onComplete={handleCalcComplete} />}
      {screen === 'results' && result && input && (
        <ResultsDashboard result={result} input={input} onViewPlan={() => setScreen('plan')} onBack={() => setScreen('input')} />
      )}
      {screen === 'plan' && result && (
        <SurvivalPlan result={result} onViewShopping={() => setScreen('shopping')} onBack={() => setScreen('results')} />
      )}
      {screen === 'shopping' && result && input && (
        <ShoppingSummary result={result} input={input} onRestart={restart} onBack={() => setScreen('plan')} />
      )}
    </AnimatePresence>
  );
};

export default Index;
