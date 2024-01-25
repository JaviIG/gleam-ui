import type { ExtractProps } from '@/components/component.utils';
import GlmButton from '@/components/glm-button/glm-button.vue';

export const InputSizes = ['m', 'l'] as const;
export type InputSize = (typeof InputSizes)[number];

export const InputStatuses = ['idle', 'disabled', 'readonly', 'error'] as const;
export type InputStatus = (typeof InputStatuses)[number];
export type StartEndSlotsScope = {
  iconProps: {
    class: string;
  };
  buttonProps: ExtractProps<typeof GlmButton>;
};
