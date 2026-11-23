import { describe, expect, it } from 'vitest';
import { DEFAULT_ROUTE, ROUTES, getActivePath } from './routes';

describe('getActivePath', () => {
  it('по умолчанию открывается страница «О нас»', () => {
    expect(DEFAULT_ROUTE).toBe(ROUTES.about);
  });

  it.each(['', '#', '#/'])('пустой хэш "%s" ведёт на «О нас»', (hash) => {
    expect(getActivePath(hash)).toBe(ROUTES.about);
  });

  it('распознаёт «О нас»', () => {
    expect(getActivePath('#/about')).toBe(ROUTES.about);
  });

  it('распознаёт «Поиск жилья»', () => {
    expect(getActivePath('#/catalog')).toBe(ROUTES.catalog);
  });

  it.each(['#/unknown', '#/admin', '#about', '#/catalog/page/2'])('неизвестный путь "%s" ведёт на «О нас»', (hash) => {
    expect(getActivePath(hash)).toBe(ROUTES.about);
  });

  it('игнорирует слэш в конце пути', () => {
    expect(getActivePath('#/catalog/')).toBe(ROUTES.catalog);
    expect(getActivePath('#/about/')).toBe(ROUTES.about);
  });

  it('работает и без символа #', () => {
    expect(getActivePath('/catalog')).toBe(ROUTES.catalog);
  });

  it.each(['#/Catalog', '#/CATALOG', '#/catALoG'])('работает с разным регистром для catalog: %s', (hash) => {
    expect(getActivePath(hash)).toBe(ROUTES.catalog);
  });

  it.each(['#/About', '#/ABOUT', '#/aboUT'])('работает с разным регистром для about: %s', (hash) => {
    expect(getActivePath(hash)).toBe(ROUTES.about);
  });
});
