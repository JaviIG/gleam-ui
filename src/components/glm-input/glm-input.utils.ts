export const InputSizes = ['m', 'l'] as const;
export type InputSize = (typeof InputSizes)[number];

export const InputStatuses = ['idle', 'disabled', 'readonly', 'error'] as const;
export type InputStatus = (typeof InputStatuses)[number];
