import { ROUTES } from '../../app/routes';
import type { RoutePath } from '../../app/routes';
import { h } from '../../utils/dom';

interface NavLink {
  path: RoutePath;
  label: string;
}

/** Пункты меню в порядке отображения */
const NAV_LINKS: readonly NavLink[] = [
  { path: ROUTES.about, label: 'О нас' },
  { path: ROUTES.catalog, label: 'Поиск жилья' },
];

const createLink = ({ path, label }: NavLink, activePath: RoutePath): HTMLAnchorElement => {
  const isActive = path === activePath;

  return h(
    'a',
    {
      class: isActive ? 'header__link header__link--active' : 'header__link',
      href: `#${path}`,
      // null не создаёт атрибут: aria-current есть только у активной ссылки
      'aria-current': isActive ? 'page' : null,
    },
    label,
  );
};

/**
 * Шапка сайта с навигацией «О нас» / «Поиск жилья».
 * Ссылка, совпадающая с `activePath`, получает класс `header__link--active`
 * и атрибут `aria-current="page"`.
 *
 * @param activePath - Активный маршрут (результат getActivePath)
 */
export const Header = (activePath: RoutePath): HTMLElement =>
  h(
    'header',
    { class: 'header' },
    h('nav', { class: 'header__nav' }, ...NAV_LINKS.map((link) => createLink(link, activePath))),
  );
