/** Известные маршруты приложения (путь без символа #) */
export const ROUTES = {
  about: '/about',
  catalog: '/catalog',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

/** Страница по умолчанию: открывается при пустом или неизвестном адресе */
export const DEFAULT_ROUTE: RoutePath = ROUTES.about;

const KNOWN_PATHS: readonly string[] = Object.values(ROUTES);

const isRoutePath = (value: string): value is RoutePath => KNOWN_PATHS.includes(value);

/**
 * Определяет активный маршрут по хэшу адресной строки (`location.hash`).
 *
 * - '#/catalog' и '#/catalog/' дают '/catalog';
 * - пустой хэш, '#', '#/' и любой неизвестный путь дают маршрут по умолчанию ('/about').
 *
 * Функция чистая: не обращается к `location`, поэтому легко тестируется.
 *
 * Регистр букв не важен
 */
export const getActivePath = (hash: string): RoutePath => {
  // Отбрасываем query-часть: '#/catalog?catalog' → '/catalog'
  const [rawPath = ''] = hash.replace(/^#/, '').split('?');
  const path = rawPath.replace(/\/+$/, '').toLowerCase();

  return isRoutePath(path) ? path : DEFAULT_ROUTE;
};

/** Есть ли в хэше запрос на прокрутку к фильтрам: '#/catalog?catalog' */
export const shouldScrollToCatalog = (hash: string): boolean => hash.split('?')[1]?.includes('catalog') ?? false;
