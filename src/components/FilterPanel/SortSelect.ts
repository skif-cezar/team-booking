import { SORT_ORDERS, SORT_LABELS } from '../../features/filtering/constants';
import { Control, SortOrder } from '../../types';
import { h } from '../../utils/dom';
import { parseSort } from '../../utils/parse';
import './FilterPanel.scss';

export const createSortSelect = (onChange: (value: SortOrder) => void): Control => {
  const select = h(
    'select',
    { id: 'filter-sort', class: 'sort__select', 'aria-label': 'Сортировка' },
    ...SORT_ORDERS.map((order) => h('option', { value: order }, SORT_LABELS[order])),
  );
  select.addEventListener('change', () => onChange(parseSort(select.value)));

  return {
    element: h('label', { class: 'sort__field' }, h('span', { class: 'sort__text' }, 'Сортировка'), select),
    sync: (state) => {
      select.value = state.sort;
    },
  };
};
