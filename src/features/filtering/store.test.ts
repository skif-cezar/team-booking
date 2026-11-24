import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_FILTERS } from './constants';
import { createStore } from './store';

describe('store', () => {
  it('запускается с фильтрами по умолчанию', () => {
    expect(createStore().getState()).toEqual(DEFAULT_FILTERS);
  });

  it('setFilter обновляет состояние неизменяемым образом и уведомляет подписчиков', () => {
    const store = createStore();
    const listener = vi.fn();
    const before = store.getState();

    store.subscribe(listener);
    store.setFilter('query', 'abc');

    expect(store.getState().query).toBe('abc');
    expect(store.getState()).not.toBe(before);
    expect(before.query).toBe('');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('reset восстанавливает исходные значения', () => {
    const store = createStore();

    store.setFilter('query', 'abc');
    store.setFilter('category', 'Люкс с джакузи');
    store.setFilter('minPrice', 10);
    store.setFilter('checkIn', '2026-12-01');
    store.setFilter('guests', 4);
    store.setFilter('sort', 'price-desc');
    store.reset();

    expect(store.getState()).toEqual(DEFAULT_FILTERS);
  });

  it('отмена подписки прекращает получение уведомлений', () => {
    const store = createStore();
    const listener = vi.fn();

    const unsubscribe = store.subscribe(listener);
    store.setFilter('query', 'a');
    unsubscribe();
    store.setFilter('query', 'b');
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
