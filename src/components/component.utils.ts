import type { CleanRecord } from '@/utils/base.types';

export type LinkKind = ExternalLink | InternalLink;
export type ExternalLink = 'external-link';
export type InternalLink = 'internal-link';
export type Button = 'button';
export type Anchor = 'a';

export const ButtonKinds = ['button', 'internal-link', 'external-link'] as const;
export const GlmInternalLink = 'GlmInternalLink';
export type GlmInternalLink = typeof GlmInternalLink;
export type ExtractProps<Something extends new () => { $props: any }> =
  InstanceType<Something>['$props'];
export type ExtractSlots<Something extends new () => { $slots: any }> = CleanRecord<
  InstanceType<Something>['$slots']
>;
