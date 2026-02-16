import { motion } from 'framer-motion';
import { User, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import * as Constants from '@/lib/constants';

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

function Header() {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <motion.div
          className="flex items-center gap-0.5 text-sm font-bold tracking-wider cursor-pointer"
          whileHover={{ scale: 1.02 }}
        >
          <span className="text-accent-blue">N</span>
          <span className="text-accent-purple">I</span>
          <span className="text-accent-pink">C</span>
          <span className="text-accent-orange">E</span>
          <span className="text-white">V</span>
          <span className="text-accent-green">E</span>
          <span className="text-accent-yellow">R</span>
          <span className="text-white">Y</span>
          <span className="text-muted-foreground">.</span>
          <span className="text-accent-blue">N</span>
          <span className="text-accent-purple">I</span>
          <span className="text-accent-pink">C</span>
          <span className="text-accent-orange">E</span>
        </motion.div>

        <nav className="hidden md:flex items-center gap-8">
          {Constants.NAV_ITEMS.map((item) => (
            <motion.a
              key={item.label}
              href={item.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
              whileHover={{ opacity: 1 }}
            >
              {item.label}
            </motion.a>
          ))}
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-elevated"
          aria-label="User profile"
        >
          <User className="w-5 h-5 text-muted-foreground" />
        </Button>
      </div>
    </motion.header>
  );
}

function HeroSection() {
  return (
    <motion.section
      id="hero"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className="pt-32 pb-12 text-center"
    >
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-yellow via-accent-orange to-accent-pink flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <h1 className="text-5xl font-bold text-foreground">Design</h1>
      </div>
      <p className="text-muted-foreground text-base">Design resources featured by our curators</p>
    </motion.section>
  );
}

function SectionHeader({ title, linkText = "See All", href = "#" }: { title: string; linkText?: string; href?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <motion.a
        href={href}
        className="group flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        whileHover={{ x: 2 }}
      >
        {linkText}
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </motion.a>
    </div>
  );
}

function EmailTemplateCard({
  image,
  title,
  subtitle,
  price,
  bgColor = "bg-card",
  icon
}: {
  image: string;
  title: string;
  subtitle: string;
  price: string;
  bgColor?: string;
  icon?: React.ReactNode;
}) {
  return (
    <Card
      className={`${bgColor} border-none rounded-card overflow-hidden cursor-pointer group hover:-translate-y-1 transition-all duration-200 ease-out`}
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
        />
      </div>
      <div className="p-3 flex items-center justify-between bg-card/60 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          {icon && <div className="w-5 h-5 rounded bg-elevated flex items-center justify-center">{icon}</div>}
          <div>
            <h3 className="text-sm font-medium text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <span className="text-xs text-muted-foreground">{price}</span>
      </div>
    </Card>
  );
}

function EmailTemplatesSection() {
  return (
    <motion.section
      id="design"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="py-8"
    >
      <SectionHeader title="Design Responsive Emails" />
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        {Constants.EMAIL_TEMPLATES.map((template, index) => (
          <motion.div
            key={template.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <EmailTemplateCard {...template} />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}

function ToolItem({ icon, name, description }: { icon: React.ReactNode; name: string; description: string }) {
  return (
    <div
      className="flex items-center justify-between p-3 rounded-lg bg-card border border-border cursor-pointer group hover:bg-white/5 transition-colors duration-200"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-medium text-foreground">{name}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="h-8 px-3 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-white/10 active:scale-95 transition-all duration-200"
      >
        GET
      </Button>
    </div>
  );
}

function ToolsSection({
  id,
  title,
  linkText = "All Tools",
  tools
}: {
  id?: string;
  title: string;
  linkText?: string;
  tools: any[]
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="py-8"
    >
      <SectionHeader title={title} linkText={linkText} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tools.map((tool: any, index: number) => (
          <motion.div
            key={tool.name}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <ToolItem
              name={tool.name}
              description={tool.description}
              icon={<div className={`w-5 h-5 bg-accent-${tool.color} ${tool.shape || 'rounded-sm'}`} />}
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function ShowcaseCard({ category, title, thumbnail }: { category: string; title: string; thumbnail: string }) {
  return (
    <Card
      className="flex items-center gap-4 p-4 rounded-card bg-card border-border border-2 cursor-pointer group hover:-translate-y-1 hover:bg-white/[0.03] transition-all duration-200"
    >
      <div className="flex-1">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">{category}</span>
        <h3 className="text-sm font-medium text-foreground mt-1 group-hover:text-white transition-colors">{title}</h3>
      </div>
      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
        <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
      </div>
    </Card>
  );
}

function ShowcaseSection({
  id,
  title,
  linkText = "All Stories",
  items
}: {
  id?: string;
  title: string;
  linkText?: string;
  items: { category: string; title: string; thumbnail: string }[]
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="py-8"
    >
      <SectionHeader title={title} linkText={linkText} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <ShowcaseCard {...item} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function ResourceCard({
  image,
  iconLetter,
  iconColor,
  title,
  description,
  price
}: {
  image: string;
  iconLetter: string;
  iconColor: string;
  title: string;
  description: string;
  price: string
}) {
  return (
    <Card
      className="rounded-card bg-card border-none overflow-hidden cursor-pointer group hover:-translate-y-1 hover:bg-white/[0.03] transition-all duration-200"
    >
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded bg-elevated flex items-center justify-center">
            <span className={`${iconColor} text-[10px] font-bold`}>{iconLetter}</span>
          </div>
          <h3 className="text-sm font-medium text-foreground">{title}</h3>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{description}</p>
          <span className="text-xs text-muted-foreground">{price}</span>
        </div>
      </div>
    </Card>
  );
}

function ResourceCardsSection({
  id,
  title,
  linkText = "See All",
  cards
}: {
  id?: string;
  title: string;
  linkText?: string;
  cards: any[]
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="py-8"
    >
      <SectionHeader title={title} linkText={linkText} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card: any, index: number) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <ResourceCard {...card} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function CaseStudyCard({ category, title, thumbnail }: { category: string; title: string; thumbnail: string }) {
  return (
    <Card
      className="flex items-center gap-4 p-4 rounded-card bg-card border-border cursor-pointer group hover:-translate-y-1 hover:bg-white/[0.03] transition-all duration-200"
    >
      <div className="flex-1">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">{category}</span>
        <h3 className="text-sm font-medium text-foreground mt-1 group-hover:text-white transition-colors">{title}</h3>
      </div>
      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
        <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
      </div>
    </Card>
  );
}

function CaseStudiesSection({
  id,
  title,
  linkText = "All Stories",
  cases
}: {
  id?: string;
  title: string;
  linkText?: string;
  cases: { category: string; title: string; thumbnail: string }[]
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="py-8"
    >
      <SectionHeader title={title} linkText={linkText} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cases.map((caseItem, index) => (
          <motion.div
            key={caseItem.title}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <CaseStudyCard {...caseItem} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="py-12 border-t border-border mt-12"
    >
      <div className="max-w-[1200px] mx-auto px-6 text-center">
        <nav className="flex items-center justify-center gap-6 mb-6">
          {Constants.NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors tracking-wider uppercase"
            >
              {item.label}
            </a>
          ))}
          <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors tracking-wider uppercase">Say Hi</a>
        </nav>

        <div className="flex items-center justify-center gap-0.5 text-sm font-bold tracking-wider mb-8">
          <span className="text-accent-blue">N</span>
          <span className="text-accent-purple">I</span>
          <span className="text-accent-pink">C</span>
          <span className="text-accent-orange">E</span>
          <span className="text-white">V</span>
          <span className="text-accent-green">E</span>
          <span className="text-accent-yellow">R</span>
          <span className="text-white">Y</span>
          <span className="text-muted-foreground">.</span>
          <span className="text-accent-blue">N</span>
          <span className="text-accent-purple">I</span>
          <span className="text-accent-pink">C</span>
          <span className="text-accent-orange">E</span>
        </div>

        <div className="flex flex-col items-center gap-4">
          <Separator className="w-12 bg-border" />
          <p className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase">
            &copy; {new Date().getFullYear()} Nicevery.Nice. Curated for designers.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-[1200px] mx-auto px-6">
        <HeroSection />

        <EmailTemplatesSection />

        <ToolsSection
          id="learn"
          title="Best Tools for Designers"
          linkText="All Tools"
          tools={Constants.DESIGN_TOOLS}
        />

        <ShowcaseSection
          title="Showcase of the Best Email Designs"
          linkText="All Stories"
          items={Constants.EMAIL_SHOWCASES}
        />

        <ShowcaseSection
          title="Design Mockups to Speed Up Your Workflow"
          linkText="All Stories"
          items={Constants.MOCKUP_SHOWCASES}
        />

        <ToolsSection
          title="Find Free Icons"
          linkText="All Tools"
          tools={Constants.ICON_TOOLS}
        />

        <ToolsSection
          title="Find Free Photos & Videos"
          linkText="All Tools"
          tools={Constants.PHOTO_TOOLS}
        />

        <ResourceCardsSection
          title="Present Your Designs"
          cards={Constants.PRESENT_DESIGNS}
        />

        <ResourceCardsSection
          title="Design Better Websites"
          linkText="See All"
          cards={Constants.BETTER_WEBSITES}
        />

        <CaseStudiesSection
          id="inspire"
          title="Inspire By the Best Websites"
          linkText="All Stories"
          cases={Constants.CASE_STUDIES}
        />

        <CaseStudiesSection
          title="Follow Latest Design Trends"
          linkText="All Stories"
          cases={Constants.TREND_ARTICLES}
        />

        <ResourceCardsSection
          id="build"
          title="Social Media Templates"
          linkText="All Templates"
          cards={Constants.SOCIAL_MEDIA}
        />

        <ShowcaseSection
          title="Showcase of the Best Instagram Templates"
          linkText="All Stories"
          items={Constants.INSTAGRAM_SHOWCASES}
        />
      </main>

      <Footer />
    </div>
  );
}
