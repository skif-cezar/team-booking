/** '' → null, '120' → 120, мусор и отрицательные значения → null */
export const parsePrice = (raw: string): number | null => {
  const trimmed = raw.trim();

  if (trimmed === '') {
    return null;
  }

  const value = Number(trimmed);

  return Number.isFinite(value) && value >= 0 ? value : null;
};
