import React from 'react';
import { useCalculator } from '@/hooks/useCalculator';
import { parseUrlInputs, useSyncUrlState } from '@/hooks/useUrlState';
import { InputPanel } from './InputPanel';
import { FinancialHealthSection } from './FinancialHealthSection';
import { ForecastSection } from './ForecastSection';
import { GrowthChart } from './GrowthChart';
import { AcquisitionChurnChart } from './AcquisitionChurnChart';
import { CumulativeProfitChart } from './CumulativeProfitChart';
import { FinancialTable } from './FinancialTable';
import { RetentionHeatmap } from './RetentionHeatmap';
// import { CtaSection } from './CtaSection';
import { ChevronLeft } from 'lucide-react';

export default function AdsCalculator() {
  const [urlInputs] = React.useState(() => parseUrlInputs());
  const calculator = useCalculator(urlInputs);
  useSyncUrlState(calculator.inputs);

  return (
    <div className="max-w-[1400px] mx-auto px-4 pt-6">
      {/* <a href="/tools" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
        <ChevronLeft className="w-4 h-4" />
        Tools
      </a> */}
    <div className="flex flex-col lg:flex-row gap-6 pb-8">
      {/* Left sidebar - sticky on desktop */}
      <aside className="lg:w-[320px] lg:flex-shrink-0 lg:sticky lg:top-20 lg:self-start">
        <InputPanel
          inputs={calculator.inputs}
          onChange={calculator.updateInput}
          onPreset={calculator.setInputs}
        />
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 space-y-6">
        <FinancialHealthSection economics={calculator.unitEconomics} />
        <ForecastSection summary={calculator.forecastSummary} />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <GrowthChart data={calculator.monthlyData} />
          <AcquisitionChurnChart data={calculator.monthlyData} />
        </div>
        <CumulativeProfitChart
          data={calculator.monthlyData}
          breakEvenMonth={calculator.breakEvenMonth}
        />
        <FinancialTable data={calculator.monthlyData} />
        <RetentionHeatmap
          cohorts={calculator.cohorts}
          churnRate={calculator.inputs.churnRate}
        />
        {/* <CtaSection /> */}
        <p className="text-xs text-muted-foreground pb-2">
          Note: The projections assume fixed unit economics (constant CAC, churn rate, and price). In reality, growth follows an S-curve: CAC increases as ad audiences saturate, addressable markets are finite, and at scale, churn losses approach acquisition volume. The model is most accurate in the early months before these forces take effect.
        </p>
      </main>
    </div>
    </div>
  );
}
