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

export const createFilterPanel = (store: Store) => {
  const resetButton = createResetButton(() => store.reset());

  const controls: readonly Control[] = [
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
    createSortSelect((value) => store.setFilter('sort', value)),
    resetButton,
  ];

  const element = h(
    'form',
    { class: 'filters', onSubmit: (event: Event) => event.preventDefault() },
    ...controls.map((control) => control.element),
  );

  const sync = (state: SearchFilters): void => controls.forEach((control) => control.sync(state));

  return { element, sync };
};
