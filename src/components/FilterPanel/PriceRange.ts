import { Control } from '../../types';
import { h } from '../../utils/dom';
import { parsePrice } from '../../utils/parse';

export const createPriceRange = (
  onFromChange: (value: number | null) => void,
  onToChange: (value: number | null) => void,
): Control => {
  const makeInput = (id: string, label: string) =>
    h('input', {
      id: id,
      type: 'number',
      min: 0,
      step: 100,
      class: 'filters__input',
      placeholder: label,
      'aria-label': `Цена за сутки ${label.toLowerCase()}`,
    });

  const from = makeInput('filter-price-from', 'От');
  const to = makeInput('filter-price-to', 'До');
  from.addEventListener('input', () => onFromChange(parsePrice(from.value)));
  to.addEventListener('input', () => onToChange(parsePrice(to.value)));

  const show = (value: number | null): string => (value === null ? '' : String(value));

  return {
    element: h(
      'div',
      { class: 'filters__field' },
      h('span', null, 'Цена за сутки (₽)'),
      h('div', { class: 'filters__range' }, from, to),
    ),
    sync: (state) => {
      if (parsePrice(from.value) !== state.minPrice) from.value = show(state.minPrice);
      if (parsePrice(to.value) !== state.maxPrice) to.value = show(state.maxPrice);
    },
  };
};
