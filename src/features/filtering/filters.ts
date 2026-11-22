import type { FilterState, IsoDate, Property, SortOrder } from '../../types';
import { isRangeAvailable, isValidRange } from '../booking/booking';

/**
 * Поиск по названию: true, если название содержит введённый текст.
 * Регистр и пробелы по краям запроса игнорируются.
 * Пустая строка подходит любому жилью (фильтр не применяется).
 */
export const matchesSearch = (property: Property, search: string): boolean => {
  const query = search.trim().toLowerCase();

  return query === '' || property.title.toLowerCase().includes(query);
};

/**
 * Фильтр по категории: true, если выбрано «Все категории» ('all')
 * или категория жилья совпадает с выбранной.
 */
export const matchesCategory = (property: Property, category: FilterState['category']): boolean => {
  return category === 'all' || property.category === category;
};

/**
 * Фильтр по цене за ночь: границы «От» и «До» включительно.
 * Если граница равна null (поле пустое), она не применяется.
 */
export const matchesPrice = (property: Property, minPrice: number | null, maxPrice: number | null): boolean => {
  const { pricePerNight } = property;

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
export const matchesGuests = (property: Property, guests: number): boolean => {
  // если кол-во гостей не указано, то фильтр подходит
  if (guests === null || guests === undefined) {
    return true;
  }

  return property.maxGuests >= guests;
};

/**
 * Фильтр по датам: true, если жильё свободно на весь период [checkIn, checkOut).
 * Фильтр применяется, только когда обе даты заданы и корректны (выезд позже заезда).
 * Иначе возвращает true, то есть ничего не скрывает.
 * Доступность проверяется по списку занятых периодов property.bookedRanges.
 */
export const matchesDates = (property: Property, checkIn: IsoDate | null, checkOut: IsoDate | null): boolean => {
  if (!checkIn || !checkOut) {
    return true;
  }

  if (!isValidRange(checkIn, checkOut)) {
    return true;
  }

  return isRangeAvailable(property.bookedRanges, { checkIn, checkOut });
};

/**
 * Оставляет только то жильё, которое подходит под ВСЕ фильтры одновременно:
 * поиск, категория, цена, гости и даты (логическое «И»).
 * Порядок элементов сохраняется, исходный массив не меняется.
 */
export const filterProperties = (_properties: readonly Property[], _filters: FilterState): Property[] => {
  throw new Error('Not implemented');
};

/**
 * Сортирует жильё по цене за ночь:
 *  - 'price-asc'  — по возрастанию;
 *  - 'price-desc' — по убыванию;
 *  - 'default'    — исходный порядок.
 * Всегда возвращает НОВЫЙ массив (копию), чтобы не мутировать входные данные,
 * ведь sort() изменяет массив, на котором вызван.
 */
export const sortProperties = (_properties: readonly Property[], _order: SortOrder): Property[] => {
  throw new Error('Not implemented');
};

/**
 * Главная функция: сначала фильтрует жильё по всем условиям,
 * затем сортирует результат. Именно её вызывает страница каталога
 * при каждом изменении фильтров.
 */
export const applyFilters = (_properties: readonly Property[], _filters: FilterState): Property[] => {
  throw new Error('Not implemented');
};
