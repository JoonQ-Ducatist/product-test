/** Builds a stable, locale-preserving guest evaluation URL without analytics-only query state. */
export function buildShareUrl(postId, locale = 'ko', href = window.location.href) {
  const url = new URL(href);
  url.search = '';
  url.searchParams.set('post', postId);
  url.searchParams.set('shared', '1');
  if (locale === 'en') url.searchParams.set('locale', 'en');
  return url.href;
}
