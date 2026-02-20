import { useState } from 'react';
import type { CalculatorInputs } from '@/lib/calculator-engine';
import { NumberInput } from './NumberInput';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Share2, ArrowRight } from 'lucide-react';

// CAC is expressed as a multiplier of monthlyPrice; initialBudget and monthlyPrice are never touched.
const SCENARIO_PROFILES: Record<string, { cacMultiplier: number; churnRate: number; reinvestmentPct: number }> = {
  conservative: { cacMultiplier: 1.5, churnRate: 0.25, reinvestmentPct: 0.30 },
  realistic:    { cacMultiplier: 1.2, churnRate: 0.20, reinvestmentPct: 1.0  },
  'the dream':  { cacMultiplier: 0.8, churnRate: 0.08, reinvestmentPct: 1.0  },
};

function applyScenario(key: string, current: CalculatorInputs): CalculatorInputs {
  const profile = SCENARIO_PROFILES[key];
  return {
    ...current,
    cac: Math.round(current.monthlyPrice * profile.cacMultiplier),
    churnRate: profile.churnRate,
    reinvestmentPct: profile.reinvestmentPct,
  };
}

function detectActiveScenario(inputs: CalculatorInputs): string | null {
  for (const [key, profile] of Object.entries(SCENARIO_PROFILES)) {
    const expectedCac = Math.round(inputs.monthlyPrice * profile.cacMultiplier);
    if (
      inputs.cac === expectedCac &&
      inputs.churnRate === profile.churnRate &&
      inputs.reinvestmentPct === profile.reinvestmentPct
    ) {
      return key;
    }
  }
  return null;
}

interface InputPanelProps {
  inputs: CalculatorInputs;
  onChange: <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => void;
  onPreset: (inputs: CalculatorInputs) => void;
}

export function InputPanel({ inputs, onChange, onPreset }: InputPanelProps) {
  const [copied, setCopied] = useState(false);
  const activeScenario = detectActiveScenario(inputs);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-xl border p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Ads Calculator</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Premium Skool Community</p>
          </div>
          <Badge className="bg-accent-purple text-white border-accent-purple">Premium</Badge>
        </div>

        {/* Scenario Presets */}
        <div className="flex gap-1.5 mb-4">
          {(Object.keys(SCENARIO_PROFILES) as Array<keyof typeof SCENARIO_PROFILES>).map((key) => (
            <button
              key={key}
              onClick={() => onPreset(applyScenario(key, inputs))}
              className={[
                'flex-1 rounded-md px-2 py-1 text-[10px] font-medium uppercase tracking-wider transition-colors',
                activeScenario === key
                  ? 'bg-accent-purple/20 text-accent-purple border border-accent-purple/40'
                  : 'bg-muted text-muted-foreground border border-transparent hover:bg-muted/80',
              ].join(' ')}
            >
              {key}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <NumberInput
              label="Monthly Price"
              prefix="$"
              value={inputs.monthlyPrice}
              onChange={(v) => onChange('monthlyPrice', v)}
              min={1}
              max={10000}
              tooltip="The monthly subscription price members pay to join your Skool community."
            />
            <p className="text-[10px] text-muted-foreground/60 mt-1">Skool communities: $27–$997/mo</p>
          </div>

          <div>
            <NumberInput
              label="CAC (Acquisition Cost)"
              prefix="$"
              value={inputs.cac}
              onChange={(v) => onChange('cac', v)}
              min={1}
              max={50000}
              tooltip="How much you spend on ads to acquire one new paying member. Includes all ad costs divided by conversions."
            />
            <p className="text-[10px] text-muted-foreground/60 mt-1">Meta ads for Skool: $80–$150 typical</p>
          </div>

          <div>
            <NumberInput
              label="Churn Rate"
              suffix="%"
              value={Math.round(inputs.churnRate * 100)}
              onChange={(v) => onChange('churnRate', v / 100)}
              min={1}
              max={100}
              tooltip="The percentage of your paying members who cancel each month. 10% means 1 in 10 members leave monthly."
            />
            <p className="text-[10px] text-muted-foreground/60 mt-1">Healthy Skool community: 5–15%/mo</p>
          </div>

          <div>
            <NumberInput
              label="Initial Budget"
              prefix="$"
              value={inputs.initialBudget}
              onChange={(v) => onChange('initialBudget', v)}
              min={0}
              max={1000000}
              step={100}
              tooltip="Your ad spend budget for month 1. After that, ad spend is calculated from revenue and your reinvestment %."
            />
            <p className="text-[10px] text-muted-foreground/60 mt-1">Start small to validate, then scale</p>
          </div>

          <Separator className="my-2" />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Reinvestment
              </Label>
              <Badge variant="outline" className="text-xs font-mono">
                {Math.round(inputs.reinvestmentPct * 100)}%
              </Badge>
            </div>
            <Slider
              value={[inputs.reinvestmentPct * 100]}
              onValueChange={([v]) => onChange('reinvestmentPct', v / 100)}
              min={0}
              max={100}
              step={1}
            />
            <div className="flex justify-between text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              <span>Profit</span>
              <span>Growth</span>
            </div>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full gap-2"
        onClick={handleShare}
      >
        <Share2 className="size-4" />
        {copied ? 'Link Copied!' : 'Share Calculator'}
      </Button>

      <div className="bg-card rounded-xl border p-4">
        <p className="text-xs leading-relaxed text-muted-foreground">
          This calculator models the unit economics of a <strong className="text-foreground">fully paid</strong> Skool
          community where you use ads to acquire paying members directly. Adjust inputs to see how ad spend,
          churn, and reinvestment affect your growth over 12 months.
        </p>
        <a
          href="/tools/skool-freemium-calculator"
          className="mt-3 flex items-center gap-1.5 text-xs font-medium text-accent-green hover:underline"
        >
          Using a freemium model? Try the Freemium Calculator
          <ArrowRight className="size-3" />
        </a>
      </div>
    </div>
  );
}
