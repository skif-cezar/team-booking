import { describe, expect, it } from 'vitest';
import { isValidDate, isValidRange } from './booking';

describe('isValidDate', () => {
  it.each(['2026-13-10', '2026-00-10', '2026-12-32', '2026-12-00'])(
    'отклоняет несуществующий месяц или день, не бросая исключение: %s',
    (value) => {
      expect(isValidDate(value)).toBe(false);
    },
  );
});

describe('isValidRange', () => {
  it('отклоняет несуществующие даты, не бросая исключение', () => {
    expect(isValidRange('2026-13-10', '2026-13-12')).toBe(false);
    expect(isValidRange('2026-12-10', '2026-02-30')).toBe(false);
  });
});
