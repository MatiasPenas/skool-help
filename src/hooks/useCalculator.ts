import { useState, useMemo } from 'react';
import {
  type CalculatorInputs,
  computeUnitEconomics,
  computeMonthlyForecast,
  computeCohorts,
  computeForecastSummary,
} from '@/lib/calculator-engine';

const DEFAULT_INPUTS: CalculatorInputs = {
  monthlyPrice: 99,
  cac: 120,
  churnRate: 0.20,
  initialBudget: 1000,
  reinvestmentPct: 1.0,
};

export function useCalculator(initialInputs?: Partial<CalculatorInputs>) {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    ...DEFAULT_INPUTS,
    ...initialInputs,
  });

  const unitEconomics = useMemo(() => computeUnitEconomics(inputs), [inputs]);
  const monthlyData = useMemo(() => computeMonthlyForecast(inputs, 12), [inputs]);
  const cohorts = useMemo(() => computeCohorts(inputs, monthlyData, 12), [inputs, monthlyData]);
  const forecastSummary = useMemo(() => computeForecastSummary(monthlyData), [monthlyData]);

  const breakEvenMonth = useMemo(() => {
    const idx = monthlyData.findIndex((d) => d.cumulativeProfit >= 0);
    return idx >= 0 ? idx + 1 : null;
  }, [monthlyData]);

  const updateInput = <K extends keyof CalculatorInputs>(
    key: K,
    value: CalculatorInputs[K]
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
