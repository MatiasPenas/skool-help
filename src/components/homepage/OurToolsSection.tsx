import { motion } from 'framer-motion';
import * as Constants from '@/lib/constants';
import { SectionHeader } from './SectionHeader';
import { EmailTemplateCard } from './EmailTemplateCard';

export function OurToolsSection() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="py-8"
        >
            <SectionHeader title="Our Tools" linkText="All Tools" href="/tools" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Constants.OUR_TOOLS.map((tool, index) => (
                    <motion.div
                        key={tool.title + tool.subtitle}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                        <EmailTemplateCard {...tool} />
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
