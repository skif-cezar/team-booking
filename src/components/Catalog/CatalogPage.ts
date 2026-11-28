import { applyFilters } from '../../features/filtering/filters';
import { Store } from '../../features/filtering/store';
import { Apartment, Page, SearchFilters } from '../../types';
import { h } from '../../utils/dom';
import { createFilterPanel } from '../FilterPanel/FilterPanel';
import { createPropertyList, PropertyListCallbacks } from '../PropertyCard/PropertyList';
import { createCatalogHero } from '../Catalog/CatalogHero';
import './CatalogPage.scss';
import './CatalogHero.scss';
import { createEmptyState } from '../EmptyState/EmptyState';

// Выбор контента результатов: пустое состояние или список апартаментов
const createResultsContent = (found: Apartment[], callbacks: PropertyListCallbacks): HTMLElement =>
  found.length === 0 ? createEmptyState() : createPropertyList(found, callbacks);

/** Собирает FilterPanel + PropertyList и синхронизирует их со store. */
export const CatalogPage = (
  store: Store,
  apartments: readonly Apartment[],
  callbacks: PropertyListCallbacks = {},
): Page => {
  const panel = createFilterPanel(store);
  const results = h('section', { class: 'catalog__results' });

  const render = (state: SearchFilters): void => {
    const found = applyFilters(apartments, state);

    panel.sync(state, found.length);
    results.replaceChildren(createResultsContent(found, callbacks));
  };

  const element = h('section', { id: 'catalog', class: 'catalog' }, createCatalogHero(), panel.element, results);

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
