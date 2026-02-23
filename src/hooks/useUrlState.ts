import { useEffect } from 'react';
import type { CalculatorInputs } from '@/lib/calculator-engine';

const PARAM_MAP: Record<keyof CalculatorInputs, string> = {
  monthlyPrice: 'price',
  cac: 'cac',
  churnRate: 'churn',
  initialBudget: 'budget',
  reinvestmentPct: 'reinvest',
  cacGrowthRate: 'cacgrowth',
};

export function parseUrlInputs(): Partial<CalculatorInputs> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const result: Partial<CalculatorInputs> = {};
  for (const [key, param] of Object.entries(PARAM_MAP)) {
    const val = params.get(param);
    if (val !== null) {
      const num = parseFloat(val);
      if (!isNaN(num)) {
        (result as Record<string, number>)[key] = num;
      }
    }
  }
  return result;
}

export function useSyncUrlState(inputs: CalculatorInputs) {
  useEffect(() => {
    const params = new URLSearchParams();
    for (const [key, param] of Object.entries(PARAM_MAP)) {
      params.set(param, String((inputs as Record<string, number>)[key]));
    }
    const url = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', url);
  }, [inputs]);
}
