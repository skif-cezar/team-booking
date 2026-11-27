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
    element: button,
    sync: () => {
      // Кнопка сброса обычно всегда активна
    },
  };
};
