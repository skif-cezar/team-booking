import { Store } from '../../features/filtering/store';
import { Control, SearchFilters } from '../../types';
import { h } from '../../utils/dom';
import { createCategorySelect } from './CategorySelect';
import { createDateRangeInput } from './DateRangeInput';
import './FilterPanel.scss';
import { createGuestsInput } from './GuestsInput';
import { createPriceRange } from './PriceRange';
import { createResetButton } from './ResetButton';
import { createSearchInput } from './SearchInput';
import { createSortSelect } from './SortSelect';

const formatFoundCount = (count: number): string => `Найдено: ${count} вариантов`;

export const createFilterPanel = (store: Store) => {
  const resetButton = createResetButton(() => store.reset());
  const status = h('p', { class: 'catalog__status', 'aria-live': 'polite' });

  const filterControls: readonly Control[] = [
    createSearchInput((value) => store.setFilter('query', value)),
    createCategorySelect((value) => store.setFilter('category', value)),
    createDateRangeInput(
      (value) => store.setFilter('checkIn', value),
      (value) => store.setFilter('checkOut', value),
    ),
    createGuestsInput((value) => store.setFilter('guests', value)),
    createPriceRange(
      (value) => store.setFilter('minPrice', value),
      (value) => store.setFilter('maxPrice', value),
    ),
  ];

  const actionControls: readonly Control[] = [createSortSelect((value) => store.setFilter('sort', value)), resetButton];

  const allControls: readonly Control[] = [...filterControls, ...actionControls];

  const criteriaGroup = h(
    'div',
    { class: 'filters__criteria', role: 'group', 'aria-label': 'Параметры поиска' },
    ...filterControls.map((control) => control.element),
  );

  const toolbarGroup = h(
    'div',
    { class: 'filters__toolbar', role: 'group', 'aria-label': 'Сортировка и сброс' },
    status,
    ...actionControls.map((control) => control.element),
  );

  const element = h(
    'form',
    {
      class: 'filters',
      'aria-label': 'Фильтры поиска жилья',
      onSubmit: (event: Event) => event.preventDefault(),
    },
    criteriaGroup,
    toolbarGroup,
  );

  const sync = (state: SearchFilters, foundCount: number): void => {
    allControls.forEach((control) => control.sync(state));
    status.textContent = formatFoundCount(foundCount);
  };

  return { element, sync };
};
