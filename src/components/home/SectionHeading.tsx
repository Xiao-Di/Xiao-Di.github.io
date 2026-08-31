import type { LucideIcon } from 'lucide-react';

interface SectionHeadingProps {
    icon: LucideIcon;
    title: string;
    className?: string;
}

export default function SectionHeading({ icon: Icon, title, className = '' }: SectionHeadingProps) {
    return (
        <h2 className={`flex items-center gap-2.5 text-2xl font-serif font-bold text-primary ${className}`}>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/12 text-accent">
                <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            {title}
        </h2>
    );
}
