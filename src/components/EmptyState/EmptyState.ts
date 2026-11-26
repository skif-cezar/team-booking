import { h } from '../../utils/dom';
import './EmptyState.scss';

export const createEmptyState = (): HTMLElement => {
  return h(
    'div',
    { class: 'empty-state' },
    h('h3', { class: 'empty-state__title' }, 'Ничего не найдено'),
    h('p', { class: 'empty-state__text' }, 'Попробуйте изменить параметры фильтрации или сбросить настройки.'),
  );
};
