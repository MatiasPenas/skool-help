import { useEffect } from 'react';
import type { FreemiumInputs } from '@/lib/freemium-engine';

const PARAM_MAP: Record<keyof FreemiumInputs, string> = {
  monthlyPrice: 'price',
  cac: 'cac',
  conversionRate: 'conv',
  churnRate: 'churn',
  initialBudget: 'budget',
  reinvestmentPct: 'reinvest',
  cacGrowthRate: 'cacgrowth',
};

export function parseFreemiumUrlInputs(): Partial<FreemiumInputs> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const result: Partial<FreemiumInputs> = {};
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

export function useSyncFreemiumUrlState(inputs: FreemiumInputs) {
  useEffect(() => {
    const params = new URLSearchParams();
    for (const [key, param] of Object.entries(PARAM_MAP)) {
      params.set(param, String((inputs as Record<string, number>)[key]));
    }
    const url = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', url);
  }, [inputs]);
}
