import * as Constants from '@/lib/constants';
import { HeroSection } from './HeroSection';
import { EmailTemplatesSection } from './EmailTemplatesSection';
import { OurToolsSection } from './OurToolsSection';
import { ToolsSection } from './ToolsSection';
import { ShowcaseSection } from './ShowcaseSection';
import { AboutSection } from './AboutSection';

export default function HomePage() {
  return (
    <div className="bg-background">
      <main className="max-w-[1200px] mx-auto px-6">
        <HeroSection />

        <EmailTemplatesSection />

        <ToolsSection
          id="skool-communities"
          title="Communities for Skool Owners"
          tools={Constants.SKOOL_COMMUNITIES}
          linkText="All Communities"
          href="/communities"
          tooltip="Some links on this page are affiliate links. If you join through them, we may earn a commission at no extra cost to you."
        />

        <OurToolsSection />

        <ShowcaseSection
          title="From the Blog"
          linkText="All Posts"
          href="/blog"
          items={Constants.BLOG_POSTS}
        />

        <AboutSection />
      </main>
    </div>
  );
}
