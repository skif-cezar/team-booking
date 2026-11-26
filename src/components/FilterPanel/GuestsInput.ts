import { Control } from '../../types';
import { h } from '../../utils/dom';
import { parseGuests } from '../../utils/parse';

export const createGuestsInput = (onChange: (value: number | null) => void): Control => {
  const input = h('input', {
    id: 'filter-guests',
    type: 'number',
    min: 1,
    step: 1,
    class: 'filters__input',
    placeholder: 'Любое',
    'aria-label': 'Минимальное количество гостей',
  });

  input.addEventListener('input', () => onChange(parseGuests(input.value)));

  return {
    element: h('div', { class: 'filters__field' }, h('span', { class: 'filters__text' }, 'Гостей'), input),
    sync: (state) => {
      const value = state.guests === null ? '' : String(state.guests);
      if (input.value !== value) input.value = value;
    },
  };
};
