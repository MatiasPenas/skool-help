import type { UnitEconomics, CohortData, ForecastSummary } from './calculator-engine';

export interface FreemiumInputs {
  monthlyPrice: number;
  cac: number;           // CPA to acquire a FREE member ($2-5 typical)
  conversionRate: number; // % of free members converting to premium each month (decimal)
  churnRate: number;      // monthly churn for premium members (decimal)
  initialBudget: number;
  reinvestmentPct: number;
  cacGrowthRate?: number; // monthly % CPA increase, decimal: 0.05 = 5%/mo (default 0)
}

export interface FreemiumMonthData {
  month: number;
  // Free tier
  newFreeMembers: number;
  totalFreeMembers: number;
  converted: number;
  // Premium tier
  premiumChurned: number;
  totalPremiumMembers: number;
  // Financial (compatible with MonthData shape)
  newMembers: number;       // = newFreeMembers (acquired from ads)
  churnedMembers: number;   // = premiumChurned
  totalMembers: number;     // = totalPremiumMembers (paying)
  revenue: number;
  adSpend: number;
  profit: number;
  cumulativeProfit: number;
  marginPct: number;
  effectiveCac: number;     // actual CPA used this month
}

export function computeFreemiumUnitEconomics(inputs: FreemiumInputs): UnitEconomics {
  const { monthlyPrice, cac, conversionRate, churnRate } = inputs;
  const effectiveCAC = conversionRate > 0 ? cac / conversionRate : 999999;
  const avgRetentionMonths = churnRate > 0 ? 1 / churnRate : 999;
  const ltv = churnRate > 0 ? monthlyPrice / churnRate : monthlyPrice * 999;
  const ltvCacRatio = effectiveCAC > 0 ? ltv / effectiveCAC : 999;
  const paybackMonths = monthlyPrice > 0 ? effectiveCAC / monthlyPrice : 999;
  return { ltv, ltvCacRatio, paybackMonths, avgRetentionMonths };
}

export function computeFreemiumMonthlyForecast(
  inputs: FreemiumInputs,
  months: number = 12
): FreemiumMonthData[] {
  const { monthlyPrice, cac, conversionRate, churnRate, initialBudget, reinvestmentPct } = inputs;
  const cacGrowthRate = inputs.cacGrowthRate ?? 0;
  const data: FreemiumMonthData[] = [];
  let totalFreeMembers = 0;
  let totalPremiumMembers = 0;
  let cumulativeProfit = 0;
  let budgetRemainder = 0;

  for (let m = 1; m <= months; m++) {
    // 1. Determine ad spend
    let adSpend: number;
    if (m === 1) {
      adSpend = initialBudget;
    } else {
      adSpend = data[m - 2].revenue * reinvestmentPct;
    }

    // 2. Apply CPA growth (audience saturation) and acquire free members
    const effectiveCac = cac * Math.pow(1 + cacGrowthRate, m - 1);
    const totalBudget = adSpend + budgetRemainder;
    const newFreeMembers = effectiveCac > 0 ? Math.floor(totalBudget / effectiveCac) : 0;
    budgetRemainder = effectiveCac > 0 ? totalBudget - newFreeMembers * effectiveCac : 0;

    // 3. Add new free members to pool
    totalFreeMembers += newFreeMembers;

    // 4. Convert free → premium
    const converted = Math.round(totalFreeMembers * conversionRate);
    totalFreeMembers -= converted;

    // 5. Churn premium members (before adding converts)
    const premiumChurned = Math.round(totalPremiumMembers * churnRate);
    totalPremiumMembers = totalPremiumMembers - premiumChurned + converted;

    // 6. Compute financials
    const revenue = totalPremiumMembers * monthlyPrice;
    const profit = revenue - adSpend;
    cumulativeProfit += profit;
    const marginPct = revenue > 0 ? (profit / revenue) * 100 : 0;

    data.push({
      month: m,
      newFreeMembers,
      totalFreeMembers,
      converted,
      premiumChurned,
      totalPremiumMembers,
      newMembers: newFreeMembers,
      churnedMembers: premiumChurned,
      totalMembers: totalPremiumMembers,
      revenue,
      adSpend,
      profit,
      cumulativeProfit,
      marginPct,
      effectiveCac,
    });
  }
  return data;
}

export function computeFreemiumCohorts(
  inputs: FreemiumInputs,
  monthlyData: FreemiumMonthData[],
  months: number = 12
): CohortData[] {
  const { churnRate } = inputs;
  const cohorts: CohortData[] = [];

  for (let m = 0; m < months; m++) {
    const initialSize = monthlyData[m].converted;
    const retained: number[] = [initialSize];
    for (let futureMonth = 1; futureMonth <= months - m - 1; futureMonth++) {
      const prev = retained[futureMonth - 1];
      retained.push(Math.round(prev * (1 - churnRate)));
    }
    cohorts.push({
      cohortMonth: m + 1,
      initialSize,
      retainedByMonth: retained,
    });
  }
  return cohorts;
}

export interface FreemiumForecastSummary extends ForecastSummary {
  totalFreeMembers: number;
}

export function computeFreemiumForecastSummary(monthlyData: FreemiumMonthData[]): FreemiumForecastSummary {
  const last = monthlyData[monthlyData.length - 1];
  return {
    forecastMrr: last.revenue,
    totalMembers: last.totalPremiumMembers,
    totalFreeMembers: last.totalFreeMembers,
    annualRunRate: last.revenue * 12,
    totalProfit12Mo: last.cumulativeProfit,
  };
}
