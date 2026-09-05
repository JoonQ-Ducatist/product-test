/**
 * Browser-only locale policy for the prototype.
 * Korean is the product default in every environment. A visitor can explicitly
 * opt into English with a URL-controlled language switch. Country routing stays
 * a server-side concern because it must not infer a user's location in the
 * client without an approved privacy policy.
 */
export const DEFAULT_LOCALE = 'ko';
export const AVAILABLE_LOCALES = ['ko', 'en'];
export const PLANNED_LOCALES = ['zh'];

export function resolveLocale(search = window.location.search, browser = window) {
  const requested = new URLSearchParams(search).get('locale');
  if (AVAILABLE_LOCALES.includes(requested)) return requested;
  return DEFAULT_LOCALE;
}

export function localeUrl(locale, href = window.location.href) {
  const url = new URL(href);
  // Preserve an explicit manual selection in the URL. Removing `locale=ko`
  // would make a browser-language heuristic able to override the user's click.
  if (AVAILABLE_LOCALES.includes(locale)) url.searchParams.set('locale', locale);
  return `${url.pathname}${url.search}${url.hash}`;
}
