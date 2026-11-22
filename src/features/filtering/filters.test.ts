import { DateRange, Property } from '../../types';
import { DEFAULT_FILTERS } from './constants';
import { applyFilters } from './filters';

/** Создаёт объект аппартамента */
const make = (
  id: string,
  title: string,
  category: Property['category'],
  pricePerNight: number,
  maxGuests = 4,
  bookedRanges: DateRange[] = [],
): Property => ({
  id,
  title,
  category,
  city: 'Тбилиси',
  district: 'Сололаки',
  address: 'ул. Ладо Асатиани',
  pricePerNight,
  cleaningFee: 15,
  maxGuests,
  bedrooms: 2,
  areaSqm: 48,
  rating: 4.3,
  reviewsCount: 11,
  imageUrl: '',
  gallery: [],
  shortDescription: '',
  description: '',
  amenities: [],
  optionalServices: [],
  bookedRanges,
  rules: {
    checkInTime: '15:00',
    checkOutTime: '11:00',
    smokingAllowed: true,
    petsAllowed: true,
  },
});

/** Массив аппартаментов */
const data: Property[] = [
  make('1', 'Уютный Пентхаус с террасой', 'Penthouse', 100, 3, [{ checkIn: '2026-12-10', checkOut: '2026-12-15' }]),
  make('2', 'Панорамный Лофт с высокими потолками', 'Loft', 20, 2),
  make('3', 'Тихая Мини-студия', 'Studio', 150, 8),
  make('4', 'Просторный Таунхаус в зелёном квартале', 'Townhouse', 30, 2),
  make('5', 'Тихая Студия в центре', 'Studio', 110, 4),
];

/** id-ки для объектов аппартаментов */
const ids = (list: Property[]): string[] => list.map((p) => p.id);

describe('applyFilters', () => {
  it('возвращает всё в исходном порядке с фильтрами по умолчанию', () => {
    expect(ids(applyFilters(data, DEFAULT_FILTERS))).toEqual(['1', '2', '3', '4', '5']);
  });

  it('поиск по части имени, без учёта регистра', () => {
    expect(ids(applyFilters(data, { ...DEFAULT_FILTERS, query: 'ТИХАЯ' }))).toEqual(['3', '5']);
  });

  it('при пустом поисковом запросе сохраняются элементы, соответствующие другим фильтрам', () => {
    const result = applyFilters(data, { ...DEFAULT_FILTERS, category: 'Studio' });
    expect(ids(result)).toEqual(['3', '5']);
  });

  it('диапазон цен включает граничные значения; ограничения по границам отсутствуют', () => {
    expect(ids(applyFilters(data, { ...DEFAULT_FILTERS, minPrice: 30, maxPrice: 100 }))).toEqual(['1', '4']);
    expect(ids(applyFilters(data, { ...DEFAULT_FILTERS, minPrice: 100 }))).toEqual(['1', '3', '5']);
    expect(ids(applyFilters(data, { ...DEFAULT_FILTERS, maxPrice: 30 }))).toEqual(['2', '4']);
  });

  it('фильтры по вместимости (количеству гостей)', () => {
    expect(ids(applyFilters(data, { ...DEFAULT_FILTERS, guests: 3 }))).toEqual(['1', '3', '5']);
    expect(ids(applyFilters(data, { ...DEFAULT_FILTERS, guests: 9 }))).toEqual([]);
  });

  it('скрывает объекты, занятые в выбранные даты', () => {
    const dates = { checkIn: '2026-12-12', checkOut: '2026-12-14' };
    expect(ids(applyFilters(data, { ...DEFAULT_FILTERS, ...dates }))).toEqual(['2', '3', '4', '5']);

    const free = { checkIn: '2026-12-15', checkOut: '2026-12-17' };
    expect(ids(applyFilters(data, { ...DEFAULT_FILTERS, ...free }))).toEqual(['1', '2', '3', '4', '5']);
  });

  it('игнорирует даты, если задана только одна из них или если диапазон является недопустимым', () => {
    const onlyIn = { ...DEFAULT_FILTERS, checkIn: '2026-12-12' };
    expect(ids(applyFilters(data, onlyIn))).toEqual(['1', '2', '3', '4', '5']);

    const reversed = { ...DEFAULT_FILTERS, checkIn: '2026-12-14', checkOut: '2026-12-12' };
    expect(ids(applyFilters(data, reversed))).toEqual(['1', '2', '3', '4', '5']);
  });

  it('объединяет фильтрацию и сортировку, не изменяя исходные данные', () => {
    const copy = [...data];
    const result = applyFilters(data, {
      ...DEFAULT_FILTERS,
      query: 'ТИХАЯ',
      sort: 'price-desc',
    });
    expect(ids(result)).toEqual(['3', '5']);
    expect(ids(applyFilters(data, { ...DEFAULT_FILTERS, sort: 'price-asc' }))).toEqual(['2', '4', '1', '5', '3']);
    expect(data).toEqual(copy);
  });

  it('возвращает пустой список, если ничего не найдено', () => {
    expect(applyFilters(data, { ...DEFAULT_FILTERS, query: 'zzz' })).toEqual([]);
  });
});
