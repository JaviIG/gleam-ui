import type { Primitive } from './base.types';

export function isObject<MaybeObject>(
  maybeObject: MaybeObject
): maybeObject is Exclude<MaybeObject, Primitive | null | undefined> {
  return typeof maybeObject === 'object' && !!maybeObject && !Array.isArray(maybeObject);
}
