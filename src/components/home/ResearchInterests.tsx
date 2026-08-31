'use client';

import { motion } from 'framer-motion';
import { FlaskConical } from 'lucide-react';
import SectionHeading from './SectionHeading';

interface ResearchInterestsProps {
    interests: string[];
    title: string;
}

export default function ResearchInterests({ interests, title }: ResearchInterestsProps) {
    if (!interests.length) return null;

    return (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}>
            <SectionHeading icon={FlaskConical} title={title} className="mb-4" />
            <div className="grid gap-3 sm:grid-cols-2">
                {interests.map((interest) => (
                    <div key={interest} className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-sm dark:border-[rgba(148,163,184,0.24)] dark:bg-neutral-800">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {interest}
                    </div>
                ))}
            </div>
        </motion.section>
    );
}
