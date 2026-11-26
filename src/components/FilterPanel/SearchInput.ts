import { Control } from '../../types';
import { h } from '../../utils/dom';
import './FilterPanel.scss';

export const createSearchInput = (onChange: (value: string) => void): Control => {
  const input = h('input', {
    id: 'filter-search',
    type: 'search',
    class: 'filters__input',
    placeholder: 'Название, район, адрес…',
    'aria-label': 'Поиск по названию, району и адресу',
  });

  input.addEventListener('input', () => onChange(input.value));

  return {
    element: h('div', { class: 'filters__field' }, h('span', { class: 'filters__text' }, 'Поиск'), input),
    sync: (state) => {
      if (input.value !== state.query) input.value = state.query;
    },
  };
};
