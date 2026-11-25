import { Apartment } from '../../types';
import { h } from '../../utils/dom';
import './PropertyCard.scss';

export interface PropertyCardCallbacks {
  onSelect?: (apartment: Apartment) => void;
}

export const createPropertyCard = (apartment: Apartment, callbacks: PropertyCardCallbacks = {}): HTMLElement => {
  const { onSelect } = callbacks;

  const image = h('img', {
    class: 'property-card__image',
    src: apartment.imageUrl,
    alt: apartment.title,
    loading: 'lazy',
    referrerpolicy: 'no-referrer',
  });

  const price = h(
    'span',
    { class: 'property-card__price' },
    `${apartment.pricePerNight.toLocaleString('ru-RU')} ₽/ночь`,
  );
  const title = h('h3', { class: 'property-card__title' }, apartment.title);
  const meta = h(
    'p',
    { class: 'property-card__meta' },
    `${apartment.district} · ${apartment.rooms} комн. · ${apartment.areaSqm} м²`,
  );
  const hook = h('p', { class: 'property-card__hook' }, apartment.shortHook);

  const card = h(
    'article',
    { class: 'property-card' },
    h('div', { class: 'property-card__image-wrap' }, image),
    h('div', { class: 'property-card__body' }, title, price, meta, hook),
  );

  if (onSelect) {
    card.addEventListener('click', () => onSelect(apartment));
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onSelect(apartment);
      }
    });
  }

  return card;
};
