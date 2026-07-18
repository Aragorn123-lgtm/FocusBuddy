const COINS_PER_MINUTE = 10;

export function calculateCoins(focusedMinutes: number): number {
  return focusedMinutes * COINS_PER_MINUTE;
}
