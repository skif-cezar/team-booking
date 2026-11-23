import { Apartment, DateRange, IsoDate, SearchFilters, SortOrder } from '../../types';
import { areBookedDatesAvailable, isRangeAvailable, isValidRange } from '../booking/booking';

/**
 * Поиск по названию: true, если название содержит введённый текст.
 * Регистр и пробелы по краям запроса игнорируются.
 * Пустая строка подходит любому жилью (фильтр не применяется).
 */
export const matchesSearch = (apartment: Apartment, search: string): boolean => {
  const query = search.trim().toLowerCase();

  return query === '' || apartment.title.toLowerCase().includes(query);
};

/**
 * Фильтр по категории: true, если выбрано «Все категории» ('all')
 * или категория жилья совпадает с выбранной.
 */
export const matchesCategory = (apartment: Apartment, category: SearchFilters['category']): boolean => {
  return category === 'all' || apartment.category === category;
};

/**
 * Фильтр по цене за ночь: границы «От» и «До» включительно.
 * Если граница равна null (поле пустое), она не применяется.
 */
export const matchesPrice = (apartment: Apartment, minPrice: number | null, maxPrice: number | null): boolean => {
  const { pricePerNight } = apartment;

  if (minPrice !== null && pricePerNight < minPrice) {
    return false;
  }

  if (maxPrice !== null && pricePerNight > maxPrice) {
    return false;
  }

  return true;
};

/**
 * Фильтр по гостям: true, если жильё вмещает не меньше гостей, чем запрошено.
 * Например, для 3 гостей студия на 2 человека не подойдёт.
 */
export const matchesGuests = (apartment: Apartment, guests: number | null): boolean => {
  // если кол-во гостей не указано, то фильтр подходит
  if (guests === null || guests === undefined) {
    return true;
  }

  return apartment.maxGuests >= guests;
};

/**
 * Фильтр по датам: true, если жильё свободно на весь период [checkIn, checkOut).
 * Фильтр применяется, только когда обе даты заданы и корректны (выезд позже заезда).
 * Иначе возвращает true, то есть ничего не скрывает.
 * Доступность проверяется по списку занятых периодов property.bookedRanges.
 */
export const matchesDates = (
  apartment: Apartment,
  checkIn: IsoDate | null,
  checkOut: IsoDate | null,
  extraBookedRanges: readonly DateRange[] = [],
): boolean => {
  if (!checkIn || !checkOut) {
    return true;
  }

  if (!isValidRange(checkIn, checkOut)) {
    return true;
  }

  const requestedRange: DateRange = { checkIn, checkOut };

  const datesFree = areBookedDatesAvailable(apartment.bookedDates, requestedRange);
  if (!datesFree) {
    return false;
  }

  if (extraBookedRanges.length > 0) {
    return isRangeAvailable(extraBookedRanges, requestedRange);
  }

  return true;
};

/**
 * Оставляет только то жильё, которое подходит под ВСЕ фильтры одновременно:
 * поиск, категория, цена, гости и даты (логическое «И»).
 * Порядок элементов сохраняется, исходный массив не меняется.
 */
export const filterProperties = (apartments: readonly Apartment[], filters: SearchFilters): Apartment[] => {
  return apartments.filter(
    (apartment) =>
      matchesSearch(apartment, filters.query) &&
      matchesCategory(apartment, filters.category) &&
      matchesPrice(apartment, filters.minPrice, filters.maxPrice) &&
      matchesGuests(apartment, filters.guests) &&
      matchesDates(apartment, filters.checkIn, filters.checkOut),
  );
};

/**
 * Сортирует жильё по цене за ночь:
 *  - 'price-asc'  — по возрастанию;
 *  - 'price-desc' — по убыванию;
 *  - 'default'    — исходный порядок.
 * Всегда возвращает НОВЫЙ массив (копию), чтобы не мутировать входные данные,
 * ведь sort() изменяет массив, на котором вызван.
 */
export const sortProperties = (apartments: readonly Apartment[], order: SortOrder): Apartment[] => {
  switch (order) {
    case 'price-asc':
      return [...apartments].sort((a, b) => a.pricePerNight - b.pricePerNight);
    case 'price-desc':
      return [...apartments].sort((a, b) => b.pricePerNight - a.pricePerNight);
    default:
      return [...apartments];
  }
};

/**
 * Главная функция: сначала фильтрует жильё по всем условиям,
 * затем сортирует результат. Именно её вызывает страница каталога
 * при каждом изменении фильтров.
 */
export const applyFilters = (apartments: readonly Apartment[], filters: SearchFilters): Apartment[] => {
  return sortProperties(filterProperties(apartments, filters), filters.sort);
};
