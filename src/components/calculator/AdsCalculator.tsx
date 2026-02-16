import React from 'react';
import { useCalculator } from '@/hooks/useCalculator';
import { parseUrlInputs, useSyncUrlState } from '@/hooks/useUrlState';
import { InputPanel } from './InputPanel';
import { FinancialHealthSection } from './FinancialHealthSection';
import { ForecastSection } from './ForecastSection';
import { GrowthChart } from './GrowthChart';
import { AcquisitionChurnChart } from './AcquisitionChurnChart';
import { FinancialTable } from './FinancialTable';
import { RetentionHeatmap } from './RetentionHeatmap';
import { CtaSection } from './CtaSection';

export default function AdsCalculator() {
  const [urlInputs] = React.useState(() => parseUrlInputs());
  const calculator = useCalculator(urlInputs);
  useSyncUrlState(calculator.inputs);

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-[1400px] mx-auto px-4 py-8">
      {/* Left sidebar - sticky on desktop */}
      <aside className="lg:w-[320px] lg:flex-shrink-0 lg:sticky lg:top-20 lg:self-start">
        <InputPanel inputs={calculator.inputs} onChange={calculator.updateInput} />
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 space-y-6">
        <FinancialHealthSection
          economics={calculator.unitEconomics}
          breakEvenMonth={calculator.breakEvenMonth}
        />
        <ForecastSection summary={calculator.forecastSummary} />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <GrowthChart data={calculator.monthlyData} />
          <AcquisitionChurnChart data={calculator.monthlyData} />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <FinancialTable data={calculator.monthlyData} />
          <RetentionHeatmap
            cohorts={calculator.cohorts}
            churnRate={calculator.inputs.churnRate}
          />
        </div>
        <CtaSection />
      </main>
    </div>
  );
}
