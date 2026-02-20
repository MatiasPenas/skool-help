import { motion } from 'framer-motion';
import { SectionHeader } from './SectionHeader';
import { CaseStudyCard } from './CaseStudyCard';

interface CaseStudiesSectionProps {
    id?: string;
    title: string;
    linkText?: string;
    cases: { category: string; title: string; thumbnail: string }[];
}

export function CaseStudiesSection({
    id,
    title,
    linkText = "All Stories",
    cases
}: CaseStudiesSectionProps) {
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
