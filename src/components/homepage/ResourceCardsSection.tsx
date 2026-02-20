import { motion } from 'framer-motion';
import { SectionHeader } from './SectionHeader';
import { ResourceCard } from './ResourceCard';

interface ResourceCardsSectionProps {
    id?: string;
    title: string;
    linkText?: string;
    cards: any[];
}

export function ResourceCardsSection({
    id,
    title,
    linkText = "See All",
    cards
}: ResourceCardsSectionProps) {
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
