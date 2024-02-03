import { InputSizes, InputStatuses } from '../glm-input/glm-input.utils';

export type SelectLoaderSlotScope = {
  iconProps: {
    class: string;
  };
};

export const SelectStatuses = InputStatuses;
export const SelectSizes = InputSizes;

export type SelectStatus = (typeof InputStatuses)[number];
export type SelectSize = (typeof SelectSizes)[number];
