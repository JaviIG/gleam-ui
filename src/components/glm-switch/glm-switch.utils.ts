export const SwitchStatuses = ['idle', 'readonly', 'disabled'] as const;
export type SwitchStatus = (typeof SwitchStatuses)[number];
