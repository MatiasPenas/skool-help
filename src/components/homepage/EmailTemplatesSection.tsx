import { motion } from 'framer-motion';
import * as Constants from '@/lib/constants';
import { SectionHeader } from './SectionHeader';
import { EmailTemplateCard } from './EmailTemplateCard';

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export function EmailTemplatesSection() {
    return (
        <motion.section
            id="design"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="py-8"
        >
            <SectionHeader title="Most Popular" />
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
