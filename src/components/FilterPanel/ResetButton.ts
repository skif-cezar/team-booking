import { DEFAULT_FILTERS } from '../../features/filtering/constants';
import { Control } from '../../types';
import { h } from '../../utils/dom';

export const createResetButton = (onReset: () => void): Control => {
  const button = h(
    'button',
    {
      type: 'button',
      class: 'filters__reset',
      'aria-label': 'Сбросить все фильтры',
    },
    'Сбросить',
  );

  button.addEventListener('click', onReset);

  return {
    element: h('div', { class: 'filters__field' }, button),
    sync: (state) => {
      // Проверяем отличается ли состояние от дефолтного
      const isDefault =
        state.query === DEFAULT_FILTERS.query &&
        state.category === DEFAULT_FILTERS.category &&
        state.minPrice === DEFAULT_FILTERS.minPrice &&
        state.maxPrice === DEFAULT_FILTERS.maxPrice &&
        state.checkIn === DEFAULT_FILTERS.checkIn &&
        state.checkOut === DEFAULT_FILTERS.checkOut &&
        state.guests === DEFAULT_FILTERS.guests &&
        state.sort === DEFAULT_FILTERS.sort;

      button.disabled = isDefault;
    },
  };
};
