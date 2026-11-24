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
