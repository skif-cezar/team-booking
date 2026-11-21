import { PropertyCategory, FilterState, Amenity, PaidService } from '../../types';

export const PROPERTY_CATEGORIES: readonly PropertyCategory[] = [
  'Studio',
  'Apartment',
  'Loft',
  'Penthouse',
  'Townhouse',
  'Villa',
];

export const DEFAULT_FILTERS: FilterState = {
  query: '',
  category: 'all',
  minPrice: null,
  maxPrice: null,
  checkIn: null,
  checkOut: null,
  guests: null,
  sort: 'default',
};

export const AMENITIES_CATALOG: readonly Amenity[] = [
  { id: 'wifi', label: 'Wi-Fi 300 Мбит/с', category: 'basics' },
  { id: 'kitchen', label: 'Оборудованная кухня', category: 'basics' },
  { id: 'washer', label: 'Стиральная машина', category: 'basics' },
  { id: 'air-conditioning', label: 'Кондиционер', category: 'comfort' },
  { id: 'workspace', label: 'Рабочее место', category: 'comfort' },
  { id: 'balcony', label: 'Балкон или терраса', category: 'comfort' },
  { id: 'dishwasher', label: 'Посудомоечная машина', category: 'comfort' },
  { id: 'tv', label: 'Smart TV', category: 'comfort' },
  { id: 'parking', label: 'Парковка', category: 'extra' },
  { id: 'pet-friendly', label: 'Можно с питомцами', category: 'extra' },
  { id: 'sauna', label: 'Сауна', category: 'extra' },
  { id: 'pool', label: 'Бассейн', category: 'extra' },
];

export const OPTIONAL_SERVICES: readonly PaidService[] = [
  { id: 'cleaning', label: 'Финальная уборка', price: 25 },
  { id: 'early-checkin', label: 'Ранний заезд (с 10:00)', price: 20 },
  { id: 'breakfast', label: 'Завтрак на двоих', price: 18 },
  { id: 'airport-transfer', label: 'Трансфер из аэропорта', price: 40 },
];
