export const ButtonSizes = ['s', 'm', 'l'] as const;
export const ButtonVariants = ['default', 'primary', 'transparent', 'success', 'error'] as const;
export const ButtonStatuses = ['idle', 'disabled', 'loading'] as const;
export type ButtonSize = (typeof ButtonSizes)[number];
export type ButtonVariant = (typeof ButtonVariants)[number];
export type ButtonStatus = (typeof ButtonStatuses)[number];
