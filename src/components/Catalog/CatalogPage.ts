import { applyFilters } from '../../features/filtering/filters';
import { Store } from '../../features/filtering/store';
import { Apartment, Page, SearchFilters } from '../../types';
import { h } from '../../utils/dom';
import { createFilterPanel } from '../FilterPanel/FilterPanel';
import { createPropertyList, PropertyListCallbacks } from '../PropertyCard/PropertyList';

const formatFoundCount = (count: number): string => `Найдено: ${count}`;

/** Собирает FilterPanel + PropertyList и синхронизирует их со store. */
export const CatalogPage = (
  store: Store,
  apartments: readonly Apartment[],
  callbacks: PropertyListCallbacks = {},
): Page => {
  const panel = createFilterPanel(store);
  const status = h('p', { class: 'catalog__status', 'aria-live': 'polite' });
  const results = h('div', { class: 'catalog__results' });

  const render = (state: SearchFilters): void => {
    const found = applyFilters(apartments, state);

    panel.sync(state);
    status.textContent = formatFoundCount(found.length);
    results.replaceChildren(createPropertyList(found, callbacks));
  };

  const element = h('section', { class: 'catalog' }, h('h1', {}, 'Поиск жилья'), panel.element, status, results);

  render(store.getState());
  const unsubscribe = store.subscribe(render);

  return {
    element,
    destroy: () => {
      unsubscribe();
      results.replaceChildren();
    },
  };
};
