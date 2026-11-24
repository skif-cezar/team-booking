import { SORT_ORDERS } from '../features/filtering/constants';
import { SortOrder } from '../types';

/** '' → null, '120' → 120, мусор и отрицательные значения → null */
export const parsePrice = (raw: string): number | null => {
  const trimmed = raw.trim();

  if (trimmed === '') {
    return null;
  }

  const value = Number(trimmed);

  return Number.isFinite(value) && value >= 0 ? value : null;
};

export const parseSort = (raw: string): SortOrder => {
  return SORT_ORDERS.find((order) => order === raw) ?? 'default';
};
