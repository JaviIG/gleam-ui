import { contains } from './string';
import { describe, it, expect } from 'vitest';

describe('contains', () => {
  it.each([
    ['a', 'a', true],
    ['ab', 'a', true],
    ['ba', 'a', true],
    ['bab', 'a', true],
    ['a', 'a', true],
    ['a', 'a', true],
  ])(`%s contains %s is %s`, ([string, substring, result]) => {
    expect(contains(string, substring)).toEqual(result);
  });
});
