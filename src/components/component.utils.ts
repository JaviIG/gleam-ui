import type { CleanRecord } from '@/utils/base.types';

export type LinkKind = ExternalLink | InternalLink;
export type ExternalLink = 'external-link';
export type InternalLink = 'internal-link';
export type Button = 'button';
export type Anchor = 'a';

export const ButtonKinds = ['button', 'internal-link', 'external-link'] as const;
export const GlmInternalLink = 'GlmInternalLink';
export type GlmInternalLink = typeof GlmInternalLink;

export type ExtractProps<Something> =
  Something extends Newable<{ $props: infer Props }>
    ? Props
    : Something extends (props: infer Props) => any
      ? Props
      : never;

export type ExtractSlots<Something> = CleanRecord<
  Something extends Newable<{ $slots: infer Slots }>
    ? Slots
    : Something extends (props: any, data?: infer Data, ...remaining: any[]) => any
      ? Data extends { slots: infer Slots }
        ? Slots
        : never
      : never
>;

export type ExtractExposed<Something> = Something extends (
  a: any,
  b?: any,
  exposed?: infer ExposedFn,
  ...remaining: any[]
) => any
  ? ExposedFn extends (exposed: infer Exposed) => any
    ? Exposed
    : undefined
  : never;

export type Newable<T> = new () => T;
