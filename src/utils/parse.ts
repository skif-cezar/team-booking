import { ISO } from '../features/booking/booking';
import { IsoDate, SortOrder } from '../types';
import { SORT_ORDERS } from '../features/filtering/constants';

/** '' → null, иначе строка даты как есть */
export const parseDateInput = (raw: string): IsoDate | null => {
  const trimmed = raw.trim();

  return ISO.test(trimmed) ? (trimmed as IsoDate) : null;
};

/** '' → null, '120' → 120, мусор и отрицательные значения → null */
export const parsePrice = (raw: string): number | null => {
  const trimmed = raw.trim();

  if (trimmed === '') {
    return null;
  }

  const value = Number(trimmed);

  return Number.isFinite(value) && value >= 0 ? value : null;
};

/** '' → null, '3' → 3, 0 / дробные / мусор / отрицательные → null */
export const parseGuests = (raw: string): number | null => {
  const trimmed = raw.trim();

  if (trimmed === '') {
    return null;
  }

  const value = Number(trimmed);

  return Number.isInteger(value) && value >= 1 ? value : null;
};

export const parseSort = (raw: string): SortOrder => {
  return SORT_ORDERS.find((order) => order === raw) ?? 'default';
};
