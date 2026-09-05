import test from 'node:test';
import assert from 'node:assert/strict';
import { buildShareUrl } from './share.js';

test('share URLs retain only a post, guest marker and selected locale', () => {
  assert.equal(buildShareUrl('card-7', 'en', 'https://facs.example/feed?state=loading'), 'https://facs.example/feed?post=card-7&shared=1&locale=en');
  assert.equal(buildShareUrl('card-7', 'ko', 'https://facs.example/feed?locale=en'), 'https://facs.example/feed?post=card-7&shared=1');
});
