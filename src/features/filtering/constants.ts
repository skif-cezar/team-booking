import { SearchFilters, SortOrder } from '../../types';

export const DEFAULT_FILTERS: SearchFilters = {
  query: '',
  category: 'all',
  minPrice: null,
  maxPrice: null,
  checkIn: null,
  checkOut: null,
  guests: null,
  sort: 'default',
};

export const SORT_ORDERS: readonly SortOrder[] = ['default', 'price-asc', 'price-desc'];

export const SORT_LABELS: Record<SortOrder, string> = {
  default: 'Рекомендуемые Геной',
  'price-desc': 'Сначала дешевле',
  'price-asc': 'Сначала дороже',
};

export const MONTHS_RU = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
] as const;

export const MONTHS_GENITIVE_RU = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
] as const;

export const WEEKDAYS_RU = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] as const;
