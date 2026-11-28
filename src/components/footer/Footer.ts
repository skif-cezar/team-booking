import { h } from '../../utils/dom';
import { ROUTES } from '../../app/routes';
import './Footer.scss';

const BRAND_NAME = 'Гена Букинг';
const TAGLINE = 'Комедийный шаблон сервиса аренды жилья в Екатеринбурге · Все цены и календари учебно-развлекательные.';

interface FooterLink {
  path: string;
  label: string;
}

const LINKS: readonly FooterLink[] = [
  { path: ROUTES.catalog, label: 'Поиск жилья' },
  { path: ROUTES.about, label: 'О нас' },
];

const createLink = ({ path, label }: FooterLink): HTMLAnchorElement => {
  const link = h('a', { class: 'footer__link', href: `#${path}${path === ROUTES.catalog ? '?catalog' : ''}` }, label);

  //Скролл до поиска жилья если мы на странице каталога
  link.addEventListener('click', (e) => {
    if (window.location.hash.includes(path)) {
      if (path === ROUTES.catalog) {
        e.preventDefault();
        document.querySelector('#catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });

  return link;
};

export const Footer = (): HTMLElement =>
  h(
    'footer',
    { class: 'footer' },
    h(
      'div',
      { class: 'footer__inner' },
      h(
        'div',
        { class: 'footer__brand' },
        h('p', { class: 'footer__name' }, BRAND_NAME),
        h('p', { class: 'footer__tagline' }, TAGLINE),
      ),
      h('nav', { class: 'footer__nav', 'aria-label': 'Ссылки в подвале' }, ...LINKS.map(createLink)),
    ),
  );
