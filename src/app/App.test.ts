import { beforeEach, describe, expect, it } from 'vitest';
import { App } from './App';

/** Меняет хэш в адресе без события, чтобы тест сам решал, когда его вызвать */
const setHash = (hash: string): void => {
  const normalizedHash = hash && !hash.startsWith('#') ? `#${hash}` : hash;
  window.history.replaceState(null, '', `${window.location.pathname}${normalizedHash}`);
};

const emitHashChange = (): void => {
  window.dispatchEvent(new HashChangeEvent('hashchange'));
};

/** Подпись ссылки, которая сейчас помечена как текущая страница */
const getActiveLabel = (root: HTMLElement): string | null =>
  root.querySelector('[aria-current="page"]')?.textContent?.trim() ?? null;

describe('App', () => {
  beforeEach(() => {
    setHash('');
  });

  afterEach(() => {
    setHash('');
  });

  it('содержит шапку и контейнер для страниц', () => {
    const root = App();

    expect(root.querySelector('header')).not.toBeNull();
    expect(root.querySelector('main')).not.toBeNull();
  });

  it('без хэша подсвечивает «О нас»', () => {
    expect(getActiveLabel(App())).toBe('О нас');
  });

  it('при старте всегда открывает и подсвечивает «О нас», даже если хэш был другим', () => {
    setHash('#/catalog');

    const root = App();

    expect(window.location.hash).toBe('#/about');
    expect(getActiveLabel(root)).toBe('О нас');
  });

  it('обновляет подсветку при смене хэша', () => {
    const root = App();

    setHash('#/catalog');
    emitHashChange();

    expect(getActiveLabel(root)).toBe('Поиск жилья');
  });

  it('после смены хэша в приложении остаётся одна шапка', () => {
    const root = App();

    setHash('#/catalog');
    emitHashChange();

    expect(root.querySelectorAll('header')).toHaveLength(1);
  });

  it('при смене хэша не пересоздаёт контейнер страниц', () => {
    const root = App();
    const main = root.querySelector('main');

    setHash('#/catalog');
    emitHashChange();

    expect(root.querySelector('main')).toBe(main);
  });
});
