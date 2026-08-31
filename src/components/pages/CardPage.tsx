'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { CardPageConfig } from '@/types/page';

const markdownComponents = {
    p: ({ children }: React.ComponentProps<'p'>) => <p className="mb-3 last:mb-0">{children}</p>,
    ul: ({ children }: React.ComponentProps<'ul'>) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
    ol: ({ children }: React.ComponentProps<'ol'>) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
    li: ({ children }: React.ComponentProps<'li'>) => <li className="mb-1">{children}</li>,
    a: ({ ...props }) => (
        <a
            {...props}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-600 dark:text-neutral-500 transition-all duration-200 rounded hover:text-accent hover:bg-accent/10 hover:shadow-sm"
        />
    ),
    blockquote: ({ children }: React.ComponentProps<'blockquote'>) => (
        <blockquote className="border-l-4 border-accent/50 pl-4 italic my-4 text-neutral-600 dark:text-neutral-500">
            {children}
        </blockquote>
    ),
    strong: ({ children }: React.ComponentProps<'strong'>) => <strong className="font-semibold text-accent">{children}</strong>,
    em: ({ children }: React.ComponentProps<'em'>) => <em className="italic">{children}</em>,
    code: ({ children }: React.ComponentProps<'code'>) => (
        <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[0.95em]">{children}</code>
    ),
};

const isSoftwareSection = (title: string) => /^(CSC|软件)$/i.test(title.trim());

export default function CardPage({ config, embedded = false }: { config: CardPageConfig; embedded?: boolean }) {
    const sections = config.sections?.length
        ? config.sections
        : [{ title: '', items: config.items || [] }];
    const tagHues = new Map<string, number>();
    sections.forEach(section => section.items?.forEach(item => item.tags?.forEach(tag => {
        if (!tagHues.has(tag)) tagHues.set(tag, (tagHues.size * 137.508 + 36) % 360);
    })));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className={embedded ? "mb-4" : "mb-8"}>
                <h1 className={`${embedded ? "text-2xl" : "text-4xl"} font-serif font-bold text-primary mb-4`}>{config.title}</h1>
                {config.description && (
                    <div className={`${embedded ? "text-base" : "text-lg"} text-neutral-600 dark:text-neutral-500 max-w-2xl leading-relaxed`}>
                        <ReactMarkdown components={markdownComponents}>
                            {config.description}
                        </ReactMarkdown>
                    </div>
                )}
            </div>

            <div className={embedded ? "space-y-8" : "space-y-12"}>
                {sections.map((section, sectionIndex) => (
                    <section key={section.title || sectionIndex}>
                        {section.title && (
                            <div className="mb-5">
                                <h2 className={`${embedded ? "text-xl" : "text-2xl"} font-serif font-bold text-primary`}>{section.title}</h2>
                                {section.description && <p className="mt-2 text-sm text-neutral-500">{section.description}</p>}
                            </div>
                        )}
                        <div className={`grid ${embedded ? "gap-4" : "gap-6"}`}>
                            {(section.items || []).map((item, index) => (
                                <motion.div
                                    key={`${sectionIndex}-${index}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.1 * index }}
                                    className={`bg-white dark:bg-neutral-900 ${embedded ? "p-4" : "p-6"} rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-all duration-200 hover:scale-[1.01]`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className={`${embedded ? "text-lg" : "text-xl"} font-semibold text-primary`}>{item.title}</h3>
                                        {item.date && <span className="shrink-0 whitespace-nowrap text-sm text-neutral-500 font-medium bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">{item.date}</span>}
                                    </div>
                                    {item.subtitle && isSoftwareSection(section.title) ? (
                                        <div className="mb-3 flex items-start justify-between gap-4">
                                            <p className={`${embedded ? "text-sm" : "text-base"} min-w-0 flex-1 text-accent font-medium`}>{item.subtitle}</p>
                                            {item.tags && (
                                                <div className="flex min-w-0 max-w-[62%] shrink flex-col items-end gap-1.5">
                                                    {item.tags.map(tag => (
                                                        <span
                                                            key={tag}
                                                            className="card-tag max-w-full break-words rounded border px-2 py-1 text-right text-xs font-medium leading-4"
                                                            style={{ '--tag-hue': tagHues.get(tag) } as React.CSSProperties}
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : item.subtitle ? (
                                        <p className={`${embedded ? "text-sm" : "text-base"} text-accent font-medium mb-3`}>{item.subtitle}</p>
                                    ) : null}
                                    {(item.content || (!isSoftwareSection(section.title) && item.tags?.length)) && (
                                        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
                                            {item.content && (
                                                <div className={`${embedded ? "text-sm" : "text-base"} min-w-0 flex-1 text-neutral-600 dark:text-neutral-500 leading-relaxed`}>
                                                    <ReactMarkdown components={markdownComponents}>{item.content}</ReactMarkdown>
                                                </div>
                                            )}
                                            {!isSoftwareSection(section.title) && item.tags && (
                                                <div className="ml-auto flex shrink-0 flex-wrap justify-end gap-2">
                                                    {item.tags.map(tag => (
                                                        <span
                                                            key={tag}
                                                            className="card-tag rounded border px-2 py-1 text-xs font-medium"
                                                            style={{ '--tag-hue': tagHues.get(tag) } as React.CSSProperties}
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </motion.div>
    );
}
