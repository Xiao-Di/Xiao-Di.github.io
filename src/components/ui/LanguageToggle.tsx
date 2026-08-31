'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useLocaleStore } from '@/lib/stores/localeStore';
import type { I18nRuntimeConfig } from '@/types/i18n';

interface LanguageToggleProps {
  i18n: I18nRuntimeConfig;
}

export default function LanguageToggle({ i18n }: LanguageToggleProps) {
  const { locale, setLocale } = useLocaleStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!i18n.enabled || !i18n.switcher || i18n.locales.length <= 1) {
    return null;
  }

  if (!mounted) {
    return (
      <div className="w-[76px] h-[26px] rounded-md border border-neutral-200/80 bg-neutral-50/80 dark:border-neutral-600 dark:bg-neutral-800/60">
        <div className="h-full w-1/2 rounded-l-md bg-neutral-300/70 animate-pulse dark:bg-neutral-700" />
      </div>
    );
  }

  const currentLocale = i18n.locales.includes(locale) ? locale : i18n.defaultLocale;
  const englishLocale = i18n.locales.find((locale) => locale === 'en');
  const localeOptions = englishLocale
    ? [englishLocale, ...i18n.locales.filter((locale) => locale !== englishLocale)]
    : i18n.locales;

  return (
    <div
      className={cn(
        'flex overflow-hidden rounded-md border border-neutral-200/80',
        'bg-neutral-50/80 text-xs font-semibold',
        'dark:border-neutral-600 dark:bg-neutral-800/60'
      )}
      role="group"
      aria-label="Language"
    >
      {localeOptions.map((localeOption, index) => {
        const isActive = currentLocale === localeOption;
        const label = localeOption === 'en' ? 'EN' : i18n.labels[localeOption] || localeOption.toUpperCase();

        return (
          <button
            key={localeOption}
            type="button"
            aria-current={isActive ? 'true' : undefined}
            title={i18n.labels[localeOption] || localeOption}
            disabled={isActive}
            onClick={() => setLocale(localeOption)}
            className={cn(
              'px-2 py-1 transition-colors focus:outline-none focus-visible:ring-2',
              'focus-visible:ring-inset focus-visible:ring-accent',
              index > 0 && 'border-l border-neutral-200/80 dark:border-neutral-600',
              isActive
                ? 'bg-accent text-white'
                : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700'
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
