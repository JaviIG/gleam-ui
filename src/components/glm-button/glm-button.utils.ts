export const ButtonSizes = ['s', 'm', 'l'] as const;
export const ButtonVariants = ['default', 'primary', 'transparent', 'success', 'error'] as const;
export type ButtonSize = (typeof ButtonSizes)[number];
export type ButtonVariant = (typeof ButtonVariants)[number];
