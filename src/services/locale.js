/**
 * Browser-only locale policy for the prototype.
 * Korean is intentionally the default for local QA. Production country routing
 * stays a server-side concern because it must not infer a user's location in
 * the client without an approved privacy policy.
 */
export const DEFAULT_LOCALE = 'ko';
export const AVAILABLE_LOCALES = ['ko', 'en'];
export const PLANNED_LOCALES = ['zh'];

export function resolveLocale(search = window.location.search, browser = window) {
  const requested = new URLSearchParams(search).get('locale');
  if (AVAILABLE_LOCALES.includes(requested)) return requested;

  if (['localhost', '127.0.0.1'].includes(browser.location.hostname)) return DEFAULT_LOCALE;

  const preferred = [...(browser.navigator.languages ?? []), browser.navigator.language]
    .filter(Boolean)
    .map((language) => language.toLowerCase().split('-')[0]);
  return preferred.includes('en') ? 'en' : DEFAULT_LOCALE;
}

export function localeUrl(locale, href = window.location.href) {
  const url = new URL(href);
  if (locale === DEFAULT_LOCALE) url.searchParams.delete('locale');
  else url.searchParams.set('locale', locale);
  return `${url.pathname}${url.search}${url.hash}`;
}
