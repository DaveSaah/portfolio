import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export type Language = {
  code: string;
  name: string;
  flag: string;
  targetUrl: string;
};

type LanguageSelectorProps = {
  currentLocale: string;
  languages: Array<Language>;
};

export function LanguageSelector({
  currentLocale,
  languages,
}: LanguageSelectorProps) {
  const [isPending, startTransition] = React.useTransition();

  function onSelectLanguage(targetUrl: string) {
    startTransition(() => {
      const pathname = window.location.pathname;

      // Check if we're on a detail page (blog or tips)
      const detailPageMatch = pathname.match(/^(\/en)?\/(blog|tips)\/[^\/]+/);

      if (detailPageMatch) {
        const [, langPrefix, section] = detailPageMatch;
        // Redirect to the opposite language's index page
        const newLangPrefix = langPrefix ? '' : '/en';
        window.location.href = `${newLangPrefix}/${section}/`;
      } else {
        window.location.href = targetUrl;
      }
    });
  }

  const currentLanguage = languages.find((lang) => lang.code === currentLocale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={isPending}
          className="size-8 p-0 hover:bg-accent"
          aria-label="Changer de langue"
        >
          {currentLanguage ? (
            <img
              src={`https://flagcdn.com/w20/${currentLanguage.flag}.png`}
              alt={`Drapeau ${currentLanguage.name}`}
              width={20}
              height={15}
              className="object-contain"
            />
          ) : (
            <span className="text-sm">{currentLocale.toUpperCase()}</span> // Fallback si drapeau non trouvé
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        {languages.map((lang) => (
          <DropdownMenuCheckboxItem
            key={lang.code}
            className={cn(
              'flex items-center gap-2 hover:bg-accent hover:cursor-pointer',
              currentLocale === lang.code ? 'bg-accent' : ''
            )}
            checked={currentLocale === lang.code}
            onCheckedChange={() => onSelectLanguage(lang.targetUrl)}
            disabled={isPending}
          >
            <img
              src={`https://flagcdn.com/w20/${lang.flag}.png`}
              alt={`Drapeau ${lang.name}`}
              width={20}
              height={15}
              className="object-contain mr-2"
            />
            {lang.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
