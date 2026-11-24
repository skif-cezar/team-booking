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
  const path = hash.replace(/^#/, '').replace(/\/+$/, '').toLowerCase();

  return isRoutePath(path) ? path : DEFAULT_ROUTE;
};
