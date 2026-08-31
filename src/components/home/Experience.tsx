export interface ExperienceItem {
    period: string;
    organization: string;
    role: string;
}

interface ExperienceProps {
    items: ExperienceItem[];
}

export default function Experience({ items }: ExperienceProps) {
    if (!items.length) return null;

    return (
        <ol className="mt-4 space-y-2.5" aria-label="Experience">
            {items.map((item) => (
                <li
                    key={`${item.period}-${item.organization}`}
                    className="grid grid-cols-[auto_9rem_minmax(0,1fr)] items-baseline gap-x-2.5 gap-y-0.5 sm:grid-cols-[auto_9.5rem_minmax(0,1fr)_auto]"
                >
                    <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                    <time className="whitespace-nowrap text-[13px] leading-5 tracking-wide text-neutral-500 sm:text-sm">{item.period}</time>
                    <span className="min-w-0 text-[13px] font-semibold leading-5 text-primary sm:text-sm">{item.organization}</span>
                    <span className="col-start-3 text-[13px] leading-5 text-neutral-500 sm:col-start-auto sm:whitespace-nowrap sm:text-right sm:text-sm">
                        {item.role}
                    </span>
                </li>
            ))}
        </ol>
    );
}
