import { describe, expect, it } from 'vitest';
import { ROUTES } from '../../app/routes';
import { Header } from './Header';

/** Ссылки навигации (без логотипа) */
const getNavLinks = (header: HTMLElement): HTMLAnchorElement[] => Array.from(header.querySelectorAll('.header__nav a'));

describe('Header', () => {
  it('содержит навигацию внутри шапки', () => {
    const header = Header(ROUTES.about);

    expect(header.tagName).toBe('HEADER');
    expect(header.querySelector('.header__inner nav')).not.toBeNull();
  });

  it('логотип ведёт на главную и имеет название для скринридеров', () => {
    const logo = Header(ROUTES.about).querySelector('.header__logo');

    expect(logo?.getAttribute('href')).toBe('#/');
    expect(logo?.getAttribute('aria-label')).toBe('Гена Букинг');
    expect(logo?.textContent).toBe('Гена Букинг');
  });

  it('показывает ссылки «О нас» и «Поиск жилья» с правильными адресами', () => {
    const links = getNavLinks(Header(ROUTES.about));

    expect(links.map((link) => link.textContent)).toEqual(['О нас', 'Поиск жилья']);
    expect(links.map((link) => link.getAttribute('href'))).toEqual(['#/about', '#/catalog']);
  });

  it('подсвечивает «О нас», когда открыта эта страница', () => {
    const [about, catalog] = getNavLinks(Header(ROUTES.about));

    expect(about.classList.contains('header__link--active')).toBe(true);
    expect(about.getAttribute('aria-current')).toBe('page');
    expect(catalog.classList.contains('header__link--active')).toBe(false);
    expect(catalog.hasAttribute('aria-current')).toBe(false);
  });

  it('подсвечивает «Поиск жилья», когда открыт каталог', () => {
    const [about, catalog] = getNavLinks(Header(ROUTES.catalog));

    expect(catalog.classList.contains('header__link--active')).toBe(true);
    expect(catalog.getAttribute('aria-current')).toBe('page');
    expect(about.classList.contains('header__link--active')).toBe(false);
    expect(about.hasAttribute('aria-current')).toBe(false);
  });

  it.each(Object.values(ROUTES))('для пути %s подсвечена ровно одна ссылка', (path) => {
    const header = Header(path);

    expect(header.querySelectorAll('.header__link--active')).toHaveLength(1);
    expect(header.querySelectorAll('[aria-current="page"]')).toHaveLength(1);
  });

  it('у всех ссылок навигации есть базовый класс', () => {
    for (const link of getNavLinks(Header(ROUTES.catalog))) {
      expect(link.classList.contains('header__link')).toBe(true);
    }
  });
});
