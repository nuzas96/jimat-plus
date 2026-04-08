import { AssessmentLog } from '@/lib/types';

const STORAGE_KEY = 'jimat-plus-assessment-logs';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function readAssessmentLogs(): AssessmentLog[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function appendAssessmentLog(entry: AssessmentLog): void {
  if (!isBrowser()) {
    return;
  }

  const previous = readAssessmentLogs();
  const next = [entry, ...previous].slice(0, 50);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function buildAssessmentSummary(logs: AssessmentLog[]) {
  const scoreCounts = logs.reduce<Record<string, number>>((accumulator, log) => {
    accumulator[log.survivalScore] = (accumulator[log.survivalScore] ?? 0) + 1;
    return accumulator;
  }, {});

  const recommendationCounts = logs.reduce<Record<string, number>>((accumulator, log) => {
    accumulator[log.recommendationName] = (accumulator[log.recommendationName] ?? 0) + 1;
    return accumulator;
  }, {});

  const contextCounts = logs.reduce<Record<string, number>>((accumulator, log) => {
    accumulator[log.pricingContext] = (accumulator[log.pricingContext] ?? 0) + 1;
    return accumulator;
  }, {});

  const topRecommendation = Object.entries(recommendationCounts).sort((left, right) => right[1] - left[1])[0];
  const topContext = Object.entries(contextCounts).sort((left, right) => right[1] - left[1])[0];

  return {
    totalAssessments: logs.length,
    scoreCounts,
    recommendationCounts,
    contextCounts,
    topRecommendation: topRecommendation ? { name: topRecommendation[0], count: topRecommendation[1] } : null,
    topContext: topContext ? { name: topContext[0], count: topContext[1] } : null,
  };
}
