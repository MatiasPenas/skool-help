import { Card } from '@/components/ui/card';

interface CaseStudyCardProps {
    category: string;
    title: string;
    thumbnail: string;
}

export function CaseStudyCard({ category, title, thumbnail }: CaseStudyCardProps) {
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
