import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeSupabaseError } from './supabaseApi.js';

test('Supabase duplicate vote errors retain the public API contract', () => {
  const result = normalizeSupabaseError({ code: '23505' });
  assert.equal(result.error.code, 'ALREADY_VOTED');
  assert.equal(result.error.message, '이미 의견을 남긴 게시물이에요.');
});

test('Supabase authorization errors never expose database detail', () => {
  const result = normalizeSupabaseError({ code: '42501' });
  assert.equal(result.error.code, 'FORBIDDEN');
  assert.equal(result.error.message, '이 작업을 수행할 권한이 없어요.');
});
