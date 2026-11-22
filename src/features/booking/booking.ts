import { DateRange } from '../../types';

const ISO = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Переводит дату формата YYYY-MM-DD в UTC-timestamp на начало дня (00:00:00.000Z).
 * Использование UTC защищает от сдвигов часовых поясов и перехода на летнее/зимнее время.
 */
const toUtc = (iso: string): number => Date.parse(`${iso}T00:00:00Z`);

/**
 * Проверяет, что строка является реально существующей календарной датой в формате YYYY-MM-DD.
 *
 * `new Date(...)` сам «нормализует» несуществующие даты (например, `2026-02-30` превратит
 * в `2026-03-02`), поэтому обратное сравнение с исходной строкой отсеивает такие случаи.
 */
export const isValidDate = (value: string): boolean => {
  if (!ISO.test(value)) {
    return false;
  }

  // const normalizedIso = new Date(toUtc(value)).toISOString().slice(0, 10);
  // return normalizedIso === value;
  const timestamp = toUtc(value);

  if (Number.isNaN(timestamp)) {
    return false;
  }

  const normalizedIso = new Date(timestamp).toISOString().slice(0, 10);

  return normalizedIso === value;
};

/**
 * Проверяет, что пара дат заезда и выезда корректна и пригодна для фильтрации или брони.
 *
 * Условия корректности:
 * - обе даты переданы (не null);
 * - обе даты являются валидными календарными датами;
 * - дата заезда строго раньше даты выезда (бронь минимум на 1 ночь).
 */
export const isValidRange = (checkIn: string | null, checkOut: string | null): boolean => {
  if (checkIn === null || checkOut === null) {
    return false;
  }

  if (!isValidDate(checkIn) || !isValidDate(checkOut)) {
    return false;
  }

  // Строковое сравнение для формата YYYY-MM-DD работает так же, как хронологическое
  return checkIn < checkOut;
};

/**
 * Проверяет, пересекаются ли два полуоткрытых интервала дат [checkIn, checkOut).
 *
 * День выезда (checkOut) не считается занятым для нового заезда:
 * если заезд b происходит в день выезда a (b.checkIn === a.checkOut),
 * пересечения нет — гости не конфликтуют.
 */
export const rangesOverlap = (a: DateRange, b: DateRange): boolean => {
  const aStartsBeforeBEnds = a.checkIn < b.checkOut;
  const bStartsBeforeAEnds = b.checkIn < a.checkOut;

  return aStartsBeforeBEnds && bStartsBeforeAEnds;
};

/**
 * Проверяет, свободен ли запрошенный диапазон на всём протяжении.
 *
 * Возвращает true только если запрошенный интервал не пересекается
 * ни с одним занятым периодом из списка `bookedRanges`.
 */
export const isRangeAvailable = (bookedRanges: readonly DateRange[], range: DateRange): boolean => {
  const hasNoConflicts = (bookedPeriod: DateRange): boolean => !rangesOverlap(bookedPeriod, range);

  return bookedRanges.every(hasNoConflicts);
};
