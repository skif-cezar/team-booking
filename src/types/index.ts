export type IsoDate = string; // 'YYYY-MM-DD'

export type PropertyCategory = 'Studio' | 'Apartment' | 'Loft' | 'Penthouse' | 'Townhouse' | 'Villa';

export type SortOrder = 'default' | 'price-asc' | 'price-desc';

export type AmenityId =
  | 'wifi'
  | 'kitchen'
  | 'washer'
  | 'air-conditioning'
  | 'parking'
  | 'balcony'
  | 'workspace'
  | 'dishwasher'
  | 'tv'
  | 'pet-friendly'
  | 'sauna'
  | 'pool';

export interface Amenity {
  id: AmenityId;
  label: string;
  category: 'basics' | 'comfort' | 'extra';
}

export interface PaidService {
  id: 'cleaning' | 'early-checkin' | 'airport-transfer' | 'breakfast';
  label: string;
  price: number; // фиксированная доплата за проживание
}

export interface DateRange {
  checkIn: IsoDate; // дата заезда (включительно)
  checkOut: IsoDate; // дата выезда (в день выезда следующий гость уже может заехать)
}

export interface Property {
  id: string;
  title: string;
  category: PropertyCategory;
  city: string;
  district: string;
  address: string;
  pricePerNight: number;
  cleaningFee: number;
  maxGuests: number;
  bedrooms: number;
  areaSqm: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  gallery: string[];
  shortDescription: string;
  description: string;
  amenities: Amenity[];
  optionalServices: PaidService[];
  bookedRanges: DateRange[]; // базовая занятость из моков
  rules: {
    checkInTime: string; // например, '15:00'
    checkOutTime: string; // например, '11:00'
    smokingAllowed: boolean;
    petsAllowed: boolean;
  };
}

export interface FilterState {
  query: string; // поиск по части названия (без учёта регистра)
  category: PropertyCategory | 'all'; // одна категория или 'all' ('Все категории')
  minPrice: number | null; // «От» (включительно), null = граница не задана
  maxPrice: number | null; // «До» (включительно), null = граница не задана
  checkIn: IsoDate | null; // дата заселения
  checkOut: IsoDate | null; // дата выезда
  guests: number | null; // минимальное число гостей, null = не задано
  sort: SortOrder; // исходный / цена ↑ / цена ↓
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // для учебного localStorage-проекта (например, SHA-256 или простой хеш)
  createdAt: IsoDate;
}

export type BookingStatus = 'confirmed' | 'cancelled';

export interface Booking {
  id: string;
  propertyId: string;
  userId: string;
  checkIn: IsoDate;
  checkOut: IsoDate;
  guests: number;
  selectedServiceIds: PaidService['id'][];
  nights: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}
