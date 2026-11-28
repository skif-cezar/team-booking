import { h } from '../../utils/dom';
import './EmptyState.scss';

export const createEmptyState = (): HTMLElement => {
  return h(
    'div',
    { class: 'empty-state' },
    h('h3', { class: 'empty-state__title' }, 'Ничего не найдено'),
    h(
      'p',
      { class: 'empty-state__text' },
      'Даже Гена на чердаке обувного магазина не смог подобрать квартиру по таким строгим условиям. Попробуйте смягчить бюджет или выбрать другие даты.',
    ),
  );
};
