import { Apartment, IsoDate } from '../../types';
import { isValidDate, isValidRange } from '../booking/booking';
import { DEFAULT_FILTERS } from './constants';
import { applyFilters } from './filters';

const createApartment = (overrides: Partial<Apartment> = {}): Apartment => ({
  id: 'apt-default',
  slug: 'apt-default',
  title: 'Квартира по умолчанию',
  category: 'Классика Букиных',
  district: 'Центр, Екатеринбург',
  address: 'ул. Ленина, д. 1',
  pricePerNight: 3000,
  maxGuests: 4,
  rooms: 2,
  areaSqm: 50,
  rating: '4.8',
  reviewsCount: 20,
  imageUrl: 'public/images/apartments/default.jpg',
  shortHook: 'Описание',
  fullDescription: ['Полное описание'],
  amenities: [],
  services: [],
  houseRules: [],
  bookedDates: {},
  ...overrides,
});

describe('isValidDate', () => {
  it('принимает валидные календарные даты YYYY-MM-DD', () => {
    expect(isValidDate('2026-11-23')).toBe(true);
    expect(isValidDate('2028-02-29')).toBe(true);
  });

  it('отклоняет несуществующие даты и неверный формат', () => {
    expect(isValidDate('2026-02-30')).toBe(false);
    expect(isValidDate('2026-02-29')).toBe(false);
    expect(isValidDate('2026-13-01')).toBe(false);
    expect(isValidDate('23-11-2026')).toBe(false);
    expect(isValidDate('2026/11/23')).toBe(false);
    expect(isValidDate('')).toBe(false);
  });
});

describe('isValidRange', () => {
  it('возвращает true, если checkIn строго раньше checkOut и обе даты валидны', () => {
    expect(isValidRange('2026-11-23', '2026-11-24')).toBe(true);
    expect(isValidRange('2026-11-23', '2026-11-30')).toBe(true);
  });

  it('возвращает false при выезде в тот же день, раньше заезда или при битых датах', () => {
    expect(isValidRange('2026-11-24', '2026-11-24')).toBe(false);
    expect(isValidRange('2026-11-26', '2026-11-24')).toBe(false);
    expect(isValidRange('2026-11-24', null)).toBe(false);
    expect(isValidRange(null, '2026-11-26')).toBe(false);
    expect(isValidRange('2026-02-30', '2026-03-05')).toBe(false);
  });
});

