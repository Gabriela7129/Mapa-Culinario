export function formatNota(value: number, isUnanimous: boolean = false): string {
  if (value < 0) return '☁️☁️';
  if (value === 0) return '☁️';

  const full = Math.floor(value);
  const hasHalf = value % 1 !== 0;

  let result = '⭐️'.repeat(full);
  if (hasHalf) result += '✨';
  if (isUnanimous) result += '💖';

  return result;
}

export function formatPreco(value: number): string {
  if (value < 0) return '🪵🪵';
  if (value === 0) return '🪵';

  const full = Math.floor(value);
  const hasHalf = value % 1 !== 0;

  let result = '🌸'.repeat(full);
  if (hasHalf) result += '🌷';

  return result;
}

export const NOTA_OPTIONS = [-1, 0, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
