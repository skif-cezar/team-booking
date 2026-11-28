import { Store } from '../features/filtering/store';

export type IsoDate = `${number}-${number}-${number}`; // 'YYYY-MM-DD'

export type BookingReason = string;

export type ApartmentCategory =
  'Классика Букиных' | 'Холостяцкая берлога' | 'Люкс с джакузи' | 'Гараж и дача' | 'Элитный пентхаус';

export type SortOrder = 'default' | 'price-asc' | 'price-desc';

export interface AmenityItem {
  id: string;
  icon: 'sofa' | 'tv' | 'wifi' | 'fridge' | 'coffee' | 'shower' | 'parking' | 'shirt' | 'flame' | 'footprints';
  title: string;
  note: string;
}

export interface ServiceOption {
  id: string;
  title: string;
  description: string;
  price: number;
  unit: string;
}

export interface DateRange {
  checkIn: IsoDate; // дата заезда (включительно)
  checkOut: IsoDate; // дата выезда (в день выезда следующий гость уже может заехать)
}

export interface Apartment {
  id: string;
  slug: string;
  title: string;
  district: string;
  address: string;
  category: ApartmentCategory;
  pricePerNight: number;
  maxGuests: number;
  rooms: number;
  areaSqm: number;
  rating: string;
  reviewsCount: number;
  imageUrl: string;
  shortHook: string;
  fullDescription: string[];
  amenities: AmenityItem[];
  services: ServiceOption[];
  houseRules: string[];
  bookedDates: Record<IsoDate, BookingReason>;
}

export interface SearchFilters {
  query: string; // поиск по части названия (без учёта регистра)
  category: ApartmentCategory | 'all'; // одна категория или 'all' ('Все категории')
  minPrice: number | null; // «От» (включительно), null = граница не задана
  maxPrice: number | null; // «До» (включительно), null = граница не задана
  checkIn: IsoDate | null; // дата заселения
  checkOut: IsoDate | null; // дата выезда
  guests: number | null; // минимальное число гостей, null = не задано
  sort: SortOrder; // исходный / цена ↑ / цена ↓
}

export type BookingStatus = 'confirmed' | 'cancelled';

export interface Booking extends DateRange {
  id: string;
  propertyId: string;
  userId: string;
  guests: number;
  totalPrice: number;
  status: BookingStatus;
  checkIn: IsoDate;
  checkOut: IsoDate;
  createdAt: string; // ISO timestamp
}

export interface DeveloperProfile {
  id: string;
  name: string;
  role: string;
  nickname: string;
  image: string;
  bio: string;
  quote: string;
  specialty: string;
}

export interface Control {
  element: HTMLElement;
  sync: (state: SearchFilters) => void;
}

export interface Page {
  element: HTMLElement;
  destroy?: () => void;
}

export interface AppOptions {
  apartments?: readonly Apartment[];
  filterStore?: Store;
}

export interface AvailabilityCalendarState {
  apartment: Apartment;
  selectedDates?: IsoDate[];
  today?: IsoDate;
}

export interface AvailabilityCalendarComponent {
  element: HTMLElement;
  sync: (state: AvailabilityCalendarState) => void;
}

export interface YearMonth {
  year: number;
  monthIndex0: number;
}

export interface DayCellData {
  kind: 'empty' | 'day';
  iso?: IsoDate;
  dayNumber?: number;
  isPast?: boolean;
  isBusy?: boolean;
  isSelected?: boolean;
  statusLabel?: string;
  ariaLabel?: string;
}

export interface BusyDateEntry {
  iso: IsoDate;
  formattedDate: string;
  reason: string;
}
