import { ButtonVariants } from '../glm-button/glm-button.utils';
import type { InjectionKey } from 'vue';

export const DropdownMenuVariants = ButtonVariants;

export type DropdownMenuVariant = (typeof DropdownMenuVariants)[number];

export type DropdownState = {
  collapse: () => void;
};
export const DropdownApiKey: InjectionKey<DropdownState> = Symbol.for('DropdownStateKey');
