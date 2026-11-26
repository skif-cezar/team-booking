import { Control } from '../../types';
import { h } from '../../utils/dom';
import './FilterPanel.scss';

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
    sync: () => {
      // Кнопка сброса обычно всегда активна
    },
  };
};