describe('applyFilters', () => {
  const aptCheap = createApartment({
    id: 'apt-1',
    title: 'Двушка на Гагарина',
    category: 'Классика Букиных',
    pricePerNight: 2000,
    maxGuests: 2,
    bookedDates: {
      '2026-12-10': 'Занято',
      '2026-12-11': 'Занято',
    },
  });

  const aptMid = createApartment({
    id: 'apt-2',
    title: 'Уютная Берлога у парка',
    category: 'Холостяцкая берлога',
    pricePerNight: 3500,
    maxGuests: 4,
    bookedDates: {
      '2026-12-20': 'Занято',
    },
  });

  const aptExpensive = createApartment({
    id: 'apt-3',
    title: 'Элитный Пентхаус с видом',
    category: 'Элитный пентхаус',
    pricePerNight: 7000,
    maxGuests: 6,
    bookedDates: {},
  });

  const catalog: readonly Apartment[] = [aptCheap, aptMid, aptExpensive];

  it('возвращает всё в исходном порядке с фильтрами по умолчанию', () => {
    const result = applyFilters(catalog, { ...DEFAULT_FILTERS });

    expect(result.map((a) => a.id)).toEqual(['apt-1', 'apt-2', 'apt-3']);
  });

  it('выполняет поиск по части имени без учёта регистра и лишних пробелов', () => {
    const result = applyFilters(catalog, {
      ...DEFAULT_FILTERS,
      query: '  пЕнТхАуС  ',
    });

    expect(result.map((a) => a.id)).toEqual(['apt-3']);
  });

  it('при пустом поисковом запросе сохраняет элементы, соответствующие другим фильтрам', () => {
    const result = applyFilters(catalog, {
      ...DEFAULT_FILTERS,
      query: '   ',
      category: 'Холостяцкая берлога',
    });

    expect(result.map((a) => a.id)).toEqual(['apt-2']);
  });

  it('включает граничные значения цен и корректно работает при отсутствии одного или обоих ограничений', () => {
    // Точные границы [2000, 7000] включают оба крайних объекта
    const exactBounds = applyFilters(catalog, {
      ...DEFAULT_FILTERS,
      minPrice: 2000,
      maxPrice: 7000,
      sort: 'price-asc',
    });
    expect(exactBounds.map((a) => a.id)).toEqual(['apt-1', 'apt-2', 'apt-3']);

    // Задан только minPrice
    const onlyMin = applyFilters(catalog, {
      ...DEFAULT_FILTERS,
      minPrice: 3500,
      maxPrice: null,
      sort: 'price-asc',
    });
    expect(onlyMin.map((a) => a.id)).toEqual(['apt-2', 'apt-3']);

    // Задан только maxPrice
    const onlyMax = applyFilters(catalog, {
      ...DEFAULT_FILTERS,
      minPrice: null,
      maxPrice: 3500,
      sort: 'price-asc',
    });
    expect(onlyMax.map((a) => a.id)).toEqual(['apt-1', 'apt-2']);
  });

  it('фильтрует жильё по вместимости (количеству гостей)', () => {
    const forFourGuests = applyFilters(catalog, {
      ...DEFAULT_FILTERS,
      guests: 4,
      sort: 'price-asc',
    });

    expect(forFourGuests.map((a) => a.id)).toEqual(['apt-2', 'apt-3']);
  });

  it('скрывает объекты, занятые в выбранные даты', () => {
    const result = applyFilters(catalog, {
      ...DEFAULT_FILTERS,
      checkIn: '2026-12-10' as IsoDate,
      checkOut: '2026-12-12' as IsoDate,
    });

    // apt-1 занята 10 и 11 декабря — должна быть скрыта
    expect(result.map((a) => a.id)).toEqual(['apt-2', 'apt-3']);
  });

  it('игнорирует даты, если задана только одна из них или диапазон недопустим', () => {
    // Задан только checkIn
    const onlyCheckIn = applyFilters(catalog, {
      ...DEFAULT_FILTERS,
      checkIn: '2026-12-10' as IsoDate,
      checkOut: null,
    });
    expect(onlyCheckIn.map((a) => a.id)).toEqual(['apt-1', 'apt-2', 'apt-3']);

    // Задан только checkOut
    const onlyCheckOut = applyFilters(catalog, {
      ...DEFAULT_FILTERS,
      checkIn: null,
      checkOut: '2026-12-12' as IsoDate,
    });
    expect(onlyCheckOut.map((a) => a.id)).toEqual(['apt-1', 'apt-2', 'apt-3']);

    // Выезд раньше заезда (недопустимый диапазон)
    const reversedRange = applyFilters(catalog, {
      ...DEFAULT_FILTERS,
      checkIn: '2026-12-15' as IsoDate,
      checkOut: '2026-12-10' as IsoDate,
    });
    expect(reversedRange.map((a) => a.id)).toEqual(['apt-1', 'apt-2', 'apt-3']);

    // Заезд и выезд в один день (0 ночей — недопустимый диапазон)
    const sameDayRange = applyFilters(catalog, {
      ...DEFAULT_FILTERS,
      checkIn: '2026-12-10' as IsoDate,
      checkOut: '2026-12-10' as IsoDate,
    });
    expect(sameDayRange.map((a) => a.id)).toEqual(['apt-1', 'apt-2', 'apt-3']);
  });

  it('объединяет фильтрацию и сортировку, не изменяя исходные данные', () => {
    const originalSnapshot = catalog.map((a) => a.id);

    const descResult = applyFilters(catalog, {
      ...DEFAULT_FILTERS,
      maxPrice: 7000,
      guests: 2,
      checkIn: '2026-12-10' as IsoDate,
      checkOut: '2026-12-12' as IsoDate,
      sort: 'price-desc',
    });

    expect(descResult.map((a) => a.id)).toEqual(['apt-3', 'apt-2']);
    expect(catalog.map((a) => a.id)).toEqual(originalSnapshot);
  });

  it('возвращает пустой список, если ничего не найдено', () => {
    const result = applyFilters(catalog, {
      ...DEFAULT_FILTERS,
      query: 'несуществующий пентхаус',
      guests: 10,
    });

    expect(result).toEqual([]);
  });

  it('находит жильё по району', () => {
    const result = applyFilters(catalog, { ...DEFAULT_FILTERS, query: 'екатеринбург' });

    expect(result.map((a) => a.id)).toEqual(['apt-1', 'apt-2', 'apt-3']);
  });
});
