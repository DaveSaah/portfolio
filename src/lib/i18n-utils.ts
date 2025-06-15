import { defaultLanguage, languages, type LanguageCode } from '@/i18n/ui';
import { getRelativeLocaleUrl } from 'astro:i18n';

export type LanguageSelectorItem = {
  code: string;
  name: string;
  flag: string;
  targetUrl: string;
};

export function prepareLanguagesForSelector(
  currentPathname: string,
  currentLocale: LanguageCode
): Array<LanguageSelectorItem> {
  let basePathForLinks = currentPathname;

  // Adjust basePathForLinks if currentLocale is not the default language
  // and the pathname starts with the locale prefix.
  if (currentLocale !== defaultLanguage) {
    const prefix = `/${currentLocale}`;
    if (currentPathname.startsWith(prefix)) {
      basePathForLinks = currentPathname.substring(prefix.length) || '/';
    }
  }

  return Object.keys(languages).map((langCodeStr) => {
    const langCode = langCodeStr as LanguageCode;
    return {
      code: langCode,
      name: languages[langCode].name,
      flag: languages[langCode].flag,
      targetUrl: getRelativeLocaleUrl(langCode, basePathForLinks),
    };
  });
}
