import { SearchFilters } from '../../types';

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
