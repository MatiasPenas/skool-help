import { useState } from 'react';
import { ExternalLink, Copy, Check, FileText, ChevronLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import examplesData from '@/data/about-page-examples.json';

interface CommunityExample {
  communityName: string;
  ownerName: string;
  avatarUrl: string;
  skoolUrl: string;
  copy: string;
}

const EXAMPLES: CommunityExample[] = examplesData;

function CopyButton({ text, communityName }: { text: string; communityName: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    window.posthog?.capture('swipe_file_copied', {
      swipe_file_type: 'about_page_copy',
      community_name: communityName,
      text_length: text.length,
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-accent-green" />
          Copied
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          Copy
        </>
      )}
    </Button>
  );
}

function ExampleCard({ example }: { example: CommunityExample }) {
  return (
    <Card className="border-border/50 bg-card overflow-hidden py-0 gap-0 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border/50">
        {example.avatarUrl ? (
          <img
            src={example.avatarUrl}
            alt={example.ownerName}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-medium text-muted-foreground">
              {example.ownerName.charAt(0)}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground truncate">
            {example.communityName}
          </h3>
          <p className="text-xs text-muted-foreground">
            By {example.ownerName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CopyButton text={example.copy} communityName={example.communityName} />
          {example.skoolUrl !== '#' && (
            <a
              href={example.skoolUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Copy content */}
      <div className="px-5 py-4 bg-white flex-1">
        <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
          {example.copy}
        </div>
      </div>
    </Card>
  );
}

export default function AboutPageExamples() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <a
          href="/tools"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Tools
        </a>
      </div>

      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-accent-purple/15 flex items-center justify-center">
            <FileText className="w-5 h-5 text-accent-purple" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              About Page Copy
            </h1>
            <p className="text-sm text-muted-foreground">
              Real examples of Skool community about pages
            </p>
          </div>
        </div>
      </div>

      {/* Examples grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {EXAMPLES.filter(e => e.skoolUrl !== '#').map((example) => (
          <ExampleCard key={example.communityName} example={example} />
        ))}
      </div>
    </div>
  );
}
