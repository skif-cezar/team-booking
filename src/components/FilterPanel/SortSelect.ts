import { SORT_ORDERS, SORT_LABELS } from '../../features/filtering/constants';
import { Control, SortOrder } from '../../types';
import { h } from '../../utils/dom';
import { parseSort } from '../../utils/parse';

export const createSortSelect = (onChange: (value: SortOrder) => void): Control => {
  const select = h(
    'select',
    { id: 'filter-sort', class: 'filters__input', 'aria-label': 'Сортировка' },
    ...SORT_ORDERS.map((order) => h('option', { value: order }, SORT_LABELS[order])),
  );
  select.addEventListener('change', () => onChange(parseSort(select.value)));

  return {
    element: h('label', { class: 'filters__field' }, h('span', null, 'Сортировка'), select),
    sync: (state) => {
      select.value = state.sort;
    },
  };
};
