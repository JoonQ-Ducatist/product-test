import test from 'node:test';
import assert from 'node:assert/strict';
import { localeUrl, resolveLocale } from './locale.js';

const browser = (hostname, languages = []) => ({
  location: { hostname },
  navigator: { languages, language: languages[0] },
});

test('local review always defaults to Korean', () => {
  assert.equal(resolveLocale('', browser('localhost', ['en-US'])), 'ko');
});

test('explicit supported locale takes priority over browser preference', () => {
  assert.equal(resolveLocale('?locale=en', browser('example.com', ['ko-KR'])), 'en');
});

test('production browser preference can suggest English', () => {
  assert.equal(resolveLocale('', browser('example.com', ['en-GB', 'ko-KR'])), 'en');
});

test('language URL retains the current route and unrelated query values', () => {
  assert.equal(localeUrl('en', 'https://example.com/feed?post=card-1'), '/feed?post=card-1&locale=en');
  assert.equal(localeUrl('ko', 'https://example.com/feed?post=card-1&locale=en'), '/feed?post=card-1');
});
