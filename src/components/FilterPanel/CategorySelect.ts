import { CATEGORIES } from '../../data/properties';
import { ApartmentCategory } from '../../types';
import { Control } from '../../types';
import { h } from '../../utils/dom';
import './FilterPanel.scss';

export const createCategorySelect = (onChange: (value: ApartmentCategory | 'all') => void): Control => {
  const select = h(
    'select',
    { id: 'filter-category', class: 'sort__select', 'aria-label': 'Категория' },
    h('option', { value: 'all' }, 'Все категории'),
    ...CATEGORIES.map((cat) => h('option', { value: cat }, cat)),
  );

  select.addEventListener('change', () => {
    const value = select.value as ApartmentCategory | 'all';
    onChange(value);
  });

  return {
    element: h('div', { class: 'filters__field' }, h('span', { class: 'filters__text' }, 'Категория'), select),
    sync: (state) => {
      if (select.value !== state.category) select.value = state.category;
    },
  };
};
