import { motion } from 'framer-motion';
import { SectionHeader } from './SectionHeader';
import { ShowcaseCard } from './ShowcaseCard';

interface ShowcaseSectionProps {
    id?: string;
    title: string;
    linkText?: string;
    href?: string;
    items: { category: string; title: string; thumbnail: string; href?: string }[];
}

export function ShowcaseSection({
    id,
    title,
    linkText = "All Stories",
    href,
    items
}: ShowcaseSectionProps) {
    return (
        <motion.section
            id={id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="py-8"
        >
            <SectionHeader title={title} linkText={linkText} href={href} />
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
