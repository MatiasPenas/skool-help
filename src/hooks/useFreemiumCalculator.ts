import { useState, useMemo } from 'react';
import {
  type FreemiumInputs,
  computeFreemiumUnitEconomics,
  computeFreemiumMonthlyForecast,
  computeFreemiumCohorts,
  computeFreemiumForecastSummary,
} from '@/lib/freemium-engine';

const DEFAULT_INPUTS: FreemiumInputs = {
  monthlyPrice: 99,
  cac: 10,
  conversionRate: 0.05,
  churnRate: 0.10,
  initialBudget: 1000,
  reinvestmentPct: 1.0,
  cacGrowthRate: 0.05,
};

export function useFreemiumCalculator(initialInputs?: Partial<FreemiumInputs>) {
  const [inputs, setInputs] = useState<FreemiumInputs>({
    ...DEFAULT_INPUTS,
    ...initialInputs,
  });

  const unitEconomics = useMemo(() => computeFreemiumUnitEconomics(inputs), [inputs]);
  const monthlyData = useMemo(() => computeFreemiumMonthlyForecast(inputs, 12), [inputs]);
  const cohorts = useMemo(() => computeFreemiumCohorts(inputs, monthlyData, 12), [inputs, monthlyData]);
  const forecastSummary = useMemo(() => computeFreemiumForecastSummary(monthlyData), [monthlyData]);

  const breakEvenMonth = useMemo(() => {
    const idx = monthlyData.findIndex((d) => d.cumulativeProfit >= 0);
    return idx >= 0 ? idx + 1 : null;
  }, [monthlyData]);

  const updateInput = <K extends keyof FreemiumInputs>(
    key: K,
    value: FreemiumInputs[K]
  ) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  return {
    inputs,
    updateInput,
    setInputs,
    unitEconomics,
    monthlyData,
    cohorts,
    forecastSummary,
    breakEvenMonth,
  };
}
