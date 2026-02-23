import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const SKOOL_REFERRAL_URL = 'https://www.skool.com/signup?ref=101889e86ce44c2f8edc5db9957fe449';

export function CtaSection() {
  const handleCtaClick = () => {
    window.posthog?.capture('tool_cta_clicked', {
      cta_label: 'Join Skool',
      destination_url: SKOOL_REFERRAL_URL,
      source: 'calculator_cta_section',
    });
  };

  return (
    <div className="bg-gradient-to-r from-accent-purple/20 via-accent-blue/10 to-accent-green/20 rounded-xl border p-8 text-center">
      <h3 className="text-xl font-bold mb-2">Ready to grow your Skool community?</h3>
      <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
        Start building your premium community on Skool. Use this calculator to plan your ad strategy before you launch.
      </p>
      <Button
        asChild
        size="lg"
        className="bg-accent-yellow text-black font-semibold hover:bg-accent-yellow/90 gap-2"
      >
        <a href={SKOOL_REFERRAL_URL} target="_blank" rel="noopener noreferrer" onClick={handleCtaClick}>
          Join Skool
          <ExternalLink className="size-4" />
        </a>
      </Button>
    </div>
  );
}
