import { AMENITIES_CATALOG, OPTIONAL_SERVICES, PROPERTY_CATEGORIES } from '../features/filtering/constants';
import type { Amenity, DateRange, IsoDate, Property, PropertyCategory } from '../types';

const APARTMENTS_IMAGES_DIR = '/images/apartments';
const DEFAULT_IMAGES_COUNT = 10;

const ADJECTIVES = ['Солнечный', 'Уютный', 'Панорамный', 'Тихий', 'Стильный', 'Просторный', 'Светлый', 'Современный'];

const NOUNS_BY_CATEGORY: Record<PropertyCategory, string[]> = {
  Studio: ['Студия у парка', 'Студия в центре', 'Мини-студия', 'Светлая студия'],
  Apartment: ['Апартаменты с видом', 'Городские апартаменты', 'Семейные апартаменты', 'Апартаменты у набережной'],
  Loft: ['Индустриальный лофт', 'Лофт с высокими потолками', 'Творческий лофт', 'Дуплекс-лофт'],
  Penthouse: ['Пентхаус с террасой', 'Небесный пентхаус', 'Видовой пентхаус', 'Пентхаус на крыше'],
  Townhouse: ['Таунхаус в зелёном квартале', 'Угловой таунхаус', 'Семейный таунхаус', 'Таунхаус у леса'],
  Villa: ['Вилла с садом', 'Загородная вилла', 'Вилла у залива', 'Приватная вилла'],
};

const LOCATIONS: ReadonlyArray<{ city: string; district: string; street: string }> = [
  { city: 'Тбилиси', district: 'Вера', street: 'ул. Мераб Костава' },
  { city: 'Тбилиси', district: 'Сололаки', street: 'ул. Ладо Асатиани' },
  { city: 'Батуми', district: 'Приморский бульвар', street: 'ул. Шерифа Химшиашвили' },
  { city: 'Ереван', district: 'Кентрон', street: 'пр. Маштоца' },
  { city: 'Алматы', district: 'Медеуский', street: 'пр. Достык' },
  { city: 'Стамбул', district: 'Каракёй', street: 'Kemankeş Cad.' },
  { city: 'Лиссабон', district: 'Принсипи Реал', street: 'Rua da Escola Politécnica' },
  { city: 'Валенсия', district: 'Русафа', street: 'Carrer de Sueca' },
];

const BASE_PRICE_BY_CATEGORY: Record<PropertyCategory, number> = {
  Studio: 42,
  Apartment: 68,
  Loft: 82,
  Penthouse: 155,
  Townhouse: 115,
  Villa: 190,
};

const GUESTS_BY_CATEGORY: Record<PropertyCategory, number> = {
  Studio: 2,
  Apartment: 4,
  Loft: 3,
  Penthouse: 6,
  Townhouse: 5,
  Villa: 8,
};

/** Сдвигает ISO-дату (YYYY-MM-DD) на `days` дней в UTC */
export function addDaysIso(isoDate: IsoDate, days: number): IsoDate {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));

  return date.toISOString().slice(0, 10);
}

/** Генерирует 1–2 занятых интервала для объекта на основе его индекса и опорной даты */
function buildBookedRanges(index: number, anchorStart: IsoDate): DateRange[] {
  const firstStart = addDaysIso(anchorStart, (index * 3) % 14);
  const firstDuration = 2 + (index % 4); // 2..5 ночей
  const ranges: DateRange[] = [
    {
      checkIn: firstStart,
      checkOut: addDaysIso(firstStart, firstDuration),
    },
  ];

  if (index % 2 === 0) {
    const secondStart = addDaysIso(firstStart, firstDuration + 3 + (index % 3));
    const secondDuration = 2 + ((index + 1) % 3);
    ranges.push({
      checkIn: secondStart,
      checkOut: addDaysIso(secondStart, secondDuration),
    });
  }

  return ranges;
}

function pickAmenities(index: number): Amenity[] {
  return AMENITIES_CATALOG.filter((amenity, amenityIdx) => {
    if (amenity.category === 'basics') return index % 7 !== 0 || amenity.id === 'wifi';
    return (index + amenityIdx * 3) % 2 === 0;
  });
}

/** Возвращает путь к картинке из public/images/apartments/ (1..imagesCount) */
export function getApartmentImagePath(
  imageNumber: number,
  imagesCount = DEFAULT_IMAGES_COUNT,
  extension = 'jpg',
): string {
  const normalized = ((((imageNumber - 1) % imagesCount) + imagesCount) % imagesCount) + 1;

  return `${APARTMENTS_IMAGES_DIR}/apt-${normalized}.${extension}`;
}

export function createMockProperties(
  count = 40,
  anchorStart: IsoDate = '2026-12-01',
  imagesCount = DEFAULT_IMAGES_COUNT,
  extension = 'jpg',
): Property[] {
  return Array.from({ length: count }, (_, idx) => {
    const num = idx + 1;
    const category = PROPERTY_CATEGORIES[idx % PROPERTY_CATEGORIES.length];
    const nouns = NOUNS_BY_CATEGORY[category];
    const adj = ADJECTIVES[idx % ADJECTIVES.length];
    const noun = nouns[Math.floor(idx / PROPERTY_CATEGORIES.length) % nouns.length];
    const loc = LOCATIONS[idx % LOCATIONS.length];

    const basePrice = BASE_PRICE_BY_CATEGORY[category];
    const pricePerNight = basePrice + ((idx * 11) % 35);
    const maxGuests = GUESTS_BY_CATEGORY[category] + (idx % 2);
    const bedrooms = Math.max(1, Math.min(4, Math.ceil(maxGuests / 2)));
    const areaSqm = maxGuests * 14 + 12 + ((idx * 5) % 15);
    const rating = Number((4.3 + ((idx * 7) % 7) * 0.1).toFixed(1));
    const reviewsCount = 8 + ((idx * 13) % 95);

    const imageUrl = getApartmentImagePath(num, imagesCount, extension);
    const amenities = pickAmenities(idx);
    const petsAllowed = amenities.some((a) => a.id === 'pet-friendly');

    return {
      id: `prop-${String(num).padStart(2, '0')}`,
      title: `${adj} ${noun} #${num}`,
      category,
      city: loc.city,
      district: loc.district,
      address: `${loc.street}, ${10 + ((idx * 3) % 80)}`,
      pricePerNight,
      cleaningFee: 15 + (idx % 4) * 10,
      maxGuests,
      bedrooms,
      areaSqm,
      rating,
      reviewsCount,
      imageUrl,
      gallery: [
        imageUrl,
        getApartmentImagePath(num + 1, imagesCount, extension),
        getApartmentImagePath(num + 2, imagesCount, extension),
      ],
      shortDescription: `${category} в районе ${loc.district} (${loc.city}) до ${maxGuests} гостей, ${areaSqm} м².`,
      description:
        `Продуманный вариант категории «${category}» в районе ${loc.district}, город ${loc.city}. ` +
        `Подходит для комфортного проживания до ${maxGuests} гостей (${bedrooms} спален, ${areaSqm} м²). ` +
        `Удобный доступ к транспорту, кафе и прогулочным зонам; при бронировании можно подключить дополнительные услуги.`,
      amenities,
      optionalServices: [...OPTIONAL_SERVICES],
      bookedRanges: buildBookedRanges(idx, anchorStart),
      rules: {
        checkInTime: '15:00',
        checkOutTime: '11:00',
        smokingAllowed: false,
        petsAllowed,
      },
    };
  });
}

export const PROPERTIES: readonly Property[] = createMockProperties(40);
