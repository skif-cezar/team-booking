import { ISO } from '../features/booking/booking';
import { IsoDate } from '../types';

/** '' → null, иначе строка даты как есть */
export const parseDateInput = (raw: string): IsoDate | null => {
  const trimmed = raw.trim();

  return ISO.test(trimmed) ? (trimmed as IsoDate) : null;
};
