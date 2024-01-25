export function clamp(number: number, [min, max]: [number, number]): number {
  return Math.min(Math.max(number, min), max);
}
