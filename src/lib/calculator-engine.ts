export interface CalculatorInputs {
  monthlyPrice: number;
  cac: number;
  churnRate: number; // decimal: 0.10 = 10%
  initialBudget: number;
  reinvestmentPct: number; // decimal: 0.0 to 1.0
  cacGrowthRate?: number; // monthly % CAC increase, decimal: 0.05 = 5%/mo (default 0)
}

export interface UnitEconomics {
  ltv: number;
  ltvCacRatio: number;
  paybackMonths: number;
  avgRetentionMonths: number;
}

export interface MonthData {
  month: number;
  newMembers: number;
  churnedMembers: number;
  totalMembers: number;
  revenue: number;
  adSpend: number;
  profit: number;
  cumulativeProfit: number;
  marginPct: number;
  effectiveCac: number; // actual CAC used this month
}

export interface CohortData {
  cohortMonth: number;
  initialSize: number;
  retainedByMonth: number[];
}

export interface ForecastSummary {
  forecastMrr: number;
  totalMembers: number;
  annualRunRate: number;
  totalProfit12Mo: number;
}

export function computeUnitEconomics(inputs: CalculatorInputs): UnitEconomics {
  const { monthlyPrice, cac, churnRate } = inputs;
  const avgRetentionMonths = churnRate > 0 ? 1 / churnRate : 999;
  const ltv = churnRate > 0 ? monthlyPrice / churnRate : monthlyPrice * 999;
  const ltvCacRatio = cac > 0 ? ltv / cac : 999;
  const paybackMonths = monthlyPrice > 0 ? cac / monthlyPrice : 999;
  return { ltv, ltvCacRatio, paybackMonths, avgRetentionMonths };
}

export function computeMonthlyForecast(
  inputs: CalculatorInputs,
  months: number = 12
): MonthData[] {
  const { monthlyPrice, cac, churnRate, initialBudget, reinvestmentPct } = inputs;
  const cacGrowthRate = inputs.cacGrowthRate ?? 0;
  const data: MonthData[] = [];
  let totalMembers = 0;
  let cumulativeProfit = 0;
  let budgetRemainder = 0; // carry fractional member cost

  for (let m = 1; m <= months; m++) {
    // Determine this month's ad budget
    let adSpend: number;
    if (m === 1) {
      adSpend = initialBudget;
    } else {
      const prevRevenue = data[m - 2].revenue;
      adSpend = prevRevenue * reinvestmentPct;
    }

    // Apply CAC growth (audience saturation)
    const effectiveCac = cac * Math.pow(1 + cacGrowthRate, m - 1);

    // Acquire new members (with fractional carry)
    const totalBudget = adSpend + budgetRemainder;
    const newMembers = effectiveCac > 0 ? Math.floor(totalBudget / effectiveCac) : 0;
    budgetRemainder = effectiveCac > 0 ? totalBudget - newMembers * effectiveCac : 0;

    // Churn existing members before adding new ones
    const churnedMembers = Math.round(totalMembers * churnRate);
    totalMembers = totalMembers - churnedMembers + newMembers;

    const revenue = totalMembers * monthlyPrice;
    const profit = revenue - adSpend;
    cumulativeProfit += profit;
    const marginPct = revenue > 0 ? (profit / revenue) * 100 : 0;

    data.push({
      month: m,
      newMembers,
      churnedMembers,
      totalMembers,
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

export function computeCohorts(
  inputs: CalculatorInputs,
  monthlyData: MonthData[],
  months: number = 12
): CohortData[] {
  const { churnRate } = inputs;
  const cohorts: CohortData[] = [];

  for (let m = 0; m < months; m++) {
    const initialSize = monthlyData[m].newMembers;
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

export function computeForecastSummary(monthlyData: MonthData[]): ForecastSummary {
  const last = monthlyData[monthlyData.length - 1];
  return {
    forecastMrr: last.revenue,
    totalMembers: last.totalMembers,
    annualRunRate: last.revenue * 12,
    totalProfit12Mo: last.cumulativeProfit,
  };
}

const OUTPUT_CAP = 10_000_000;

export function formatCurrency(value: number): string {
  if (value > OUTPUT_CAP) return "$10M+";
  if (value < -OUTPUT_CAP) return "-$10M+";
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}K`;
  return `${sign}$${abs.toFixed(0)}`;
}

export function formatNumber(value: number): string {
  if (value > OUTPUT_CAP) return "10M+";
  if (value < -OUTPUT_CAP) return "-10M+";
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(1)}K`;
  return `${sign}${abs.toFixed(0)}`;
}
