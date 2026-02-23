import { useState } from 'react';
import type { CalculatorInputs } from '@/lib/calculator-engine';
import { NumberInput } from './NumberInput';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Share2, ArrowRight, ChevronDown } from 'lucide-react';

const SATURATION_PRESETS: { label: string; cacGrowthRate: number }[] = [
  { label: 'Ideal',       cacGrowthRate: 0    },
  { label: 'Typical',     cacGrowthRate: 0.05 },
  { label: 'Competitive', cacGrowthRate: 0.10 },
];

function detectActiveSaturationPreset(cacGrowthRate: number): number | null {
  const idx = SATURATION_PRESETS.findIndex((p) => p.cacGrowthRate === cacGrowthRate);
  return idx >= 0 ? idx : null;
}

interface InputPanelProps {
  inputs: CalculatorInputs;
  onChange: <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => void;
  onPreset: (inputs: CalculatorInputs) => void;
}

export function InputPanel({ inputs, onChange, onPreset }: InputPanelProps) {
  const [copied, setCopied] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const cacGrowthRate = inputs.cacGrowthRate ?? 0;
  const activePresetIdx = detectActiveSaturationPreset(cacGrowthRate);

  const handleChange = <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => {
    window.posthog?.capture('calculator_used', {
      calculator_type: 'premium',
      changed_field: key,
      [key]: value,
      monthly_price: inputs.monthlyPrice,
      cac: inputs.cac,
      churn_rate: inputs.churnRate,
      initial_budget: inputs.initialBudget,
      reinvestment_pct: inputs.reinvestmentPct,
      cac_growth_rate: inputs.cacGrowthRate ?? 0,
    });
    onChange(key, value);
  };

  const handleSaturationPreset = (preset: typeof SATURATION_PRESETS[0]) => {
    window.posthog?.capture('calculator_used', {
      calculator_type: 'premium',
      changed_field: 'cac_growth_rate',
      cac_growth_rate: preset.cacGrowthRate,
      preset_label: preset.label,
    });
    onPreset({ ...inputs, cacGrowthRate: preset.cacGrowthRate });
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      window.posthog?.capture('calculator_shared', {
        calculator_type: 'premium',
        monthly_price: inputs.monthlyPrice,
        cac: inputs.cac,
        churn_rate: inputs.churnRate,
      });
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

        <div className="space-y-4">
          <div>
            <NumberInput
              label="Monthly Price"
              prefix="$"
              value={inputs.monthlyPrice}
              onChange={(v) => handleChange('monthlyPrice', v)}
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
              onChange={(v) => handleChange('cac', v)}
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
              onChange={(v) => handleChange('churnRate', v / 100)}
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
              onChange={(v) => handleChange('initialBudget', v)}
              min={0}
              max={1000000}
              step={100}
              tooltip="Your ad spend budget for month 1. After that, ad spend is calculated from revenue and your reinvestment %."
            />
            <p className="text-[10px] text-muted-foreground/60 mt-1">Start small to validate, then scale</p>
          </div>

          <Separator className="my-2" />

          <button
            onClick={() => setAdvancedOpen((o) => !o)}
            className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors w-full"
          >
            <ChevronDown className={`size-3 transition-transform ${advancedOpen ? 'rotate-180' : ''}`} />
            Advanced
          </button>

          {advancedOpen && (
            <div className="space-y-4 pt-1">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Reinvestment
                  </Label>
                  <span className="text-xs font-mono text-muted-foreground">{Math.round(inputs.reinvestmentPct * 100)}%</span>
                </div>
                <p className="text-[10px] text-muted-foreground/70 leading-relaxed">
                  What percentage of monthly revenue goes back into ads. 100% maximizes growth; lower values take more profit out.
                </p>
                <Slider
                  value={[inputs.reinvestmentPct * 100]}
                  onValueChange={([v]) => handleChange('reinvestmentPct', v / 100)}
                  min={0}
                  max={100}
                  step={1}
                />
                <div className="flex justify-between text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  <span>Profit</span>
                  <span>Growth</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Audience Saturation
                </Label>
                <p className="text-[10px] text-muted-foreground/70 leading-relaxed">
                  Real ad campaigns get more expensive over time. As you exhaust your warmest audiences, your CAC rises. Leave at 0% for the optimistic baseline.
                </p>
                <div className="flex gap-1.5">
                  {SATURATION_PRESETS.map((preset, idx) => (
                    <button
                      key={preset.label}
                      onClick={() => handleSaturationPreset(preset)}
                      className={[
                        'flex-1 rounded-md px-2 py-1 text-[10px] font-medium uppercase tracking-wider transition-colors',
                        activePresetIdx === idx
                          ? 'bg-accent-purple/20 text-accent-purple border border-accent-purple/40'
                          : 'bg-muted text-muted-foreground border border-transparent hover:bg-muted/80',
                      ].join(' ')}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <NumberInput
                  suffix="%/mo"
                  value={parseFloat((cacGrowthRate * 100).toFixed(1))}
                  onChange={(v) => handleChange('cacGrowthRate', v / 100)}
                  min={0}
                  max={20}
                  step={0.5}
                />
              </div>
            </div>
          )}
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
