import {
  type InputGenericSlotScope,
  InputSizes,
  InputStatuses,
} from '../glm-input/glm-input.utils';

export const AmountSizes = InputSizes;
export type AmountSize = (typeof AmountSizes)[number];

export const AmountStatuses = InputStatuses;
export type AmountStatus = (typeof AmountStatuses)[number];
export type AmountGenericSlotScope = InputGenericSlotScope;
