import { Control } from '../../types';
import { h } from '../../utils/dom';

export const createSearchInput = (onChange: (value: string) => void): Control => {
  const input = h('input', {
    id: 'filter-search',
    type: 'search',
    class: 'filters__input filters__input--search',
    placeholder: 'Название или район',
    'aria-label': 'Поиск по названию, району и адресу',
  });

  input.addEventListener('input', () => onChange(input.value));

  return {
    element: h('div', { class: 'filters__field' }, h('span', { class: 'filters__text' }, 'Название'), input),
    sync: (state) => {
      if (input.value !== state.query) input.value = state.query;
    },
  };
};
