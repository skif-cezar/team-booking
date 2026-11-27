import { h } from '../../utils/dom';

export const createCatalogHero = (): HTMLElement => {
  return h(
    'section',
    { class: 'catalog-hero' },
    h(
      'div',
      { class: 'catalog-hero__content' },
      h('span', { class: 'catalog-hero__badge' }, 'Екатеринбург и окрестности'),
      h('h1', { class: 'catalog-hero__title' }, 'Квартиры с проверенным диваном и честным календарём'),
      h(
        'p',
        { class: 'catalog-hero__desc' },
        'Подбирайте жильё в духе семьи Букиных: от легендарной двушки на Гагарина до тихой дачи на Шарташе, где никто не заставит полоть грядки.',
      ),
    ),
  );
};
